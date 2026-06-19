/* Recruitable Vault Hunters. cost is priced by how broken/overpowered they are considered in
   community lore/meta (not lore-narrative power) - cheaper = more balanced/weaker meta pick. */

const VAULT_HUNTERS = [
  // Borderlands 1
  { id: 'lilith', name: 'Lilith', game: 'BL1', cost: 600,
    skill: { name: 'Phasewalk', desc: 'Goes ethereal, then erupts for a damage burst on exit.', cooldown: 22, duration: 4, type: 'burst', value: 3.2 } },
  { id: 'roland', name: 'Roland', game: 'BL1', cost: 550,
    skill: { name: 'Scorpio Turret', desc: 'Deploys a turret for sustained extra DPS.', cooldown: 20, duration: 10, type: 'flatDpsMult', value: 0.6 } },
  { id: 'mordecai', name: 'Mordecai', game: 'BL1', cost: 550,
    skill: { name: 'Bloodwing', desc: 'Bloodwing dive-bombs for a bleed burst.', cooldown: 18, duration: 3, type: 'burst', value: 2.6 } },
  { id: 'brick', name: 'Brick', game: 'BL1', cost: 600,
    skill: { name: 'Berserk', desc: 'Fists of fury: huge melee damage multiplier window.', cooldown: 24, duration: 8, type: 'flatDpsMult', value: 0.9 } },

  // The Pre-Sequel
  { id: 'athena', name: 'Athena', game: 'TPS', cost: 1600,
    skill: { name: 'Aspis', desc: 'Energy shield blocks and reflects damage, then explodes when thrown.', cooldown: 20, duration: 6, type: 'mitigation', value: 0.5 } },
  { id: 'wilhelm', name: 'Wilhelm', game: 'TPS', cost: 1700,
    skill: { name: 'Wolf and Saint', desc: 'Combat drones add sustained DPS and healing.', cooldown: 18, duration: 12, type: 'flatDpsMult', value: 0.55 } },
  { id: 'nisha', name: 'Nisha', game: 'TPS', cost: 2100,
    skill: { name: 'Showdown', desc: 'Auto-aim, infinite ammo, and massive fire-rate buff.', cooldown: 20, duration: 8, type: 'flatDpsMult', value: 1.3 } },
  { id: 'fragtrap', name: 'Claptrap (Fragtrap)', game: 'TPS', cost: 3200,
    skill: { name: 'VaultHunter.EXE', desc: 'Random chaotic ability buff - on a good roll, devastating.', cooldown: 16, duration: 8, type: 'random', value: 2.5 } },
  { id: 'aurelia', name: 'Aurelia', game: 'TPS', cost: 2700,
    skill: { name: 'Cold Money', desc: 'Freezes nearby foes and buffs crit damage.', cooldown: 19, duration: 6, type: 'flatDpsMult', value: 0.7 } },

  // Borderlands 2
  { id: 'axton', name: 'Axton', game: 'BL2', cost: 3000,
    skill: { name: 'Sabre Turret', desc: 'Deployable turret with rockets, adds steady DPS.', cooldown: 18, duration: 14, type: 'flatDpsMult', value: 0.6 } },
  { id: 'maya', name: 'Maya', game: 'BL2', cost: 4200,
    skill: { name: 'Phaselock', desc: 'Locks a target in a bubble, amplifies damage taken.', cooldown: 16, duration: 5, type: 'flatDpsMult', value: 0.8 } },
  { id: 'salvador', name: 'Salvador', game: 'BL2', cost: 4500,
    skill: { name: 'Gunzerking', desc: 'Dual-wields any two weapons - doubles effective DPS.', cooldown: 20, duration: 10, type: 'flatDpsMult', value: 1.0 } },
  { id: 'zero', name: 'Zer0', game: 'BL2', cost: 5500,
    skill: { name: 'Deception', desc: 'Cloaks and leaves a decoy, next attack guarantees a massive crit.', cooldown: 17, duration: 4, type: 'burst', value: 4.0 } },
  { id: 'gaige', name: 'Gaige', game: 'BL2', cost: 8500,
    skill: { name: 'Anarchy + Deathtrap', desc: 'Stacking Anarchy damage plus a robotic pet - widely considered the most broken BL2 build.', cooldown: 14, duration: 12, type: 'flatDpsMult', value: 1.5 } },
  { id: 'krieg', name: 'Krieg', game: 'BL2', cost: 6500,
    skill: { name: 'Buzz Axe Rampage', desc: 'Melee frenzy with lifesteal and explosive follow-up.', cooldown: 18, duration: 8, type: 'flatDpsMult', value: 1.1 } },

  // Borderlands 3
  { id: 'amara', name: 'Amara', game: 'BL3', cost: 7200,
    skill: { name: 'Phasecast / Phaseslam', desc: 'Astral projection punch combo dealing heavy elemental damage.', cooldown: 16, duration: 6, type: 'flatDpsMult', value: 1.0 } },
  { id: 'flak', name: 'FL4K', game: 'BL3', cost: 9200,
    skill: { name: 'Fade Away', desc: 'Cloaks with guaranteed crits, plus a permanent pet companion DPS.', cooldown: 14, duration: 8, type: 'flatDpsMult', value: 1.4 } },
  { id: 'moze', name: 'Moze', game: 'BL3', cost: 8700,
    skill: { name: 'Iron Bear / Iron Cub', desc: 'Pilots a mech with rockets and miniguns - obscene burst windows.', cooldown: 20, duration: 10, type: 'flatDpsMult', value: 1.6 } },
  { id: 'zane', name: 'Zane', game: 'BL3', cost: 7600,
    skill: { name: 'Clone / Drone / Barrier', desc: 'Stacks multiple gadgets at once for layered sustained DPS.', cooldown: 12, duration: 10, type: 'flatDpsMult', value: 1.0 } },

  // Borderlands 4
  { id: 'vex', name: 'Vex', game: 'BL4', cost: 10500,
    skill: { name: 'Dark Siren Manifestation', desc: 'Summons spectral constructs that flank and shred.', cooldown: 15, duration: 9, type: 'flatDpsMult', value: 1.5 } },
  { id: 'harlowe', name: 'Harlowe', game: 'BL4', cost: 10000,
    skill: { name: 'Gravitar Field', desc: 'Warps gravity around enemies, amplifying all incoming damage.', cooldown: 16, duration: 7, type: 'flatDpsMult', value: 1.3 } },
  { id: 'amon', name: 'Amon', game: 'BL4', cost: 10000,
    skill: { name: 'Forged Exo-Arms', desc: 'Manifests spectral exo-arms for crushing melee bursts.', cooldown: 17, duration: 6, type: 'burst', value: 4.5 } },
  { id: 'rafa', name: 'Rafa', game: 'BL4', cost: 10000,
    skill: { name: 'Overdrive Rush', desc: 'Hyper-charges weapons for a frenzied fire-rate spike.', cooldown: 14, duration: 8, type: 'flatDpsMult', value: 1.35 } },
];
