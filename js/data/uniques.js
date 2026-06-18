/* Exhaustive (curated) database of unique/legendary items across every game.
   Every entry is tagged with its source game so the UI can label it.
   baseValue is the pre-level-scaling power baseline used by generator.js:
     guns: relative base damage | shields: relative capacity | grenades: relative damage
     artifacts/classmods: relative % bonus
*/

const UNIQUES = [];

/* ---------------------------------------------------------------- BORDERLANDS 1 ---- */
UNIQUES.push(
  { id:'bl1_defiler', name:'Defiler', category:'gun', type:'Pistol', game:'BL1', manufacturer:'Maliwan', element:'incendiary', baseValue:95, effect:'Cycles between elements as you fire it.' },
  { id:'bl1_masher', name:'Masher', category:'gun', type:'Pistol', game:'BL1', manufacturer:'Jakobs', element:'none', baseValue:130, effect:'Fires a tight burst that converges into one devastating blow.' },
  { id:'bl1_serpens', name:'Serpens', category:'gun', type:'SMG', game:'BL1', manufacturer:'Maliwan', element:'corrosive', baseValue:88, effect:'Stacks corrosive damage-over-time rapidly.' },
  { id:'bl1_orion', name:'Orion', category:'gun', type:'Sniper Rifle', game:'BL1', manufacturer:'Dahl', element:'shock', baseValue:140, effect:'Critical hits arc a shock bolt to nearby enemies.' },
  { id:'bl1_skullmasher', name:'Skullmasher', category:'gun', type:'Sniper Rifle', game:'BL1', manufacturer:'Jakobs', element:'none', baseValue:160, effect:'Fires a tight spread of multiple high-damage rounds at once.' },
  { id:'bl1_doppelganger', name:'Doppelganger', category:'gun', type:'Sniper Rifle', game:'BL1', manufacturer:'Hyperion', element:'none', baseValue:135, effect:'Self-correcting sight; accuracy improves the longer you aim.' },
  { id:'bl1_lance', name:'Lance', category:'gun', type:'Sniper Rifle', game:'BL1', manufacturer:'Dahl', element:'none', baseValue:150, effect:'Burst-fire sniper rifle with brutal per-burst damage.' },
  { id:'bl1_teapot', name:'Teapot', category:'gun', type:'Rocket Launcher', game:'BL1', manufacturer:'Torgue', element:'explosive', baseValue:200, effect:'Comically oversized blast radius.' },
  { id:'bl1_cobra', name:'Cobra', category:'gun', type:'Pistol', game:'BL1', manufacturer:'Jakobs', element:'none', baseValue:145, effect:'Slow-firing revolver with devastating single-shot damage.' },
  { id:'bl1_boneshredder', name:'Bone Shredder', category:'gun', type:'Shotgun', game:'BL1', manufacturer:'Hyperion', element:'none', baseValue:155, effect:'Tight pellet spread that shreds armor.' },
  { id:'bl1_hornet', name:'Hornet', category:'gun', type:'SMG', game:'BL1', manufacturer:'Dahl', element:'none', baseValue:90, effect:'Twin-barrel burst SMG with pinpoint accuracy.' },
  { id:'bl1_tsunami', name:'Tsunami', category:'gun', type:'Sniper Rifle', game:'BL1', manufacturer:'Maliwan', element:'shock', baseValue:138, effect:'Alternates shock and corrosive damage every shot.' },

  { id:'bl1_anshin_guardian', name:'Anshin Guardian', category:'shield', game:'BL1', manufacturer:'Anshin', baseValue:300, effect:'Releases a stunning nova when depleted.' },
  { id:'bl1_backhand', name:'Backhand', category:'shield', game:'BL1', manufacturer:'Pangolin', baseValue:340, effect:'Reflects a portion of melee damage back at attackers.' },
  { id:'bl1_black_hole_v1', name:'Black Hole', category:'shield', game:'BL1', manufacturer:'Hyperion', baseValue:260, effect:'Completely absorbs one massive hit per fight.' },
  { id:'bl1_sunshine', name:'Sunshine', category:'shield', game:'BL1', manufacturer:'Anshin', baseValue:280, effect:'Releases a healing nova when the shield breaks.' },
  { id:'bl1_cracked_sash', name:'Cracked Sash', category:'shield', game:'BL1', manufacturer:'Pangolin', baseValue:420, effect:'Very high capacity but a sluggish recharge.' },

  { id:'bl1_fastball', name:'Fastball', category:'grenade', grenadeType:'standard', game:'BL1', manufacturer:'Tediore', element:'none', baseValue:90, effect:'No-frills, high single-target damage.' },
  { id:'bl1_bouncing_bonny', name:'Bouncing Bonny', category:'grenade', grenadeType:'bouncing', game:'BL1', manufacturer:'Tediore', element:'explosive', baseValue:80, effect:'Bounces and detonates several times before settling.' },
  { id:'bl1_sticky_throwable', name:'Sticky Throwable', category:'grenade', grenadeType:'sticky', game:'BL1', manufacturer:'Tediore', element:'none', baseValue:75, effect:'Adheres to surfaces or enemies before detonating.' },
  { id:'bl1_fire_storm', name:'Fire Storm', category:'grenade', grenadeType:'aoe', game:'BL1', manufacturer:'Maliwan', element:'incendiary', baseValue:70, effect:'Leaves behind a lingering field of fire.' },

  { id:'bl1_tribute_mercury', name:'Tribute of Mercury', category:'artifact', game:'BL1', baseValue:22, effect:'Greatly increases SMG fire rate.' },
  { id:'bl1_tribute_eridia', name:'Tribute of Eridia', category:'artifact', game:'BL1', baseValue:25, effect:'Dramatically increases elemental effect chance.' },
  { id:'bl1_bloodied_relic', name:"Mercenary's Bloodied Relic", category:'artifact', game:'BL1', baseValue:28, effect:'Bonus melee and gun damage that grows as health drops.' },
  { id:'bl1_nine_lives', name:'Nine Lives Relic', category:'artifact', game:'BL1', baseValue:20, effect:'Stacking damage reduction every time you nearly die.' },

  { id:'bl1_cm_soldier', name:'Legendary Soldier', category:'classmod', forClass:'roland', game:'BL1', baseValue:24, effect:'Major turret duration and gun damage boost.' },
  { id:'bl1_cm_hunter', name:'Legendary Hunter', category:'classmod', forClass:'mordecai', game:'BL1', baseValue:24, effect:'Major Bloodwing and sniper damage boost.' },
  { id:'bl1_cm_siren', name:'Legendary Siren', category:'classmod', forClass:'lilith', game:'BL1', baseValue:24, effect:'Major Phasewalk duration and elemental boost.' },
  { id:'bl1_cm_berserker', name:'Legendary Berserker', category:'classmod', forClass:'brick', game:'BL1', baseValue:24, effect:'Major melee and explosive damage boost.' },
);

/* ---------------------------------------------------------------- THE PRE-SEQUEL ---- */
UNIQUES.push(
  { id:'tps_lady_fist', name:'Lady Fist', category:'gun', type:'Pistol', game:'TPS', manufacturer:'Dahl', element:'none', baseValue:120, effect:'Guaranteed critical hits; fires a bonus explosive pellet.' },
  { id:'tps_hawk_eye', name:'Hawk Eye', category:'gun', type:'Sniper Rifle', game:'TPS', manufacturer:'Dahl', element:'none', baseValue:165, effect:'Zero bullet drop; can fire twice per trigger pull.' },
  { id:'tps_florentine', name:'Florentine', category:'gun', type:'Pistol', game:'TPS', manufacturer:'Vladof', element:'none', baseValue:100, effect:'Absurd single-pistol fire rate.' },
  { id:'tps_heart_breaker', name:'Heart Breaker', category:'gun', type:'Shotgun', game:'TPS', manufacturer:'Hyperion', element:'none', baseValue:150, effect:'Fires pellets in a heart-shaped spread pattern.' },
  { id:'tps_kitten', name:'Kitten', category:'gun', type:'Assault Rifle', game:'TPS', manufacturer:'Tediore', element:'explosive', baseValue:115, effect:'Fires bouncing grenades instead of bullets.' },
  { id:'tps_logans_gun', name:"Logan's Gun", category:'gun', type:'Rocket Launcher', game:'TPS', manufacturer:'Torgue', element:'explosive', baseValue:195, effect:'Fires a continuous stream of mini-rockets.' },
  { id:'tps_slow_hand', name:'Slow Hand', category:'gun', type:'Shotgun', game:'TPS', manufacturer:'Jakobs', element:'none', baseValue:145, effect:'Every hit has a chance to refund the shell.' },

  { id:'tps_white_knight', name:'White Knight', category:'shield', game:'TPS', manufacturer:'Hyperion', baseValue:330, effect:'Grants bonus armor while shields are up.' },
  { id:'tps_wtf', name:'Whisky Tango Foxtrot', category:'shield', game:'TPS', manufacturer:'Pangolin', baseValue:300, effect:'Releases a random elemental nova when broken.' },
  { id:'tps_wee_wee_booster', name:"Wee Wee's Super Booster", category:'shield', game:'TPS', manufacturer:'Anshin', baseValue:280, effect:'Massive movement speed boost when the shield breaks.' },

  { id:'tps_bonus_package', name:'Bonus Package', category:'grenade', grenadeType:'standard', game:'TPS', manufacturer:'Vladof', element:'none', baseValue:85, effect:'Drops a bonus supply package alongside the blast.' },
  { id:'tps_buzz_grenade', name:'Z0-3KOM Buzz Grenade', category:'grenade', grenadeType:'aoe', game:'TPS', manufacturer:'Tediore', element:'shock', baseValue:78, effect:'Spawns a lingering buzzing shock orb.' },

  { id:'tps_meteor_slam', name:'Meteor Slam Oz Kit', category:'artifact', game:'TPS', baseValue:30, effect:'Massive butt-slam damage and slowed fall speed.' },
  { id:'tps_rebel_oz', name:'Rebel Oz Kit', category:'artifact', game:'TPS', baseValue:24, effect:'Boosts gun damage while airborne in low gravity.' },
  { id:'tps_bone_ancients', name:'Bone of the Ancients', category:'artifact', game:'TPS', baseValue:26, effect:'Stacking elemental damage bonus that resets on weapon swap.' },

  { id:'tps_cm_gladiator', name:'Legendary Gladiator', category:'classmod', forClass:'athena', game:'TPS', baseValue:24, effect:'Aspis and melee damage boost.' },
  { id:'tps_cm_hunterkiller', name:'Legendary Hunter-Killer', category:'classmod', forClass:'wilhelm', game:'TPS', baseValue:24, effect:'Drone and gun damage boost.' },
  { id:'tps_cm_sheriff', name:'Legendary Sheriff', category:'classmod', forClass:'nisha', game:'TPS', baseValue:24, effect:'Showdown duration and gun damage boost.' },
  { id:'tps_cm_baroness', name:'Legendary Baroness', category:'classmod', forClass:'aurelia', game:'TPS', baseValue:24, effect:'Cryo and critical damage boost.' },
);

/* ---------------------------------------------------------------- BORDERLANDS 2 ---- */
UNIQUES.push(
  { id:'bl2_unkempt_harold', name:'Unkempt Harold', category:'gun', type:'Pistol', game:'BL2', manufacturer:'Jakobs', element:'none', baseValue:175, effect:'Fires 3 ricocheting rounds that converge on a single target.' },
  { id:'bl2_conference_call', name:'Conference Call', category:'gun', type:'Shotgun', game:'BL2', manufacturer:'Hyperion', element:'none', baseValue:185, effect:'Fires mini rockets that split further on impact.' },
  { id:'bl2_sand_hawk', name:'Sand Hawk', category:'gun', type:'SMG', game:'BL2', manufacturer:'Dahl', element:'corrosive', baseValue:120, effect:'Fires a boomerang spread of corrosive projectiles.' },
  { id:'bl2_norfleet', name:'Norfleet', category:'gun', type:'Rocket Launcher', game:'BL2', manufacturer:'Maliwan', element:'shock', baseValue:240, effect:'Launches a screen-clearing elemental nuke.' },
  { id:'bl2_pimpernel', name:'Pimpernel', category:'gun', type:'Sniper Rifle', game:'BL2', manufacturer:'Maliwan', element:'none', baseValue:190, effect:'Fires two off-axis rounds that converge and ricochet for bonus damage.' },
  { id:'bl2_bitch', name:'Bitch', category:'gun', type:'SMG', game:'BL2', manufacturer:'Dahl', element:'none', baseValue:130, effect:'Tight burst-fire spread for extremely high sustained DPS.' },
  { id:'bl2_lyuda', name:'Lyuda', category:'gun', type:'Sniper Rifle', game:'BL2', manufacturer:'Dahl', element:'none', baseValue:170, effect:'High-accuracy three-round burst sniper rifle.' },
  { id:'bl2_volcano', name:'Volcano', category:'gun', type:'Sniper Rifle', game:'BL2', manufacturer:'Maliwan', element:'incendiary', baseValue:165, effect:'Ignites targets and erupts on a kill.' },
  { id:'bl2_fibber', name:'Fibber', category:'gun', type:'Pistol', game:'BL2', manufacturer:'Jakobs', element:'none', baseValue:150, effect:'Looks like a sniper but fires a shotgun-style spread.' },
  { id:'bl2_grog_nozzle', name:'Grog Nozzle', category:'gun', type:'Pistol', game:'BL2', manufacturer:'Maliwan', element:'incendiary', baseValue:80, effect:'Heals the wielder for a portion of damage dealt.' },
  { id:'bl2_rubi', name:'Rubi', category:'gun', type:'Pistol', game:'BL2', manufacturer:'Maliwan', element:'none', baseValue:95, effect:'Heals the wielder a percentage of melee/gun damage dealt.' },
  { id:'bl2_slagga', name:'Slagga', category:'gun', type:'SMG', game:'BL2', manufacturer:'Bandit', element:'slag', baseValue:100, effect:'Chance to fire two extra slag projectiles per shot.' },
  { id:'bl2_gub', name:'Gub', category:'gun', type:'Pistol', game:'BL2', manufacturer:'Maliwan', element:'none', baseValue:160, effect:'A suspiciously powerful sidearm of unknown origin.' },
  { id:'bl2_cobra_bl2', name:'Cobra', category:'gun', type:'Sniper Rifle', game:'BL2', manufacturer:'Dahl', element:'none', baseValue:155, effect:'Switches to a shotgun-mode alt-fire for high burst damage.' },

  { id:'bl2_the_bee', name:'The Bee', category:'shield', game:'BL2', manufacturer:'Hyperion', baseValue:180, effect:'Massively amplifies your next shot per shield charge; very low capacity.' },
  { id:'bl2_evolution', name:'Evolution', category:'shield', game:'BL2', manufacturer:'Pangolin', baseValue:320, effect:'Resistances adapt to the last damage type you took.' },
  { id:'bl2_black_hole_v2', name:'Black Hole', category:'shield', game:'BL2', manufacturer:'Hyperion', baseValue:300, effect:'Pulls in nearby enemy projectiles and novas on break.' },
  { id:'bl2_the_sham', name:'The Sham', category:'shield', game:'BL2', manufacturer:'Anshin', baseValue:260, effect:'Chance to absorb incoming bullets into spare ammo.' },
  { id:'bl2_rough_rider', name:'Rough Rider', category:'shield', game:'BL2', manufacturer:'Torgue', baseValue:0, effect:'No shield capacity, but boosts max health and explosive/melee resistance.' },

  { id:'bl2_kiss_of_death', name:'Kiss of Death', category:'grenade', grenadeType:'singularity', game:'BL2', manufacturer:'Bandit', element:'explosive', baseValue:110, effect:'Pulls enemies in with a singularity before a massive explosion.' },
  { id:'bl2_breath_seraphim', name:'Breath of the Seraphim', category:'grenade', grenadeType:'aoe', game:'BL2', manufacturer:'Torgue', element:'explosive', baseValue:95, effect:'Drops a continuous barrage of explosive fire.' },
  { id:'bl2_magic_missile', name:'Magic Missile', category:'grenade', grenadeType:'standard', game:'BL2', manufacturer:'Vladof', element:'shock', baseValue:90, effect:'Homes in on multiple enemies, chaining elemental procs.' },
  { id:'bl2_fire_bee', name:'Fire Bee', category:'grenade', grenadeType:'mirv', game:'BL2', manufacturer:'Bandit', element:'incendiary', baseValue:100, effect:'MIRV cluster combined with a lingering incendiary field.' },

  { id:'bl2_bone_ancients', name:'Bone of the Ancients', category:'artifact', game:'BL2', baseValue:28, effect:'Stacking elemental damage bonus that resets on weapon swap.' },
  { id:'bl2_blood_ancients', name:'Blood of the Ancients', category:'artifact', game:'BL2', baseValue:35, effect:'Massive gun damage at the cost of constant health drain.' },
  { id:'bl2_sheriffs_badge', name:"Sheriff's Badge", category:'artifact', game:'BL2', baseValue:26, effect:'Bonus damage and fire rate for revolvers.' },
  { id:'bl2_moxxis_endowment', name:"Moxxi's Endowment", category:'artifact', game:'BL2', baseValue:24, effect:'Heals the wielder a percentage of damage dealt.' },
  { id:'bl2_deputys_badge', name:"Deputy's Badge", category:'artifact', game:'BL2', baseValue:25, effect:'Bonus damage and fire rate for pistols.' },

  { id:'bl2_cm_soldier', name:'Legendary Soldier', category:'classmod', forClass:'axton', game:'BL2', baseValue:26, effect:'Turret cooldown and gun damage boost.' },
  { id:'bl2_cm_siren', name:'Legendary Siren', category:'classmod', forClass:'maya', game:'BL2', baseValue:26, effect:'Phaselock cooldown and elemental damage boost.' },
  { id:'bl2_cm_gunzerker', name:'Legendary Gunzerker', category:'classmod', forClass:'salvador', game:'BL2', baseValue:26, effect:'Gun damage and reload speed boost while Gunzerking.' },
  { id:'bl2_cm_assassin', name:'Legendary Assassin', category:'classmod', forClass:'zero', game:'BL2', baseValue:26, effect:'Critical damage and Deception duration boost.' },
  { id:'bl2_cm_anarchist', name:'Legendary Anarchist', category:'classmod', forClass:'gaige', game:'BL2', baseValue:30, effect:'Anarchy stack retention and Deathtrap damage boost - infamously broken.' },
  { id:'bl2_cm_psycho', name:'Legendary Psycho', category:'classmod', forClass:'krieg', game:'BL2', baseValue:26, effect:'Melee and explosive damage boost.' },
);

/* ---------------------------------------------------------------- BORDERLANDS 3 ---- */
UNIQUES.push(
  { id:'bl3_kaoson', name:'Kaoson', category:'gun', type:'SMG', game:'BL3', manufacturer:'Dahl', element:'incendiary', baseValue:140, effect:'Periodically fires a burst of extra heat-seeking projectiles.' },
  { id:'bl3_hellwalker', name:'Hellwalker', category:'gun', type:'Shotgun', game:'BL3', manufacturer:'Jakobs', element:'incendiary', baseValue:210, effect:'Always incendiary; devastating single-target burst damage.' },
  { id:'bl3_plasma_coil', name:'Plasma Coil', category:'gun', type:'SMG', game:'BL3', manufacturer:'Atlas', element:'shock', baseValue:135, effect:'Charges up before unleashing a tracking energy orb.' },
  { id:'bl3_yellowcake', name:'Yellowcake', category:'gun', type:'Rocket Launcher', game:'BL3', manufacturer:'Torgue', element:'radiation', baseValue:255, effect:'Each rocket splits into three radioactive sub-rockets.' },
  { id:'bl3_craders_emp5', name:"Crader's EM-P5", category:'gun', type:'Pistol', game:'BL3', manufacturer:'Hyperion', element:'shock', baseValue:125, effect:'Fires a void-like singularity ball.' },
  { id:'bl3_lucians_call', name:"Lucian's Call", category:'gun', type:'SMG', game:'BL3', manufacturer:'Jakobs', element:'none', baseValue:145, effect:'Pellets pierce through shields entirely.' },
  { id:'bl3_monarch', name:'Monarch', category:'gun', type:'Assault Rifle', game:'BL3', manufacturer:'Vladof', element:'none', baseValue:160, effect:'Alternates between three different elements as you fire.' },
  { id:'bl3_free_radical', name:'Free Radical', category:'gun', type:'Assault Rifle', game:'BL3', manufacturer:'COV', element:'radiation', baseValue:150, effect:'Spins up rate of fire, leaving a radioactive cloud on impact.' },

  { id:'bl3_transformer', name:'Transformer', category:'shield', game:'BL3', manufacturer:'Hyperion', baseValue:310, effect:'Fully absorbs shock damage and converts it into shield charge.' },
  { id:'bl3_re_router', name:'Re-Router', category:'shield', game:'BL3', manufacturer:'Hyperion', baseValue:290, effect:'Reflects elemental damage back as a matching nova.' },
  { id:'bl3_stinger', name:'Stinger', category:'shield', game:'BL3', manufacturer:'Pangolin', baseValue:400, effect:'Massively boosted capacity with a minor recharge penalty.' },
  { id:'bl3_old_god', name:'Old God', category:'shield', game:'BL3', manufacturer:'Pangolin', baseValue:460, effect:'Enormous capacity, but a very slow recharge delay.' },

  { id:'bl3_hex', name:'Hex', category:'grenade', grenadeType:'singularity', game:'BL3', manufacturer:'Atlas', element:'dark', baseValue:120, effect:'Tracker orb pulls enemies in and detonates repeatedly.' },
  { id:'bl3_quasar', name:'Quasar', category:'grenade', grenadeType:'singularity', game:'BL3', manufacturer:'Vladof', element:'none', baseValue:115, effect:'Forms a black hole that pulls enemies into the blast.' },
  { id:'bl3_ghast_call', name:'Ghast Call', category:'grenade', grenadeType:'aoe', game:'BL3', manufacturer:'COV', element:'dark', baseValue:110, effect:'Summons a swarm of homing ghost projectiles.' },

  { id:'bl3_otto_idol', name:'Otto Idol', category:'artifact', game:'BL3', baseValue:30, effect:'Bonus grenade damage and ammo regeneration on throw.' },
  { id:'bl3_victory_rush', name:'Victory Rush', category:'artifact', game:'BL3', baseValue:32, effect:'Move speed, gun damage, and reload speed boost after a kill.' },
  { id:'bl3_deathless', name:'Deathless', category:'artifact', game:'BL3', baseValue:18, effect:'Prevents fatal damage once, then enters a long cooldown.' },
  { id:'bl3_stinging_light_show', name:'Stinging Light Show', category:'artifact', game:'BL3', baseValue:27, effect:'Hits proc a chain-lightning bolt to nearby enemies.' },

  { id:'bl3_cm_amara', name:"Seein' Dead", category:'classmod', forClass:'amara', game:'BL3', baseValue:28, effect:'Boosts Personal Space and elemental skills.' },
  { id:'bl3_cm_flak', name:'Red Fang', category:'classmod', forClass:'flak', game:'BL3', baseValue:28, effect:'Boosts rakk attack and pet companion skills.' },
  { id:'bl3_cm_moze', name:'Blast Master', category:'classmod', forClass:'moze', game:'BL3', baseValue:28, effect:'Boosts splash damage and Iron Bear fuel efficiency.' },
  { id:'bl3_cm_zane', name:'Fixer', category:'classmod', forClass:'zane', game:'BL3', baseValue:28, effect:'Boosts digi-clone duration and barrier skills.' },
);

/* ---------------------------------------------------------------- BORDERLANDS 4 ---- */
UNIQUES.push(
  { id:'bl4_hollow_reverence', name:'Hollow Reverence', category:'gun', type:'Sniper Rifle', game:'BL4', manufacturer:'Order', element:'dark', baseValue:230, effect:'Consecutive hits on the same target stack bonus damage.' },
  { id:'bl4_gravewell', name:'Gravewell', category:'gun', type:'Shotgun', game:'BL4', manufacturer:'Daedalus', element:'none', baseValue:220, effect:'Pulls enemies toward the point of impact before detonating.' },
  { id:'bl4_ledger_of_sins', name:'Ledger of Sins', category:'gun', type:'Assault Rifle', game:'BL4', manufacturer:'Order', element:'dark', baseValue:175, effect:'Gains permanent stacking damage per kill, this encounter only.' },
  { id:'bl4_singularity_fang', name:'Singularity Fang', category:'gun', type:'SMG', game:'BL4', manufacturer:'Daedalus', element:'shock', baseValue:150, effect:'Rounds curve toward the nearest gravity well.' },
  { id:'bl4_choir_bell', name:'Choir Bell', category:'gun', type:'Pistol', game:'BL4', manufacturer:'Order', element:'radiation', baseValue:165, effect:'Each shot marks the target for bonus radiation damage.' },

  { id:'bl4_mirrorplate_ward', name:'Mirrorplate Ward', category:'shield', game:'BL4', manufacturer:'Order', baseValue:350, effect:'Reflects a portion of incoming damage back at attackers.' },
  { id:'bl4_gravity_anchor', name:'Gravity Anchor', category:'shield', game:'BL4', manufacturer:'Daedalus', baseValue:380, effect:'Pulls in nearby enemies when the shield breaks.' },

  { id:'bl4_choir_of_bells', name:'Choir of Bells', category:'grenade', grenadeType:'mirv', game:'BL4', manufacturer:'Order', element:'dark', baseValue:130, effect:'Splits into ringing fragments that chain-detonate.' },
  { id:'bl4_event_horizon', name:'Event Horizon', category:'grenade', grenadeType:'singularity', game:'BL4', manufacturer:'Daedalus', element:'none', baseValue:135, effect:'Creates a localized gravity well before detonating.' },

  { id:'bl4_severed_halo', name:'Severed Halo', category:'artifact', game:'BL4', baseValue:30, effect:'Bonus damage against marked or anointed enemies.' },
  { id:'bl4_daedalus_core', name:'Daedalus Core Shard', category:'artifact', game:'BL4', baseValue:32, effect:'Bonus damage that scales with elapsed encounter time.' },

  { id:'bl4_cm_vex', name:"Vex's Reverie", category:'classmod', forClass:'vex', game:'BL4', baseValue:30, effect:'Boosts Dark Siren Manifestation duration.' },
  { id:'bl4_cm_harlowe', name:"Harlowe's Calculus", category:'classmod', forClass:'harlowe', game:'BL4', baseValue:30, effect:'Boosts Gravitar Field damage and uptime.' },
  { id:'bl4_cm_amon', name:"Amon's Discipline", category:'classmod', forClass:'amon', game:'BL4', baseValue:30, effect:'Boosts Forged Exo-Arms melee damage.' },
  { id:'bl4_cm_rafa', name:"Rafa's Tempo", category:'classmod', forClass:'rafa', game:'BL4', baseValue:30, effect:'Boosts Overdrive Rush fire-rate uptime.' },
);

/* ---------------------------------------------------------------- HELLFIRE SMG -----
   The ONE item with an explicit cross-game power ranking, per design directive:
   BL2 (best) > BL3 > BL4 > TPS > BL1 (worst). Same gun, five versions, scaled directly
   off HELLFIRE_GAME_MULTIPLIER in core.js. baseValue is identical; only the multiplier differs. */
HELLFIRE_GAME_ORDER.forEach((game, idx) => {
  UNIQUES.push({
    id: `hellfire_${game.toLowerCase()}`,
    name: 'Hellfire',
    category: 'gun',
    type: 'SMG',
    game,
    manufacturer: 'Maliwan',
    element: 'incendiary',
    baseValue: 105,
    versionMultiplier: HELLFIRE_GAME_MULTIPLIER[game],
    versionRank: idx + 1,
    effect: `Stacking incendiary burn that ignites on every hit. [${game} version - rank #${idx + 1} of 5]`,
  });
});
