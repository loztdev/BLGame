export type StatKey =
  | 'gunDamagePct'
  | 'fireRatePct'
  | 'reloadSpeedPct'
  | 'accuracyPct'
  | 'moveSpeedPct'
  | 'maxHealthPct'
  | 'shieldCapacityPct'
  | 'shieldRechargePct'
  | 'meleeDamagePct'
  | 'actionSkillCooldownPct'
  | 'actionSkillDurationPct'
  | 'actionSkillPowerPct'
  | 'elementalDamagePct'
  | 'elementalChancePct'
  | 'healthRegenPerSec'
  | 'damageReductionPct'
  | 'critDamagePct'
  | 'lifestealPct'
  | 'bonusSkillPoints'
  | 'maxHealthFlat'
  | 'shieldCapacityFlat';

export type Branch = 'branch1' | 'branch2' | 'branch3';

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  branch: Branch;
  tier: 1 | 2 | 3;
  maxPoints: number;
  statKey: StatKey;
  amountPerPoint: number;
  unlockRequirement: number; // points required in previous tier of same branch (0 for tier 1)
}

export type ActionSkillId =
  | 'sentry_drop'
  | 'phase_lock'
  | 'rampage'
  | 'shadow_step'
  | 'combat_bot'
  | 'bloodlust';

export interface ActionSkillDef {
  id: ActionSkillId;
  name: string;
  description: string;
  baseCooldown: number;
  baseDuration: number;
}

export interface CharacterDefinition {
  id: string;
  name: string;
  title: string;
  tagline: string;
  color: number;
  baseHealth: number;
  baseMoveSpeed: number;
  baseGunDamageMult: number;
  actionSkill: ActionSkillDef;
  branchNames: Record<Branch, string>;
  skillTree: SkillNode[];
}
