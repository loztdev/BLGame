/* Rendering layer - reads `state` and writes DOM. No game logic lives here. */

function fmt(n) { return Math.round(n).toLocaleString(); }

function rarityColor(rarityKey) { return RARITY[rarityKey] ? RARITY[rarityKey].color : '#ccc'; }

function gameBadge(game) {
  if (!game) return '';
  return `<span class="game-badge">${GAMES[game] ? GAMES[game].label : game}</span>`;
}

function itemStatLine(item) {
  switch (item.category) {
    case 'gun': return `Damage <b>${fmt(item.damage)}</b> &middot; Fire Rate <b>${item.fireRate}</b>/s &middot; DPS <b>${fmt(item.dps)}</b>`;
    case 'shield': return `Capacity <b>${fmt(item.capacity)}</b> &middot; Recharge <b>${fmt(item.rechargeRate)}</b>/s`;
    case 'grenade': return `Damage <b>${fmt(item.damage)}</b>`;
    case 'artifact':
    case 'classmod': return `Bonus <b>+${fmt(item.bonusPercent)}%</b>`;
  }
  return '';
}

function itemTypeLine(item) {
  const bits = [];
  if (item.type) bits.push(item.type);
  if (item.grenadeType) bits.push(item.grenadeType);
  if (item.manufacturer) bits.push(item.manufacturer);
  if (item.element && ELEMENTS[item.element] && item.element !== 'none') bits.push(ELEMENTS[item.element].label);
  if (item.forClass) {
    const h = VAULT_HUNTERS.find(v => v.id === item.forClass);
    if (h) bits.push(`for ${h.name}`);
  }
  return bits.join(' &middot; ');
}

function renderItemCard(item, opts) {
  opts = opts || {};
  const color = rarityColor(item.rarity);
  const versionTag = item.versionRank ? `<span class="encounter-tag boss">Hellfire rank #${item.versionRank}/5</span>` : '';
  let actions = '';
  if (opts.canEquip) actions += `<button class="btn small" data-action="equip" data-id="${item.id}" data-cat="${item.category}">Equip</button>`;
  if (opts.canUnequip) actions += `<button class="btn small secondary" data-action="unequip" data-slot="${opts.slot}">Unequip</button>`;
  if (opts.canSell) actions += `<button class="btn small secondary" data-action="sell" data-id="${item.id}" data-cat="${item.category}">Sell ($${fmt(sellValue(item))})</button>`;

  return `<div class="item-card" style="border-left-color:${color}">
    <div class="item-name" style="color:${color}">${item.name} ${item.isUnique ? '★' : ''}</div>
    <div class="item-meta">${RARITY[item.rarity].label} ${gameBadge(item.game)} Lv.${item.level}</div>
    <div class="item-meta">${itemTypeLine(item)}</div>
    <div class="item-stats">${itemStatLine(item)}</div>
    ${item.effect ? `<div class="item-effect">${item.effect}</div>` : ''}
    ${versionTag}
    <div class="actions">${actions}</div>
  </div>`;
}

function sellValue(item) {
  const base = { common: 8, uncommon: 18, rare: 40, epic: 90, legendary: 180, unique: 260 };
  return Math.round((base[item.rarity] || 8) * (1 + item.level * 0.3));
}

/* ----------------------------------------------------------- HUD ---- */
function renderHud() {
  const hud = document.getElementById('hud');
  const hunter = state.activeHunterId ? VAULT_HUNTERS.find(h => h.id === state.activeHunterId) : null;
  hud.innerHTML = `
    <span>Lv <b>${state.level}</b></span>
    <span>XP <b>${fmt(state.xp)}</b>/${fmt(state.xpToNext)}</span>
    <span>Cash <b>$${fmt(state.cash)}</b></span>
    <span>Prestige <b>${state.prestige}</b> (+${state.prestigeBonusPercent}% dmg)</span>
    <span>Active Hunter <b>${hunter ? hunter.name : 'None'}</b></span>
  `;
}

/* ------------------------------------------------------ ENCOUNTER ---- */
function renderEncounterPanel() {
  const panel = document.getElementById('encounterPanel');
  const enc = state.currentEncounter;
  if (!enc) {
    panel.innerHTML = `<div class="encounter-card">
      <p>No encounter active.</p>
      <button class="btn" id="exploreBtn">Explore</button>
    </div>`;
    return;
  }
  const hpPct = Math.max(0, (enc.hp / enc.maxHp) * 100);
  panel.innerHTML = `<div class="encounter-card">
    <span class="encounter-tag ${enc.isBoss ? 'boss' : ''}">${enc.isBoss ? 'RARE BOSS' : 'Encounter'} &middot; ${GAMES[enc.game] ? GAMES[enc.game].label : enc.game} &middot; Lv ${enc.level}</span>
    <div class="encounter-name">${enc.name}</div>
    <div class="bar-outer"><div class="bar-inner bar-hp" style="width:${hpPct}%"></div></div>
    <p>HP: ${fmt(enc.hp)} / ${fmt(enc.maxHp)} &middot; Dmg/s: ${enc.dmgPerSec}</p>
    <button class="btn" id="fightBtn">Fight!</button>
    <button class="btn secondary" id="fleeBtn">Flee</button>
  </div>`;
}

function renderBattleLog(result) {
  const el = document.getElementById('battleLog');
  if (!result) { el.innerHTML = '<div class="hint">No battles fought yet.</div>'; return; }
  const lines = result.log.slice();
  if (result.win) lines.push(`Victory in ${result.timeTaken}s! Dealt ${fmt(result.damageDealt)}, took ${fmt(result.damageTaken)}.`);
  else if (result.timedOut) lines.push(`Stalemate after ${result.timeTaken}s - the enemy was too tough. Retreat!`);
  else lines.push(`Defeat after ${result.timeTaken}s. Dealt ${fmt(result.damageDealt)}, took ${fmt(result.damageTaken)}.`);
  el.innerHTML = lines.map(l => `<div>${l}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

/* ------------------------------------------------------ INVENTORY ---- */
let inventoryFilter = 'gun';

function renderInvFilter() {
  const el = document.getElementById('invFilter');
  el.innerHTML = LOOT_CATEGORIES.map(c =>
    `<button data-cat="${c}" class="${inventoryFilter === c ? 'active' : ''}">${c}</button>`
  ).join('');
}

function renderEquipped() {
  const el = document.getElementById('equippedGrid');
  const slots = [
    ['gun1', 'Primary Gun'], ['gun2', 'Secondary Gun'], ['shield', 'Shield'],
    ['grenade', 'Grenade Mod'], ['artifact', 'Artifact'], ['classmod', 'Class Mod'],
  ];
  el.innerHTML = slots.map(([slot, label]) => {
    const item = state.equipped[slot];
    if (!item) return `<div class="item-card"><div class="item-name">${label}</div><div class="empty-slot">Empty</div></div>`;
    return renderItemCard(item, { canUnequip: true, slot });
  }).join('');
}

function renderInventory() {
  renderInvFilter();
  const el = document.getElementById('inventoryGrid');
  const items = state.inventory[inventoryFilter] || [];
  if (items.length === 0) { el.innerHTML = '<div class="hint">Nothing here yet - go fight something.</div>'; return; }
  el.innerHTML = items.slice().reverse().map(item => renderItemCard(item, { canEquip: true, canSell: true })).join('');
}

/* -------------------------------------------------------- HUNTERS ---- */
function renderHunters() {
  const el = document.getElementById('huntersGrid');
  el.innerHTML = VAULT_HUNTERS.map(h => {
    const owned = state.ownedHunters.includes(h.id);
    const active = state.activeHunterId === h.id;
    return `<div class="item-card" style="border-left-color:var(--accent)">
      <div class="item-name">${h.name} ${gameBadge(h.game)}</div>
      <div class="item-meta">Skill: ${h.skill.name}</div>
      <div class="item-effect">${h.skill.desc}</div>
      <div class="item-meta">Cost: $${fmt(h.cost)} ${owned ? '(Recruited)' : ''}</div>
      <div class="actions">
        ${!owned ? `<button class="btn small" data-action="recruit" data-id="${h.id}" ${state.cash < h.cost ? 'disabled' : ''}>Recruit</button>` : ''}
        ${owned && !active ? `<button class="btn small secondary" data-action="activate" data-id="${h.id}">Make Active</button>` : ''}
        ${active ? `<span class="encounter-tag">ACTIVE</span>` : ''}
      </div>
    </div>`;
  }).join('');
}

/* ------------------------------------------------------- PRESTIGE ---- */
function renderPrestige() {
  const el = document.getElementById('prestigePanel');
  const ready = canPrestige();
  el.innerHTML = `
    <h3>Prestige</h3>
    <p>Reset your level back to 1 in exchange for a permanent <b>+${PRESTIGE_BONUS_PER_TIER}%</b> gun damage bonus, stacking forever.
    Cash, inventory, recruited Vault Hunters and uniques are kept. Unlocks at level ${PRESTIGE_LEVEL_REQUIREMENT}.</p>
    <p>Current Prestige: <b>${state.prestige}</b> &middot; Total Bonus: <b>+${state.prestigeBonusPercent}%</b> gun damage</p>
    <p>Level: <b>${state.level}</b> / ${PRESTIGE_LEVEL_REQUIREMENT}</p>
    <button class="btn" id="prestigeBtn" ${ready ? '' : 'disabled'}>Prestige Now</button>
  `;
}

/* ---------------------------------------------------------- CODEX ---- */
let codexFilter = 'all';

function renderCodexFilter() {
  const el = document.getElementById('codexFilter');
  const cats = ['all', ...LOOT_CATEGORIES];
  el.innerHTML = cats.map(c => `<button data-cat="${c}" class="${codexFilter === c ? 'active' : ''}">${c}</button>`).join('');
}

function renderCodex() {
  renderCodexFilter();
  const el = document.getElementById('codexGrid');
  const defs = codexFilter === 'all' ? UNIQUES : UNIQUES.filter(u => u.category === codexFilter);
  el.innerHTML = defs.map(def => {
    const versionTag = def.versionRank ? `<span class="encounter-tag boss">Hellfire rank #${def.versionRank}/5</span>` : '';
    return `<div class="item-card" style="border-left-color:${rarityColor('unique')}">
      <div class="item-name" style="color:${rarityColor('unique')}">${def.name} ★</div>
      <div class="item-meta">${gameBadge(def.game)} ${def.type || def.category}</div>
      <div class="item-meta">${[def.manufacturer, def.element && def.element !== 'none' ? ELEMENTS[def.element].label : null].filter(Boolean).join(' &middot; ')}</div>
      <div class="item-effect">${def.effect}</div>
      ${versionTag}
    </div>`;
  }).join('');
}

function renderAll() {
  renderHud();
  renderEncounterPanel();
  renderBattleLog(state.lastBattle);
  renderEquipped();
  renderInventory();
  renderHunters();
  renderPrestige();
  renderCodex();
}
