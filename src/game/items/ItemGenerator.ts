import { createRng, rngBool, rngFloat, rngInt, rngPick, rngWeightedPick, type RNG } from './rng';
import {
  ARTIFACT_PERK_POOL,
  CLASSMOD_STAT_POOL,
  COMMON_PREFIXES,
  ELEMENT_PREFIX,
  EPIC_PREFIXES,
  GRENADE_KINDS,
  GRENADE_KIND_LABELS,
  LEGENDARY_GRENADE_NAMES,
  LEGENDARY_GUN_NAMES,
  LEGENDARY_SHIELD_NAMES,
  RARE_PREFIXES,
  SHIELD_EFFECTS,
  SHIELD_EFFECT_LABELS,
  UNCOMMON_PREFIXES,
} from './itemData';
import {
  ELEMENT_INFO,
  GUN_TYPE_TEMPLATES,
  MANUFACTURERS,
  RARITY_INFO,
  type ElementType,
  type GeneratedArtifact,
  type GeneratedClassMod,
  type GeneratedGrenade,
  type GeneratedGun,
  type GeneratedShield,
  type GunStats,
  type GunType,
  type ManufacturerId,
  type Rarity,
  type ShieldEffect,
} from './types';

const ELEMENTS_NO_KINETIC: ElementType[] = ['incendiary', 'shock', 'corrosive', 'cryo', 'explosive'];

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${idCounter}_${Date.now().toString(36)}`;
}

export interface GenerateOptions {
  level: number;
  rarity?: Rarity;
  seed?: number;
}

function pickRarity(rng: RNG, forced?: Rarity): Rarity {
  if (forced) return forced;
  return rngWeightedPick(
    rng,
    Object.values(RARITY_INFO).map((info) => ({ value: info.rarity, weight: info.weight })),
  );
}

function prefixForRarity(rng: RNG, rarity: Rarity): string {
  switch (rarity) {
    case 'common':
      return rngPick(rng, COMMON_PREFIXES);
    case 'uncommon':
      return rngPick(rng, UNCOMMON_PREFIXES);
    case 'rare':
      return rngPick(rng, RARE_PREFIXES);
    case 'epic':
      return rngPick(rng, EPIC_PREFIXES);
    case 'legendary':
      return '';
  }
}

function levelScale(level: number): number {
  return 1 + (level - 1) * 0.12;
}

export class ItemGenerator {
  private rng: RNG;

  constructor(seed?: number) {
    this.rng = createRng(seed ?? Date.now() & 0xffffffff);
  }

  reseed(seed: number) {
    this.rng = createRng(seed);
  }

  generateGun(opts: GenerateOptions, gunType?: GunType, manufacturer?: ManufacturerId): GeneratedGun {
    const rng = this.rng;
    const rarity = pickRarity(rng, opts.rarity);
    const rarityInfo = RARITY_INFO[rarity];
    const type = gunType ?? rngPick(rng, Object.keys(GUN_TYPE_TEMPLATES) as GunType[]);
    const template = GUN_TYPE_TEMPLATES[type];
    const manuId = manufacturer ?? rngPick(rng, Object.keys(MANUFACTURERS) as ManufacturerId[]);
    const manu = MANUFACTURERS[manuId];
    const scale = levelScale(opts.level);

    let stats: GunStats = {
      damage: template.baseDamage * manu.damageMult * rarityInfo.statMultiplier * scale,
      fireRate: template.baseFireRate * manu.fireRateMult,
      accuracy: Math.min(0.99, template.baseAccuracy * manu.accuracyMult),
      magazineSize: Math.max(1, Math.round(template.baseMagazineSize * manu.magazineMult)),
      reloadTime: template.baseReloadTime * manu.reloadMult,
      projectileSpeed: template.baseProjectileSpeed,
      pelletCount: template.pelletCount,
      critMult: 2 * manu.critMult,
    };

    const elementalChance = Math.min(1, manu.elementalChanceBonus + (rarityInfo.bonusAffixCount * 0.05));
    const isElemental = manu.alwaysElemental || rngBool(rng, elementalChance);
    const element: ElementType = isElemental ? rngPick(rng, ELEMENTS_NO_KINETIC) : 'kinetic';

    const affixLabels: string[] = [];
    for (let i = 0; i < rarityInfo.bonusAffixCount; i++) {
      stats = this.applyRandomGunAffix(rng, stats, affixLabels);
    }

    let name: string;
    if (rarity === 'legendary') {
      name = rngPick(rng, LEGENDARY_GUN_NAMES);
    } else {
      const prefix = prefixForRarity(rng, rarity);
      const elementPrefix = element !== 'kinetic' ? ELEMENT_PREFIX[element] : '';
      name = [elementPrefix, prefix, manu.label, template.label].filter(Boolean).join(' ');
    }

    return {
      itemType: 'gun',
      id: nextId('gun'),
      name,
      gunType: type,
      manufacturer: manuId,
      rarity,
      level: opts.level,
      element,
      elementalChance,
      stats,
      affixLabels,
    };
  }

  private applyRandomGunAffix(rng: RNG, stats: GunStats, affixLabels: string[]): GunStats {
    const affixes: { label: string; apply: (s: GunStats) => GunStats }[] = [
      { label: '+Damage', apply: (s) => ({ ...s, damage: s.damage * rngFloat(rng, 1.05, 1.2) }) },
      { label: '+Fire Rate', apply: (s) => ({ ...s, fireRate: s.fireRate * rngFloat(rng, 1.05, 1.2) }) },
      { label: '+Accuracy', apply: (s) => ({ ...s, accuracy: Math.min(0.99, s.accuracy * rngFloat(rng, 1.03, 1.12)) }) },
      { label: '+Magazine Size', apply: (s) => ({ ...s, magazineSize: Math.round(s.magazineSize * rngFloat(rng, 1.3, 1.5)) }) },
      { label: '+Reload Speed', apply: (s) => ({ ...s, reloadTime: s.reloadTime * rngFloat(rng, 0.75, 0.92) }) },
      { label: '+Crit Damage', apply: (s) => ({ ...s, critMult: s.critMult * rngFloat(rng, 1.1, 1.3) }) },
    ];
    const chosen = rngPick(rng, affixes);
    affixLabels.push(chosen.label);
    return chosen.apply(stats);
  }

  generateShield(opts: GenerateOptions, manufacturer?: ManufacturerId): GeneratedShield {
    const rng = this.rng;
    const rarity = pickRarity(rng, opts.rarity);
    const rarityInfo = RARITY_INFO[rarity];
    const manuId = manufacturer ?? rngPick(rng, Object.keys(MANUFACTURERS) as ManufacturerId[]);
    const manu = MANUFACTURERS[manuId];
    const scale = levelScale(opts.level);

    const capacity = Math.round(120 * rarityInfo.statMultiplier * scale * rngFloat(rng, 0.9, 1.15));
    const rechargeRate = Math.round(15 * rarityInfo.statMultiplier * scale * rngFloat(rng, 0.9, 1.2));
    const rechargeDelay = Math.max(0.8, 3.2 * rngFloat(rng, 0.85, 1.1) - rarityInfo.bonusAffixCount * 0.2);

    let specialEffect: ShieldEffect = 'none';
    if (rarity !== 'common') {
      specialEffect = rngPick(rng, SHIELD_EFFECTS.filter((e) => e !== 'none'));
    }
    const element: ElementType = specialEffect === 'nova' || specialEffect === 'spike'
      ? rngPick(rng, ELEMENTS_NO_KINETIC)
      : 'kinetic';

    const affixLabels: string[] = [SHIELD_EFFECT_LABELS[specialEffect]];

    let name: string;
    if (rarity === 'legendary') {
      name = rngPick(rng, LEGENDARY_SHIELD_NAMES);
    } else {
      const prefix = prefixForRarity(rng, rarity);
      name = [prefix, manu.label, 'Shield'].filter(Boolean).join(' ');
    }

    return {
      itemType: 'shield',
      id: nextId('shield'),
      name,
      manufacturer: manuId,
      rarity,
      level: opts.level,
      capacity,
      rechargeRate,
      rechargeDelay,
      specialEffect,
      element,
      affixLabels,
    };
  }

  generateGrenade(opts: GenerateOptions): GeneratedGrenade {
    const rng = this.rng;
    const rarity = pickRarity(rng, opts.rarity);
    const rarityInfo = RARITY_INFO[rarity];
    const scale = levelScale(opts.level);
    const kind = rngPick(rng, GRENADE_KINDS);

    const damage = Math.round(45 * rarityInfo.statMultiplier * scale * rngFloat(rng, 0.9, 1.2));
    const radius = Math.round(70 * rngFloat(rng, 0.85, 1.25));
    const element: ElementType = rngBool(rng, 0.3 + rarityInfo.bonusAffixCount * 0.08)
      ? rngPick(rng, ELEMENTS_NO_KINETIC)
      : 'kinetic';
    const count = kind === 'mirv' ? rngInt(rng, 3, 5) : 1;

    let name: string;
    if (rarity === 'legendary') {
      name = rngPick(rng, LEGENDARY_GRENADE_NAMES);
    } else {
      const prefix = prefixForRarity(rng, rarity);
      const elementPrefix = element !== 'kinetic' ? ELEMENT_PREFIX[element] : '';
      name = [elementPrefix, prefix, GRENADE_KIND_LABELS[kind]].filter(Boolean).join(' ');
    }

    return {
      itemType: 'grenade',
      id: nextId('grenade'),
      name,
      rarity,
      level: opts.level,
      damage,
      radius,
      grenadeKind: kind,
      element,
      count,
      affixLabels: [GRENADE_KIND_LABELS[kind]],
    };
  }

  generateClassMod(opts: GenerateOptions, characterId: string): GeneratedClassMod {
    const rng = this.rng;
    const rarity = pickRarity(rng, opts.rarity);
    const rarityInfo = RARITY_INFO[rarity];
    const numBonuses = Math.max(1, rarityInfo.bonusAffixCount);
    const pool = [...CLASSMOD_STAT_POOL];
    const statBonuses: { label: string; stat: string; amount: number }[] = [];
    for (let i = 0; i < numBonuses && pool.length > 0; i++) {
      const idx = rngInt(rng, 0, pool.length - 1);
      const def = pool.splice(idx, 1)[0];
      statBonuses.push({ label: def.label, stat: def.stat, amount: rngInt(rng, def.min, def.max) });
    }
    const prefix = prefixForRarity(rng, rarity) || 'Adept';
    const name = `${prefix} Class Mod`;
    return {
      itemType: 'classmod',
      id: nextId('classmod'),
      name,
      rarity,
      level: opts.level,
      characterId,
      statBonuses,
    };
  }

  generateArtifact(opts: GenerateOptions): GeneratedArtifact {
    const rng = this.rng;
    const rarity = pickRarity(rng, opts.rarity);
    const rarityInfo = RARITY_INFO[rarity];
    const perkPool = [...ARTIFACT_PERK_POOL];
    const majorIdx = rngInt(rng, 0, perkPool.length - 1);
    const majorDef = perkPool.splice(majorIdx, 1)[0];
    const majorPerk = { label: majorDef.label, stat: majorDef.stat, amount: rngInt(rng, majorDef.min, majorDef.max) };

    const minorBonuses: { label: string; stat: string; amount: number }[] = [];
    for (let i = 0; i < rarityInfo.bonusAffixCount && perkPool.length > 0; i++) {
      const idx = rngInt(rng, 0, perkPool.length - 1);
      const def = perkPool.splice(idx, 1)[0];
      minorBonuses.push({ label: def.label, stat: def.stat, amount: rngInt(rng, def.min, def.max) });
    }

    const prefix = prefixForRarity(rng, rarity) || 'Mysterious';
    const name = `${prefix} ${majorPerk.label} Relic`;

    return {
      itemType: 'artifact',
      id: nextId('artifact'),
      name,
      rarity,
      level: opts.level,
      majorPerk,
      minorBonuses,
    };
  }

  elementColor(element: ElementType): number {
    return ELEMENT_INFO[element].color;
  }
}
