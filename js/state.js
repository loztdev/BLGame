/* Game state, persistence, leveling & prestige economy */

const SAVE_KEY = 'blgame_save_v1';

function freshState() {
  return {
    level: 1, xp: 0, xpToNext: 100,
    cash: 500,
    prestige: 0, prestigeBonusPercent: 0,
    inventory: { gun: [], shield: [], grenade: [], artifact: [], classmod: [] },
    equipped: { gun1: null, gun2: null, shield: null, grenade: null, artifact: null, classmod: null },
    ownedHunters: [], activeHunterId: null,
    stats: { kills: 0, bossKills: 0, deaths: 0 },
    currentEncounter: null,
    lastBattle: null,
  };
}

let state = loadState() || freshState();

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function resetState() {
  state = freshState();
  saveState();
}

function xpForLevel(level) {
  return Math.round(100 * Math.pow(level, 1.5));
}

function grantXp(amount) {
  state.xp += amount;
  let leveled = false;
  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = xpForLevel(state.level);
    leveled = true;
  }
  return leveled;
}

const PRESTIGE_LEVEL_REQUIREMENT = 50;
const PRESTIGE_BONUS_PER_TIER = 8; // % gun damage per prestige

function canPrestige() {
  return state.level >= PRESTIGE_LEVEL_REQUIREMENT;
}

function doPrestige() {
  if (!canPrestige()) return false;
  state.prestige += 1;
  state.prestigeBonusPercent += PRESTIGE_BONUS_PER_TIER;
  state.level = 1;
  state.xp = 0;
  state.xpToNext = xpForLevel(1);
  saveState();
  return true;
}

function addToInventory(item) {
  state.inventory[item.category].push(item);
}

function removeFromInventory(category, id) {
  state.inventory[category] = state.inventory[category].filter(i => i.id !== id);
}

function equipItem(item) {
  if (item.category === 'gun') {
    if (!state.equipped.gun1) state.equipped.gun1 = item;
    else state.equipped.gun2 = item;
  } else {
    state.equipped[item.category] = item;
  }
}

function unequipSlot(slot) {
  state.equipped[slot] = null;
}

function recruitHunter(hunterId) {
  const hunter = VAULT_HUNTERS.find(h => h.id === hunterId);
  if (!hunter) return { ok: false, reason: 'unknown hunter' };
  if (state.ownedHunters.includes(hunterId)) return { ok: false, reason: 'already recruited' };
  if (state.cash < hunter.cost) return { ok: false, reason: 'insufficient cash' };
  state.cash -= hunter.cost;
  state.ownedHunters.push(hunterId);
  if (!state.activeHunterId) state.activeHunterId = hunterId;
  saveState();
  return { ok: true };
}

function setActiveHunter(hunterId) {
  if (!state.ownedHunters.includes(hunterId)) return false;
  state.activeHunterId = hunterId;
  saveState();
  return true;
}

function cashRewardFor(encounter) {
  const base = 8 + encounter.level * 2.4;
  return Math.round(encounter.isBoss ? base * 9 : base);
}

function xpRewardFor(encounter) {
  const base = 12 + encounter.level * 3;
  return Math.round(encounter.isBoss ? base * 6 : base);
}
