/* Core tables: rarities, elements, manufacturers, enemy/boss flavor, categories */

const RARITY = {
  common:    { key: 'common',    label: 'Common',    color: '#cfd8dc', weight: 100, statMult: 1.00 },
  uncommon:  { key: 'uncommon',  label: 'Uncommon',   color: '#4caf50', weight: 55,  statMult: 1.18 },
  rare:      { key: 'rare',      label: 'Rare',       color: '#2196f3', weight: 28,  statMult: 1.42 },
  epic:      { key: 'epic',      label: 'Epic',       color: '#9c27b0', weight: 11,  statMult: 1.75 },
  legendary: { key: 'legendary', label: 'Legendary',  color: '#ff9800', weight: 3,   statMult: 2.30 },
  unique:    { key: 'unique',    label: 'Unique',     color: '#e91e63', weight: 0,   statMult: 2.60 },
};

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'unique'];

const ELEMENTS = {
  none:      { key: 'none',      label: 'Kinetic',  color: '#e0e0e0' },
  incendiary:{ key: 'incendiary',label: 'Incendiary', color: '#ff6d00' },
  shock:     { key: 'shock',     label: 'Shock',     color: '#2979ff' },
  corrosive: { key: 'corrosive', label: 'Corrosive', color: '#76ff03' },
  slag:      { key: 'slag',      label: 'Slag',      color: '#aa00ff' },
  cryo:      { key: 'cryo',      label: 'Cryo',      color: '#18ffff' },
  radiation: { key: 'radiation', label: 'Radiation', color: '#76d275' },
  explosive: { key: 'explosive', label: 'Explosive',  color: '#ff3d00' },
  dark:      { key: 'dark',      label: 'Dark Magic', color: '#6a1b9a' },
};

const GUN_TYPES = ['Pistol', 'SMG', 'Assault Rifle', 'Shotgun', 'Sniper Rifle', 'Rocket Launcher'];

const MANUFACTURERS = {
  Jakobs:   { flavor: 'High damage, no elements (usually), fast reload.' },
  Maliwan:  { flavor: 'Always elemental, high elemental proc chance.' },
  Tediore:  { flavor: 'Thrown on reload for a damaging effect, cheap reloads.' },
  Torgue:   { flavor: 'Explosive rounds, splash damage.' },
  Vladof:   { flavor: 'High fire rate, large magazines.' },
  Dahl:     { flavor: 'Burst fire, accurate, stable.' },
  Hyperion: { flavor: 'Accuracy increases as you fire, shields.' },
  Bandit:   { flavor: 'Huge magazines, poor accuracy, scavenged.' },
  Atlas:    { flavor: 'Tracker tagging rounds, corporate precision.' },
  COV:      { flavor: 'Buffs the wielder\'s spread and chaos the lower their health.' },
  Anshin:   { flavor: 'Shield manufacturer: high recharge rate, survivability.' },
  Pangolin: { flavor: 'Shield manufacturer: high raw capacity.' },
  Eridian:  { flavor: 'Alien tech, unpredictable and powerful relics.' },
  Order:    { flavor: 'BL4 faction tech: holy/dark hybrid weaponry.' },
  Daedalus: { flavor: 'BL4 faction tech: gravity & kinetic manipulation.' },
};

const SHIELD_MANUFACTURERS = ['Anshin', 'Hyperion', 'Pangolin', 'Torgue', 'Eridian'];
const GUN_MANUFACTURERS = ['Jakobs', 'Maliwan', 'Tediore', 'Torgue', 'Vladof', 'Dahl', 'Hyperion', 'Bandit', 'Atlas', 'COV', 'Order', 'Daedalus'];

const GAMES = {
  BL1:  { key: 'BL1',  label: 'Borderlands 1' },
  TPS:  { key: 'TPS',  label: 'The Pre-Sequel' },
  BL2:  { key: 'BL2',  label: 'Borderlands 2' },
  BL3:  { key: 'BL3',  label: 'Borderlands 3' },
  BL4:  { key: 'BL4',  label: 'Borderlands 4' },
};

/* Hellfire SMG cross-game scaling rule (the ONE item with explicit cross-game power ranking):
   BL2 > BL3 > BL4 > TPS > BL1   */
const HELLFIRE_GAME_MULTIPLIER = {
  BL2: 1.65,
  BL3: 1.45,
  BL4: 1.30,
  TPS: 1.12,
  BL1: 1.00,
};
const HELLFIRE_GAME_ORDER = ['BL2', 'BL3', 'BL4', 'TPS', 'BL1'];
