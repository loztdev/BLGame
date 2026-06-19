/* Wiring: events, tab switching, game actions */

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${tabName}`));
}

document.getElementById('tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  switchTab(btn.dataset.tab);
});

function doExplore() {
  state.currentEncounter = rollEncounter(state.level, state.prestige);
  state.lastBattle = null;
  saveState();
  renderEncounterPanel();
  renderBattleLog(null);
}

function doFight() {
  const enc = state.currentEncounter;
  if (!enc) return;
  const result = simulateBattle(state, enc);
  state.lastBattle = result;

  if (result.win) {
    state.stats.kills += 1;
    if (enc.isBoss) state.stats.bossKills += 1;
    const cash = cashRewardFor(enc);
    const xp = xpRewardFor(enc);
    state.cash += cash;
    grantXp(xp);
    const loot = rollLootDrop(state.level, enc.isBoss);
    addToInventory(loot);
    result.log.push(`Earned $${cash}, ${xp} XP, and looted ${loot.name}${loot.isUnique ? ' ★' : ''}!`);
    state.currentEncounter = null;
  } else if (!result.timedOut) {
    state.stats.deaths += 1;
    state.currentEncounter = null;
  } else {
    enc.hp = Math.max(1, enc.hp - result.damageDealt);
  }

  saveState();
  renderAll();
}

function doFlee() {
  state.currentEncounter = null;
  state.lastBattle = null;
  saveState();
  renderEncounterPanel();
  renderBattleLog(null);
}

document.getElementById('tab-encounter').addEventListener('click', (e) => {
  if (e.target.id === 'exploreBtn') doExplore();
  if (e.target.id === 'fightBtn') doFight();
  if (e.target.id === 'fleeBtn') doFlee();
});

document.getElementById('invFilter').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-cat]');
  if (!btn) return;
  inventoryFilter = btn.dataset.cat;
  renderInventory();
});

document.getElementById('codexFilter').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-cat]');
  if (!btn) return;
  codexFilter = btn.dataset.cat;
  renderCodex();
});

function findItem(cat, id) {
  return state.inventory[cat].find(i => i.id === id);
}

document.getElementById('app').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === 'equip') {
    const item = findItem(btn.dataset.cat, btn.dataset.id);
    if (item) { equipItem(item); removeFromInventory(btn.dataset.cat, btn.dataset.id); saveState(); renderEquipped(); renderInventory(); renderHud(); }
  }
  if (action === 'unequip') {
    const slot = btn.dataset.slot;
    const item = state.equipped[slot];
    if (item) { addToInventory(item); unequipSlot(slot); saveState(); renderEquipped(); renderInventory(); renderHud(); }
  }
  if (action === 'sell') {
    const item = findItem(btn.dataset.cat, btn.dataset.id);
    if (item) { state.cash += sellValue(item); removeFromInventory(btn.dataset.cat, btn.dataset.id); saveState(); renderInventory(); renderHud(); }
  }
  if (action === 'recruit') {
    const res = recruitHunter(btn.dataset.id);
    if (res.ok) { renderHunters(); renderHud(); }
  }
  if (action === 'activate') {
    setActiveHunter(btn.dataset.id);
    renderHunters(); renderHud();
  }
});

document.getElementById('tab-prestige').addEventListener('click', (e) => {
  if (e.target.id === 'prestigeBtn') {
    if (doPrestige()) renderAll();
  }
});

renderAll();
