import type { CharacterDefinition, StatKey } from '../characters/types';

export interface FinalStats {
  maxHealth: number;
  moveSpeed: number;
  gunDamageMult: number;
  fireRateMult: number;
  reloadSpeedMult: number;
  accuracyBonus: number;
  meleeDamageMult: number;
  actionSkillCooldownMult: number;
  actionSkillDurationMult: number;
  actionSkillPowerMult: number;
  elementalDamageMult: number;
  elementalChanceBonus: number;
  healthRegenPerSec: number;
  damageReductionPct: number;
  critDamageMult: number;
  lifestealPct: number;
  shieldCapacityMult: number;
  shieldRechargeMult: number;
}

export type StatBonusMap = Partial<Record<StatKey, number>>;

export function mergeStatBonuses(...maps: StatBonusMap[]): StatBonusMap {
  const result: StatBonusMap = {};
  for (const map of maps) {
    for (const key of Object.keys(map) as StatKey[]) {
      result[key] = (result[key] ?? 0) + (map[key] ?? 0);
    }
  }
  return result;
}

export function computeFinalStats(character: CharacterDefinition, bonuses: StatBonusMap): FinalStats {
  const pct = (key: StatKey) => (bonuses[key] ?? 0) / 100;

  return {
    maxHealth: character.baseHealth * (1 + pct('maxHealthPct')) + (bonuses.maxHealthFlat ?? 0),
    moveSpeed: character.baseMoveSpeed * (1 + pct('moveSpeedPct')),
    gunDamageMult: character.baseGunDamageMult * (1 + pct('gunDamagePct')),
    fireRateMult: 1 + pct('fireRatePct'),
    reloadSpeedMult: Math.max(0.2, 1 - pct('reloadSpeedPct')),
    accuracyBonus: pct('accuracyPct'),
    meleeDamageMult: 1 + pct('meleeDamagePct'),
    actionSkillCooldownMult: Math.max(0.2, 1 - pct('actionSkillCooldownPct')),
    actionSkillDurationMult: 1 + pct('actionSkillDurationPct'),
    actionSkillPowerMult: 1 + pct('actionSkillPowerPct'),
    elementalDamageMult: 1 + pct('elementalDamagePct'),
    elementalChanceBonus: pct('elementalChancePct'),
    healthRegenPerSec: bonuses.healthRegenPerSec ?? 0,
    damageReductionPct: Math.min(0.75, pct('damageReductionPct')),
    critDamageMult: 1 + pct('critDamagePct'),
    lifestealPct: pct('lifestealPct'),
    shieldCapacityMult: 1 + pct('shieldCapacityPct'),
    shieldRechargeMult: 1 + pct('shieldRechargePct'),
  };
}
