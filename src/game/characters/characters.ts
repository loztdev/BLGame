import type { ActionSkillId, Branch, CharacterDefinition, SkillNode, StatKey } from './types';

interface NodeSpec {
  name: string;
  description: string;
  statKey: StatKey;
  amountPerPoint: number;
  maxPoints?: number;
}

interface BranchSpec {
  tier1: NodeSpec;
  tier2: NodeSpec;
  tier3: NodeSpec; // capstone
}

function buildTree(branches: Record<Branch, BranchSpec>): SkillNode[] {
  const nodes: SkillNode[] = [];
  (Object.keys(branches) as Branch[]).forEach((branch) => {
    const spec = branches[branch];
    nodes.push({
      id: `${branch}_t1`,
      name: spec.tier1.name,
      description: spec.tier1.description,
      branch,
      tier: 1,
      maxPoints: spec.tier1.maxPoints ?? 5,
      statKey: spec.tier1.statKey,
      amountPerPoint: spec.tier1.amountPerPoint,
      unlockRequirement: 0,
    });
    nodes.push({
      id: `${branch}_t2`,
      name: spec.tier2.name,
      description: spec.tier2.description,
      branch,
      tier: 2,
      maxPoints: spec.tier2.maxPoints ?? 5,
      statKey: spec.tier2.statKey,
      amountPerPoint: spec.tier2.amountPerPoint,
      unlockRequirement: 3,
    });
    nodes.push({
      id: `${branch}_t3`,
      name: spec.tier3.name,
      description: spec.tier3.description,
      branch,
      tier: 3,
      maxPoints: spec.tier3.maxPoints ?? 1,
      statKey: spec.tier3.statKey,
      amountPerPoint: spec.tier3.amountPerPoint,
      unlockRequirement: 3,
    });
  });
  return nodes;
}

function actionSkill(id: ActionSkillId, name: string, description: string, baseCooldown: number, baseDuration: number) {
  return { id, name, description, baseCooldown, baseDuration };
}

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: 'rook',
    name: 'Rook',
    title: 'The Vanguard',
    tagline: 'Drops a turret and holds the line.',
    color: 0xd97b29,
    baseHealth: 130,
    baseMoveSpeed: 200,
    baseGunDamageMult: 1.0,
    actionSkill: actionSkill('sentry_drop', 'Sentry Drop', 'Deploys an auto-turret that fires at nearby enemies.', 18, 12),
    branchNames: { branch1: 'Ordnance', branch2: 'Discipline', branch3: 'Fortify' },
    skillTree: buildTree({
      branch1: {
        tier1: { name: 'Heavy Payload', description: '+Turret/grenade damage', statKey: 'elementalDamagePct', amountPerPoint: 4 },
        tier2: { name: 'Demolitionist', description: '+Action skill power', statKey: 'actionSkillPowerPct', amountPerPoint: 5 },
        tier3: { name: 'Scorched Earth', description: 'Massive action skill power boost', statKey: 'actionSkillPowerPct', amountPerPoint: 20 },
      },
      branch2: {
        tier1: { name: 'Marksman', description: '+Gun damage', statKey: 'gunDamagePct', amountPerPoint: 3 },
        tier2: { name: 'Steady Hands', description: '+Accuracy', statKey: 'accuracyPct', amountPerPoint: 2 },
        tier3: { name: 'Lethal Precision', description: '+Critical damage', statKey: 'critDamagePct', amountPerPoint: 25 },
      },
      branch3: {
        tier1: { name: 'Combat Armor', description: '+Max health', statKey: 'maxHealthPct', amountPerPoint: 4 },
        tier2: { name: 'Damage Control', description: '+Damage reduction', statKey: 'damageReductionPct', amountPerPoint: 2 },
        tier3: { name: 'Unbreakable', description: 'Major damage reduction', statKey: 'damageReductionPct', amountPerPoint: 12 },
      },
    }),
  },
  {
    id: 'nyx',
    name: 'Nyx',
    title: 'The Siren',
    tagline: 'Suspends enemies in phase energy.',
    color: 0x8a4fe0,
    baseHealth: 105,
    baseMoveSpeed: 215,
    baseGunDamageMult: 0.95,
    actionSkill: actionSkill('phase_lock', 'Phase Lock', 'Suspends the nearest enemy in a damaging stasis bubble.', 16, 5),
    branchNames: { branch1: 'Cataclysm', branch2: 'Motion', branch3: 'Restoration' },
    skillTree: buildTree({
      branch1: {
        tier1: { name: 'Elemental Surge', description: '+Elemental damage', statKey: 'elementalDamagePct', amountPerPoint: 4 },
        tier2: { name: 'Volatile Bind', description: '+Action skill power', statKey: 'actionSkillPowerPct', amountPerPoint: 5 },
        tier3: { name: 'Singularity', description: 'Massive action skill power boost', statKey: 'actionSkillPowerPct', amountPerPoint: 20 },
      },
      branch2: {
        tier1: { name: 'Quickstep', description: '+Move speed', statKey: 'moveSpeedPct', amountPerPoint: 3 },
        tier2: { name: 'Phase Flicker', description: '+Action skill duration', statKey: 'actionSkillDurationPct', amountPerPoint: 6 },
        tier3: { name: 'Untouchable', description: '+Damage reduction', statKey: 'damageReductionPct', amountPerPoint: 12 },
      },
      branch3: {
        tier1: { name: 'Soothing Light', description: '+Health regen', statKey: 'healthRegenPerSec', amountPerPoint: 0.6 },
        tier2: { name: 'Lifedraw', description: '+Lifesteal', statKey: 'lifestealPct', amountPerPoint: 2 },
        tier3: { name: 'Reaper', description: 'Major lifesteal boost', statKey: 'lifestealPct', amountPerPoint: 10 },
      },
    }),
  },
  {
    id: 'bruiser',
    name: 'Bruiser',
    title: 'The Gunzerker',
    tagline: 'Goes berserk and dual-wields everything.',
    color: 0xc23b3b,
    baseHealth: 160,
    baseMoveSpeed: 195,
    baseGunDamageMult: 1.05,
    actionSkill: actionSkill('rampage', 'Rampage', 'Dual-wields, gaining fire rate, lifesteal and damage reduction.', 20, 10),
    branchNames: { branch1: 'Brawn', branch2: 'Fury', branch3: 'Resilience' },
    skillTree: buildTree({
      branch1: {
        tier1: { name: 'Iron Skin', description: '+Max health', statKey: 'maxHealthPct', amountPerPoint: 4 },
        tier2: { name: 'Brutal Strikes', description: '+Melee damage', statKey: 'meleeDamagePct', amountPerPoint: 8 },
        tier3: { name: 'Juggernaut', description: 'Major max health boost', statKey: 'maxHealthPct', amountPerPoint: 20 },
      },
      branch2: {
        tier1: { name: 'Trigger Happy', description: '+Fire rate', statKey: 'fireRatePct', amountPerPoint: 3 },
        tier2: { name: 'Rampage Fuel', description: '+Action skill power', statKey: 'actionSkillPowerPct', amountPerPoint: 5 },
        tier3: { name: 'Unstoppable', description: 'Massive action skill power boost', statKey: 'actionSkillPowerPct', amountPerPoint: 20 },
      },
      branch3: {
        tier1: { name: 'Thick Hide', description: '+Damage reduction', statKey: 'damageReductionPct', amountPerPoint: 2 },
        tier2: { name: 'Blood Frenzy', description: '+Lifesteal', statKey: 'lifestealPct', amountPerPoint: 2 },
        tier3: { name: 'Cannot Be Stopped', description: 'Major damage reduction', statKey: 'damageReductionPct', amountPerPoint: 12 },
      },
    }),
  },
  {
    id: 'vex',
    name: 'Vex',
    title: 'The Assassin',
    tagline: 'Vanishes, then strikes from the shadows.',
    color: 0x2bb0a3,
    baseHealth: 95,
    baseMoveSpeed: 230,
    baseGunDamageMult: 1.1,
    actionSkill: actionSkill('shadow_step', 'Shadow Step', 'Cloaks and gains a guaranteed critical hit on the next shot.', 17, 6),
    branchNames: { branch1: 'Stealth', branch2: 'Precision', branch3: 'Mobility' },
    skillTree: buildTree({
      branch1: {
        tier1: { name: 'Shadow Walk', description: '+Action skill duration', statKey: 'actionSkillDurationPct', amountPerPoint: 6 },
        tier2: { name: 'Vanish', description: '+Action skill cooldown rate', statKey: 'actionSkillCooldownPct', amountPerPoint: 5 },
        tier3: { name: 'Ghost', description: 'Major cooldown reduction', statKey: 'actionSkillCooldownPct', amountPerPoint: 20 },
      },
      branch2: {
        tier1: { name: 'Deadly Aim', description: '+Critical damage', statKey: 'critDamagePct', amountPerPoint: 6 },
        tier2: { name: 'Steady Grip', description: '+Accuracy', statKey: 'accuracyPct', amountPerPoint: 2 },
        tier3: { name: 'Execute', description: 'Massive critical damage boost', statKey: 'critDamagePct', amountPerPoint: 30 },
      },
      branch3: {
        tier1: { name: 'Sprinter', description: '+Move speed', statKey: 'moveSpeedPct', amountPerPoint: 3 },
        tier2: { name: 'Adrenaline Rush', description: '+Fire rate', statKey: 'fireRatePct', amountPerPoint: 3 },
        tier3: { name: 'Blur', description: 'Major move speed boost', statKey: 'moveSpeedPct', amountPerPoint: 15 },
      },
    }),
  },
  {
    id: 'circuit',
    name: 'Circuit',
    title: 'The Mechromancer',
    tagline: 'Builds bots and breaks the rules.',
    color: 0xe05fb3,
    baseHealth: 110,
    baseMoveSpeed: 205,
    baseGunDamageMult: 0.95,
    actionSkill: actionSkill('combat_bot', 'Deploy Combat Bot', 'Summons a combat robot that fights alongside you.', 22, 14),
    branchNames: { branch1: 'Engineering', branch2: 'Overload', branch3: 'Salvage' },
    skillTree: buildTree({
      branch1: {
        tier1: { name: 'Reinforced Chassis', description: '+Action skill duration', statKey: 'actionSkillDurationPct', amountPerPoint: 6 },
        tier2: { name: 'Overclock', description: '+Action skill power', statKey: 'actionSkillPowerPct', amountPerPoint: 5 },
        tier3: { name: 'Prime Directive', description: 'Massive action skill power boost', statKey: 'actionSkillPowerPct', amountPerPoint: 20 },
      },
      branch2: {
        tier1: { name: 'Shock Capacitor', description: '+Elemental damage', statKey: 'elementalDamagePct', amountPerPoint: 4 },
        tier2: { name: 'Chain Reaction', description: '+Elemental chance', statKey: 'elementalChancePct', amountPerPoint: 4 },
        tier3: { name: 'Meltdown', description: 'Major elemental damage boost', statKey: 'elementalDamagePct', amountPerPoint: 20 },
      },
      branch3: {
        tier1: { name: 'Spare Parts', description: '+Shield capacity', statKey: 'shieldCapacityPct', amountPerPoint: 4 },
        tier2: { name: 'Fast Repairs', description: '+Shield recharge', statKey: 'shieldRechargePct', amountPerPoint: 5 },
        tier3: { name: 'Self Sufficient', description: '+Health regen', statKey: 'healthRegenPerSec', amountPerPoint: 3 },
      },
    }),
  },
  {
    id: 'riot',
    name: 'Riot',
    title: 'The Berserker',
    tagline: 'The more you kill, the harder you hit.',
    color: 0x4a4a4a,
    baseHealth: 150,
    baseMoveSpeed: 220,
    baseGunDamageMult: 0.9,
    actionSkill: actionSkill('bloodlust', 'Bloodlust', 'Enters a melee rage; kills extend duration and stack damage and speed.', 20, 8),
    branchNames: { branch1: 'Savagery', branch2: 'Adrenaline', branch3: 'Madness' },
    skillTree: buildTree({
      branch1: {
        tier1: { name: 'Feral Strikes', description: '+Melee damage', statKey: 'meleeDamagePct', amountPerPoint: 8 },
        tier2: { name: 'Blood Frenzy', description: '+Lifesteal', statKey: 'lifestealPct', amountPerPoint: 2 },
        tier3: { name: 'Apex Predator', description: 'Major melee damage boost', statKey: 'meleeDamagePct', amountPerPoint: 35 },
      },
      branch2: {
        tier1: { name: 'Sprint', description: '+Move speed', statKey: 'moveSpeedPct', amountPerPoint: 3 },
        tier2: { name: 'Rabid', description: '+Action skill power', statKey: 'actionSkillPowerPct', amountPerPoint: 5 },
        tier3: { name: 'Frenzied', description: 'Massive action skill power boost', statKey: 'actionSkillPowerPct', amountPerPoint: 20 },
      },
      branch3: {
        tier1: { name: 'Thick Skull', description: '+Max health', statKey: 'maxHealthPct', amountPerPoint: 4 },
        tier2: { name: 'Pain Response', description: '+Damage reduction', statKey: 'damageReductionPct', amountPerPoint: 2 },
        tier3: { name: 'Numb', description: 'Major damage reduction', statKey: 'damageReductionPct', amountPerPoint: 12 },
      },
    }),
  },
];

export function getCharacter(id: string): CharacterDefinition {
  const character = CHARACTERS.find((c) => c.id === id);
  if (!character) throw new Error(`Unknown character: ${id}`);
  return character;
}
