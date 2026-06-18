export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export interface RarityInfo {
  rarity: Rarity;
  label: string;
  color: number;
  weight: number;
  statMultiplier: number;
  bonusAffixCount: number;
}

export const RARITY_INFO: Record<Rarity, RarityInfo> = {
  common: { rarity: 'common', label: 'Common', color: 0xd9d9d9, weight: 100, statMultiplier: 1.0, bonusAffixCount: 0 },
  uncommon: { rarity: 'uncommon', label: 'Uncommon', color: 0x4cd137, weight: 55, statMultiplier: 1.15, bonusAffixCount: 1 },
  rare: { rarity: 'rare', label: 'Rare', color: 0x3b8eea, weight: 22, statMultiplier: 1.35, bonusAffixCount: 2 },
  epic: { rarity: 'epic', label: 'Epic', color: 0xa463f2, weight: 8, statMultiplier: 1.6, bonusAffixCount: 3 },
  legendary: { rarity: 'legendary', label: 'Legendary', color: 0xff9f1a, weight: 1.5, statMultiplier: 2.0, bonusAffixCount: 4 },
};

export type ElementType = 'kinetic' | 'incendiary' | 'shock' | 'corrosive' | 'cryo' | 'explosive';

export interface ElementInfo {
  element: ElementType;
  label: string;
  color: number;
  dotPerSecondFactor: number;
}

export const ELEMENT_INFO: Record<ElementType, ElementInfo> = {
  kinetic: { element: 'kinetic', label: 'Kinetic', color: 0xcccccc, dotPerSecondFactor: 0 },
  incendiary: { element: 'incendiary', label: 'Incendiary', color: 0xff5733, dotPerSecondFactor: 0.35 },
  shock: { element: 'shock', label: 'Shock', color: 0x3df0ff, dotPerSecondFactor: 0.2 },
  corrosive: { element: 'corrosive', label: 'Corrosive', color: 0x7CFC00, dotPerSecondFactor: 0.3 },
  cryo: { element: 'cryo', label: 'Cryo', color: 0x9be7ff, dotPerSecondFactor: 0.1 },
  explosive: { element: 'explosive', label: 'Explosive', color: 0xffa500, dotPerSecondFactor: 0 },
};

export type ItemType = 'gun' | 'shield' | 'classmod' | 'artifact' | 'grenade';

export type GunType = 'pistol' | 'smg' | 'assault_rifle' | 'shotgun' | 'sniper' | 'rocket_launcher';

export interface GunTypeTemplate {
  type: GunType;
  label: string;
  baseDamage: number;
  baseFireRate: number; // shots per second
  baseAccuracy: number; // 0-1
  baseMagazineSize: number;
  baseReloadTime: number; // seconds
  baseProjectileSpeed: number;
  pelletCount: number;
}

export const GUN_TYPE_TEMPLATES: Record<GunType, GunTypeTemplate> = {
  pistol: { type: 'pistol', label: 'Pistol', baseDamage: 18, baseFireRate: 3.2, baseAccuracy: 0.88, baseMagazineSize: 12, baseReloadTime: 1.4, baseProjectileSpeed: 900, pelletCount: 1 },
  smg: { type: 'smg', label: 'SMG', baseDamage: 9, baseFireRate: 9, baseAccuracy: 0.72, baseMagazineSize: 32, baseReloadTime: 1.8, baseProjectileSpeed: 850, pelletCount: 1 },
  assault_rifle: { type: 'assault_rifle', label: 'Assault Rifle', baseDamage: 14, baseFireRate: 6.5, baseAccuracy: 0.8, baseMagazineSize: 28, baseReloadTime: 2.1, baseProjectileSpeed: 950, pelletCount: 1 },
  shotgun: { type: 'shotgun', label: 'Shotgun', baseDamage: 11, baseFireRate: 1.4, baseAccuracy: 0.6, baseMagazineSize: 6, baseReloadTime: 2.4, baseProjectileSpeed: 800, pelletCount: 8 },
  sniper: { type: 'sniper', label: 'Sniper Rifle', baseDamage: 65, baseFireRate: 0.9, baseAccuracy: 0.97, baseMagazineSize: 4, baseReloadTime: 2.6, baseProjectileSpeed: 1400, pelletCount: 1 },
  rocket_launcher: { type: 'rocket_launcher', label: 'Rocket Launcher', baseDamage: 90, baseFireRate: 0.6, baseAccuracy: 0.75, baseMagazineSize: 2, baseReloadTime: 3.2, baseProjectileSpeed: 600, pelletCount: 1 },
};

export type ManufacturerId = 'vorn' | 'cobalt' | 'oldhand' | 'volkan' | 'stryke' | 'skagg';

export interface ManufacturerInfo {
  id: ManufacturerId;
  label: string;
  description: string;
  damageMult: number;
  fireRateMult: number;
  accuracyMult: number;
  magazineMult: number;
  reloadMult: number;
  critMult: number;
  alwaysElemental: boolean;
  elementalChanceBonus: number;
}

export const MANUFACTURERS: Record<ManufacturerId, ManufacturerInfo> = {
  vorn: { id: 'vorn', label: 'Vorn Industries', description: 'Explosive splash specialists', damageMult: 1.05, fireRateMult: 0.9, accuracyMult: 0.95, magazineMult: 0.9, reloadMult: 1.1, critMult: 1.0, alwaysElemental: false, elementalChanceBonus: 0.1 },
  cobalt: { id: 'cobalt', label: 'Cobalt Dynamics', description: 'Elemental weapon specialists', damageMult: 0.9, fireRateMult: 1.0, accuracyMult: 0.95, magazineMult: 0.85, reloadMult: 1.0, critMult: 1.0, alwaysElemental: true, elementalChanceBonus: 1.0 },
  oldhand: { id: 'oldhand', label: 'Old Hand Arms', description: 'High damage, precision, big crits', damageMult: 1.35, fireRateMult: 0.65, accuracyMult: 1.1, magazineMult: 0.7, reloadMult: 0.9, critMult: 1.5, alwaysElemental: false, elementalChanceBonus: 0 },
  volkan: { id: 'volkan', label: 'Volkan Arms', description: 'Fast fire rate, huge magazines', damageMult: 0.85, fireRateMult: 1.35, accuracyMult: 0.8, magazineMult: 1.6, reloadMult: 1.2, critMult: 0.9, alwaysElemental: false, elementalChanceBonus: 0.05 },
  stryke: { id: 'stryke', label: 'Stryke Systems', description: 'Accurate, reliable, balanced', damageMult: 1.0, fireRateMult: 1.0, accuracyMult: 1.25, magazineMult: 1.0, reloadMult: 0.85, critMult: 1.1, alwaysElemental: false, elementalChanceBonus: 0.1 },
  skagg: { id: 'skagg', label: 'Skagg Co', description: 'Cheap, fast reloads, surprisingly elemental', damageMult: 0.75, fireRateMult: 1.1, accuracyMult: 0.85, magazineMult: 0.9, reloadMult: 0.6, critMult: 0.85, alwaysElemental: false, elementalChanceBonus: 0.3 },
};

export interface GunAffix {
  label: string;
  apply: (stats: GunStats) => GunStats;
}

export interface GunStats {
  damage: number;
  fireRate: number;
  accuracy: number;
  magazineSize: number;
  reloadTime: number;
  projectileSpeed: number;
  pelletCount: number;
  critMult: number;
}

export interface GeneratedGun {
  itemType: 'gun';
  id: string;
  name: string;
  gunType: GunType;
  manufacturer: ManufacturerId;
  rarity: Rarity;
  level: number;
  element: ElementType;
  elementalChance: number;
  stats: GunStats;
  affixLabels: string[];
}

export interface GeneratedShield {
  itemType: 'shield';
  id: string;
  name: string;
  manufacturer: ManufacturerId;
  rarity: Rarity;
  level: number;
  capacity: number;
  rechargeRate: number;
  rechargeDelay: number;
  specialEffect: ShieldEffect;
  element: ElementType;
  affixLabels: string[];
}

export type ShieldEffect = 'none' | 'nova' | 'spike' | 'amplify' | 'fast_charge';

export interface GeneratedGrenade {
  itemType: 'grenade';
  id: string;
  name: string;
  rarity: Rarity;
  level: number;
  damage: number;
  radius: number;
  grenadeKind: GrenadeKind;
  element: ElementType;
  count: number;
  affixLabels: string[];
}

export type GrenadeKind = 'standard' | 'mirv' | 'sticky' | 'singularity' | 'transfusion' | 'bouncing';

export interface GeneratedClassMod {
  itemType: 'classmod';
  id: string;
  name: string;
  rarity: Rarity;
  level: number;
  characterId: string;
  statBonuses: { label: string; stat: string; amount: number }[];
}

export interface GeneratedArtifact {
  itemType: 'artifact';
  id: string;
  name: string;
  rarity: Rarity;
  level: number;
  majorPerk: { label: string; stat: string; amount: number };
  minorBonuses: { label: string; stat: string; amount: number }[];
}

export type GeneratedItem = GeneratedGun | GeneratedShield | GeneratedGrenade | GeneratedClassMod | GeneratedArtifact;
