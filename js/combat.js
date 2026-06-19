/* Combat: enemy scaling, encounter rolling, and battle simulation */

const BOSS_ENCOUNTER_CHANCE_BASE = 0.06; // chance any given encounter is a rare boss

function enemyHpAt(level, prestigeTier, bossMult) {
  const base = 45;
  const hp = base * Math.pow(1.12, level) * Math.pow(1.5, prestigeTier) * (bossMult || 1);
  return Math.round(hp);
}

function enemyDamageAt(level, prestigeTier, bossMult) {
  const base = 4;
  const dmg = base * Math.pow(1.085, level) * Math.pow(1.35, prestigeTier) * Math.pow(bossMult || 1, 0.6);
  return Math.round(dmg * 10) / 10;
}

/* Roll a random encounter: either a regular enemy type or a rare cross-game boss */
function rollEncounter(level, prestigeTier) {
  const isBoss = Math.random() < BOSS_ENCOUNTER_CHANCE_BASE;
  if (isBoss) {
    const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
    return {
      name: boss.name, game: boss.game, isBoss: true, element: boss.element, level,
      maxHp: enemyHpAt(level, prestigeTier, boss.bossMult),
      hp: enemyHpAt(level, prestigeTier, boss.bossMult),
      dmgPerSec: enemyDamageAt(level, prestigeTier, boss.bossMult),
    };
  }
  const enemy = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
  const maxHp = Math.round(enemyHpAt(level, prestigeTier, 1) * enemy.hpMult);
  return {
    name: enemy.name, game: enemy.game, isBoss: false, element: enemy.element, level,
    maxHp, hp: maxHp,
    dmgPerSec: Math.round(enemyDamageAt(level, prestigeTier, 1) * enemy.dmgMult * 10) / 10,
  };
}

/* Derive the player's effective combat stats from current equipped gear + active hunter */
function derivePlayerCombatStats(state) {
  const eq = state.equipped;
  const guns = [eq.gun1, eq.gun2].filter(Boolean);
  let baseDps = guns.reduce((s, g) => s + g.dps, 0);
  if (baseDps === 0) baseDps = 8; // bare fists, so combat never stalls completely

  const classModPercent = eq.classmod ? eq.classmod.bonusPercent : 0;
  const artifactPercent = eq.artifact ? eq.artifact.bonusPercent : 0;
  const gearMult = 1 + (classModPercent + artifactPercent) / 100;
  const prestigeMult = 1 + state.prestigeBonusPercent / 100;

  const grenadeDamage = eq.grenade ? eq.grenade.damage : 0;
  const grenadeInterval = 5; // seconds between throws
  const grenadeDps = grenadeDamage / grenadeInterval;

  const shieldCapacity = eq.shield ? eq.shield.capacity : 0;
  const maxHealth = 100 + state.level * 8 + state.prestige * 40;

  const hunter = state.activeHunterId ? VAULT_HUNTERS.find(h => h.id === state.activeHunterId) : null;

  return {
    baseDps: baseDps * gearMult * prestigeMult,
    grenadeDps: grenadeDps * gearMult * prestigeMult,
    shieldCapacity, maxHealth, hunter,
  };
}

const MAX_BATTLE_SECONDS = 240;

function simulateBattle(state, encounter) {
  const p = derivePlayerCombatStats(state);
  let hp = encounter.hp;
  let health = p.maxHealth;
  let shield = p.shieldCapacity;
  let skillCooldown = 0;
  let skillActive = 0;
  let grenadeTimer = 0;
  let t = 0;
  const log = [];
  let totalDealt = 0, totalTaken = 0;

  while (hp > 0 && health > 0 && t < MAX_BATTLE_SECONDS) {
    t += 1;
    let dpsMult = 1;

    if (p.hunter) {
      if (skillActive > 0) {
        skillActive -= 1;
        if (p.hunter.skill.type === 'flatDpsMult') dpsMult += p.hunter.skill.value;
        if (p.hunter.skill.type === 'random') dpsMult += Math.random() * p.hunter.skill.value;
      } else if (skillCooldown <= 0) {
        skillCooldown = p.hunter.skill.cooldown;
        if (p.hunter.skill.type === 'burst') {
          const burst = p.baseDps * p.hunter.skill.value;
          hp -= burst; totalDealt += burst;
          log.push(`${p.hunter.name} unleashes ${p.hunter.skill.name} for a burst of ${Math.round(burst).toLocaleString()} damage!`);
        } else {
          skillActive = p.hunter.skill.duration;
          log.push(`${p.hunter.name} activates ${p.hunter.skill.name}!`);
        }
      } else {
        skillCooldown -= 1;
      }
    }

    const dealt = p.baseDps * dpsMult;
    hp -= dealt; totalDealt += dealt;

    grenadeTimer += 1;
    if (grenadeTimer >= 5 && p.grenadeDps > 0) {
      grenadeTimer = 0;
      const burst = p.grenadeDps * 5;
      hp -= burst; totalDealt += burst;
    }

    if (hp <= 0) break;

    let incoming = encounter.dmgPerSec;
    if (p.hunter && skillActive > 0 && p.hunter.skill.type === 'mitigation') {
      incoming *= (1 - p.hunter.skill.value);
    }
    if (shield > 0) {
      const absorbed = Math.min(shield, incoming);
      shield -= absorbed;
      incoming -= absorbed;
    }
    health -= incoming;
    totalTaken += incoming;
  }

  const win = hp <= 0 && health > 0;
  return {
    win, timeTaken: t, damageDealt: Math.round(totalDealt), damageTaken: Math.round(totalTaken),
    log, timedOut: t >= MAX_BATTLE_SECONDS && hp > 0,
  };
}
