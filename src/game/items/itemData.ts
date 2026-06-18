import type { ElementType, GrenadeKind, ShieldEffect } from './types';

export const COMMON_PREFIXES = ['Rusty', 'Standard', 'Field', 'Surplus', 'Patched'];
export const UNCOMMON_PREFIXES = ['Reinforced', 'Tuned', 'Sharpened', 'Polished', 'Calibrated'];
export const RARE_PREFIXES = ['Vicious', 'Savage', 'Precise', 'Volatile', 'Hardened'];
export const EPIC_PREFIXES = ['Cataclysmic', 'Merciless', 'Ruthless', 'Unstable', 'Devastating'];

export const ELEMENT_PREFIX: Record<ElementType, string> = {
  kinetic: '',
  incendiary: 'Blazing',
  shock: 'Arcing',
  corrosive: 'Caustic',
  cryo: 'Glacial',
  explosive: 'Detonating',
};

export const LEGENDARY_GUN_NAMES = [
  'Vault Reaper', 'Doomsayer', 'Last Whisper', 'Skybreaker', 'The Inevitable',
  'Bonecrusher', 'Eclipse Fang', 'Widowmaker Prime', 'Star Splitter', 'Oblivion Caller',
];

export const LEGENDARY_SHIELD_NAMES = [
  'Aegis of the Vault', 'Stormwall', 'The Unbreakable', 'Bastion Core', 'Null Barrier',
];

export const LEGENDARY_GRENADE_NAMES = [
  'Hand of Ruin', 'Singularity Seed', 'The Last Laugh', 'Vault Spark', 'Doom Bloom',
];

export const SHIELD_EFFECT_LABELS: Record<ShieldEffect, string> = {
  none: 'Standard',
  nova: 'Nova Burst',
  spike: 'Spike Plating',
  amplify: 'Amp Matrix',
  fast_charge: 'Rapid Charge',
};

export const SHIELD_EFFECTS: ShieldEffect[] = ['none', 'nova', 'spike', 'amplify', 'fast_charge'];

export const GRENADE_KIND_LABELS: Record<GrenadeKind, string> = {
  standard: 'Frag Grenade',
  mirv: 'MIRV Cluster',
  sticky: 'Sticky Charge',
  singularity: 'Singularity Core',
  transfusion: 'Transfusion Orb',
  bouncing: 'Bouncing Betty',
};

export const GRENADE_KINDS: GrenadeKind[] = ['standard', 'mirv', 'sticky', 'singularity', 'transfusion', 'bouncing'];

export const ARTIFACT_PERK_POOL: { label: string; stat: string; min: number; max: number }[] = [
  { label: 'Gun Damage', stat: 'gunDamagePct', min: 8, max: 25 },
  { label: 'Move Speed', stat: 'moveSpeedPct', min: 5, max: 18 },
  { label: 'Melee Damage', stat: 'meleeDamagePct', min: 15, max: 45 },
  { label: 'Elemental Damage', stat: 'elementalDamagePct', min: 10, max: 30 },
  { label: 'Health Regen', stat: 'healthRegenPerSec', min: 1, max: 6 },
  { label: 'Action Skill Cooldown', stat: 'actionSkillCooldownPct', min: 8, max: 22 },
  { label: 'Reload Speed', stat: 'reloadSpeedPct', min: 8, max: 24 },
  { label: 'Shield Recharge', stat: 'shieldRechargePct', min: 10, max: 30 },
];

export const CLASSMOD_STAT_POOL: { label: string; stat: string; min: number; max: number }[] = [
  { label: 'Action Skill Cooldown Rate', stat: 'actionSkillCooldownPct', min: 5, max: 20 },
  { label: 'Gun Damage', stat: 'gunDamagePct', min: 5, max: 20 },
  { label: 'Skill Tree Points', stat: 'bonusSkillPoints', min: 1, max: 3 },
  { label: 'Max Health', stat: 'maxHealthPct', min: 5, max: 20 },
  { label: 'Shield Capacity', stat: 'shieldCapacityPct', min: 5, max: 20 },
  { label: 'Elemental Chance', stat: 'elementalChancePct', min: 5, max: 15 },
];
