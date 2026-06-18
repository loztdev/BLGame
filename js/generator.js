/* Procedural item generation + unique item instantiation/scaling */

const GUN_FIRE_RATE = {
  'Pistol': 2.2, 'SMG': 10, 'Assault Rifle': 7.5, 'Shotgun': 1.4, 'Sniper Rifle': 0.85, 'Rocket Launcher': 0.45,
};

function itemLevelScalar(level) {
  return Math.pow(1.10, Math.max(0, level - 1));
}

function percentLevelScalar(level) {
  return 1 + level * 0.01; // gentle growth so % bonuses stay sane at high level
}

function rollRarity() {
  const rollable = RARITY_ORDER.filter(k => k !== 'unique').map(k => RARITY[k]);
  const total = rollable.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of rollable) {
    if (roll < r.weight) return r.key;
    roll -= r.weight;
  }
  return 'common';
}

function randomElement() {
  const keys = Object.keys(ELEMENTS);
  return keys[Math.floor(Math.random() * keys.length)];
}

let _itemSeq = 1;
function nextItemId() { return `item_${_itemSeq++}_${Date.now().toString(36)}`; }

function buildGunStats(baseValue, rarityKey, level, type) {
  const mult = RARITY[rarityKey].statMult * itemLevelScalar(level);
  const damage = Math.round(baseValue * mult * (0.9 + Math.random() * 0.2));
  const fireRate = +(GUN_FIRE_RATE[type] * (0.9 + Math.random() * 0.2)).toFixed(2);
  return { damage, fireRate, dps: Math.round(damage * fireRate) };
}

function buildShieldStats(baseValue, rarityKey, level) {
  const mult = RARITY[rarityKey].statMult * itemLevelScalar(level);
  const capacity = Math.round(baseValue * mult * (0.9 + Math.random() * 0.2));
  const rechargeRate = Math.round(capacity * 0.08);
  return { capacity, rechargeRate };
}

function buildGrenadeStats(baseValue, rarityKey, level) {
  const mult = RARITY[rarityKey].statMult * itemLevelScalar(level);
  const damage = Math.round(baseValue * mult * (0.9 + Math.random() * 0.2));
  return { damage };
}

function buildPercentStats(baseValue, rarityKey, level) {
  const mult = RARITY[rarityKey].statMult * percentLevelScalar(level);
  const bonusPercent = Math.round(baseValue * mult * (0.9 + Math.random() * 0.2));
  return { bonusPercent };
}

/* Random procedural (non-unique) item generation */
function generateProceduralItem(category, level) {
  const rarityKey = rollRarity();
  const element = (category === 'gun' || category === 'grenade') ? randomElement() : null;

  if (category === 'gun') {
    const type = GUN_TYPES[Math.floor(Math.random() * GUN_TYPES.length)];
    const manufacturer = GUN_MANUFACTURERS[Math.floor(Math.random() * GUN_MANUFACTURERS.length)];
    const baseValue = 70 + Math.random() * 60;
    const stats = buildGunStats(baseValue, rarityKey, level, type);
    return {
      id: nextItemId(), category, isUnique: false, rarity: rarityKey, level, type, manufacturer, element,
      name: generateProceduralName('gun', manufacturer, type), ...stats,
    };
  }
  if (category === 'shield') {
    const manufacturer = SHIELD_MANUFACTURERS[Math.floor(Math.random() * SHIELD_MANUFACTURERS.length)];
    const baseValue = 200 + Math.random() * 120;
    const stats = buildShieldStats(baseValue, rarityKey, level);
    return {
      id: nextItemId(), category, isUnique: false, rarity: rarityKey, level, manufacturer,
      name: generateProceduralName('shield', manufacturer, 'Shield'), ...stats,
    };
  }
  if (category === 'grenade') {
    const manufacturer = GUN_MANUFACTURERS[Math.floor(Math.random() * GUN_MANUFACTURERS.length)];
    const grenadeType = ['mirv', 'singularity', 'sticky', 'bouncing', 'aoe', 'standard'][Math.floor(Math.random() * 6)];
    const baseValue = 60 + Math.random() * 50;
    const stats = buildGrenadeStats(baseValue, rarityKey, level);
    return {
      id: nextItemId(), category, isUnique: false, rarity: rarityKey, level, manufacturer, grenadeType, element,
      name: generateProceduralName('grenade', manufacturer, 'Grenade'), ...stats,
    };
  }
  if (category === 'artifact') {
    const baseValue = 10 + Math.random() * 18;
    const stats = buildPercentStats(baseValue, rarityKey, level);
    return {
      id: nextItemId(), category, isUnique: false, rarity: rarityKey, level,
      name: generateProceduralName('artifact', 'Eridian', 'Relic'), ...stats,
    };
  }
  if (category === 'classmod') {
    const baseValue = 10 + Math.random() * 18;
    const stats = buildPercentStats(baseValue, rarityKey, level);
    return {
      id: nextItemId(), category, isUnique: false, rarity: rarityKey, level,
      name: generateProceduralName('classmod', 'Vault Hunter', 'Class Mod'), ...stats,
    };
  }
}

/* Instantiate a specific unique/legendary at a given player level */
function instantiateUnique(def, level) {
  const versionMult = def.versionMultiplier || 1;
  const base = { id: nextItemId(), defId: def.id, category: def.category, isUnique: true, rarity: 'unique',
    level, name: def.name, game: def.game, manufacturer: def.manufacturer, element: def.element,
    effect: def.effect, forClass: def.forClass, versionRank: def.versionRank };

  if (def.category === 'gun') {
    const stats = buildGunStats(def.baseValue * versionMult, 'unique', level, def.type);
    return { ...base, type: def.type, ...stats };
  }
  if (def.category === 'shield') {
    const stats = buildShieldStats(def.baseValue * versionMult, 'unique', level);
    return { ...base, ...stats };
  }
  if (def.category === 'grenade') {
    const stats = buildGrenadeStats(def.baseValue * versionMult, 'unique', level);
    return { ...base, grenadeType: def.grenadeType, ...stats };
  }
  // artifact / classmod
  const stats = buildPercentStats(def.baseValue * versionMult, 'unique', level);
  return { ...base, ...stats };
}

function pickRandomUniqueDef(category) {
  const pool = category ? UNIQUES.filter(u => u.category === category) : UNIQUES;
  return pool[Math.floor(Math.random() * pool.length)];
}

const LOOT_CATEGORIES = ['gun', 'shield', 'grenade', 'artifact', 'classmod'];

/* Roll a single piece of loot on encounter victory */
function rollLootDrop(level, isBoss) {
  const category = LOOT_CATEGORIES[Math.floor(Math.random() * LOOT_CATEGORIES.length)];
  const uniqueChance = isBoss ? 0.22 : 0.025;
  if (Math.random() < uniqueChance) {
    const def = pickRandomUniqueDef(category);
    return instantiateUnique(def, level);
  }
  return generateProceduralItem(category, level);
}
