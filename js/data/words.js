/* Procedural naming pools, by category */

const NAME_POOLS = {
  gun: {
    prefix: ['Jagged', 'Bursting', 'Hyper', 'Stalker', 'Vicious', 'Rabid', 'Savage', 'Shrieking', 'Frenzied',
      'Crisp', 'Boom', 'Spinning', 'Crooked', 'Lobbed', 'Twisted', 'Bonus', 'Double Anarchist\'s', 'Recurring',
      'Forceful', 'Catalyzing', 'Caustic', 'Convulsive', 'Polarized', 'Skipping', 'Sighted', 'Iron', 'Storm'],
    suffix: ['Bigotry', 'Doom', 'Despair', 'Fervor', 'Judgement', 'Malice', 'Misery', 'Pestilence', 'Punishment',
      'Ruin', 'Resentment', 'Severity', 'Torment', 'Vengeance', 'Wrath', 'the Apocalypse', 'the Damned',
      'the Vault', 'Massacre', 'Anguish', 'Carnage', 'Calamity'],
  },
  shield: {
    prefix: ['Resolute', 'Impervious', 'Stalwart', 'Aegis', 'Bastion', 'Bulwark', 'Fortified', 'Reactive',
      'Static', 'Volatile', 'Adaptive', 'Inviolate', 'Unyielding', 'Tempered'],
    suffix: ['Ward', 'Bastion', 'Bulwark', 'Sentinel', 'Aegis', 'Rampart', 'the Wall', 'Reprisal', 'Echo', 'Barrier'],
  },
  grenade: {
    prefix: ['Fragmenting', 'Cluster', 'Singularity', 'Caustic', 'Sticky', 'Bouncing', 'Homing', 'Area-Effect',
      'Recurring', 'Chained', 'Magnetic', 'Volatile'],
    suffix: ['Burst', 'Bloom', 'Cascade', 'Fallout', 'Detonation', 'Rupture', 'Eruption', 'Implosion', 'the Storm'],
  },
  artifact: {
    prefix: ['Eridian', 'Vault', 'Resonant', 'Arcane', 'Forgotten', 'Ancient', 'Sacred', 'Corrupted', 'Radiant'],
    suffix: ['Relic', 'Charm', 'Idol', 'Sigil', 'Talisman', 'Core', 'Shard', 'Vestige', 'Oz Kit'],
  },
  classmod: {
    prefix: ['Tactician\'s', 'Zealot\'s', 'Vanguard\'s', 'Adept\'s', 'Veteran\'s', 'Sentinel\'s', 'Rogue\'s',
      'Berserker\'s', 'Mystic\'s', 'Outlaw\'s'],
    suffix: ['Mind', 'Will', 'Resolve', 'Discipline', 'Fervor', 'Calling', 'Oath', 'Legacy', 'Mantle'],
  },
};

function generateProceduralName(category, manufacturer, baseType) {
  const pool = NAME_POOLS[category];
  const prefix = pool.prefix[Math.floor(Math.random() * pool.prefix.length)];
  const suffix = pool.suffix[Math.floor(Math.random() * pool.suffix.length)];
  return `${prefix} ${manufacturer} ${baseType} of ${suffix}`;
}
