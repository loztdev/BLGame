import Phaser from 'phaser';
import { getCharacter } from '../game/characters/characters';
import { PlayerEntity } from '../game/entities/PlayerEntity';
import { Enemy, elementTintFor } from '../game/entities/Enemy';
import type { EnemyKind } from '../game/entities/EnemyTypes';
import { Projectile } from '../game/entities/Projectile';
import { Pickup } from '../game/entities/Pickup';
import { AllyUnit } from '../game/entities/AllyUnit';
import { ItemGenerator } from '../game/items/ItemGenerator';
import { LootSystem } from '../game/systems/LootSystem';
import { rollCrit, rollDamage } from '../game/systems/CombatSystem';
import { createRng, rngBool, rngFloat, rngPick } from '../game/items/rng';
import { RARITY_INFO, type ElementType, type GeneratedGun } from '../game/items/types';
import { VirtualJoystick } from '../ui/VirtualJoystick';
import { ActionButton } from '../ui/ActionButton';

const ARENA_WIDTH = 1800;
const ARENA_HEIGHT = 1400;
const BASE_CRIT_CHANCE = 0.12;

export class GameScene extends Phaser.Scene {
  player!: PlayerEntity;
  enemies!: Phaser.Physics.Arcade.Group;
  playerProjectiles!: Phaser.Physics.Arcade.Group;
  enemyProjectiles!: Phaser.Physics.Arcade.Group;
  allyProjectiles!: Phaser.Physics.Arcade.Group;
  pickups!: Phaser.Physics.Arcade.Group;
  walls!: Phaser.Physics.Arcade.StaticGroup;
  allies: AllyUnit[] = [];

  joystick!: VirtualJoystick;
  fireBtn!: ActionButton;
  meleeBtn!: ActionButton;
  grenadeBtn!: ActionButton;
  actionBtn!: ActionButton;
  reloadBtn!: ActionButton;

  itemGenerator = new ItemGenerator();
  lootSystem!: LootSystem;
  rng = createRng(Date.now() & 0xffffffff);

  fireTimer = 0;
  waveNumber = 0;
  waveTimer = 0;

  hudTexts: Record<string, Phaser.GameObjects.Text> = {};
  hudBars: Record<string, Phaser.GameObjects.Rectangle> = {};
  toastText!: Phaser.GameObjects.Text;
  toastTimer = 0;

  inventoryBtn!: ActionButton;
  skillBtn!: ActionButton;

  constructor() {
    super('Game');
  }

  init(data: { characterId: string }) {
    this.characterId = data.characterId;
  }

  characterId = 'rook';

  create() {
    this.lootSystem = new LootSystem(this.itemGenerator);
    this.physics.world.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    this.cameras.main.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    this.cameras.main.setBackgroundColor('#0b0c10');

    this.buildArena();

    const character = getCharacter(this.characterId);
    this.player = new PlayerEntity(this, ARENA_WIDTH / 2, ARENA_HEIGHT / 2, character);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.giveStartingLoadout();

    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: false });
    this.playerProjectiles = this.physics.add.group({ classType: Projectile });
    this.enemyProjectiles = this.physics.add.group({ classType: Projectile });
    this.allyProjectiles = this.physics.add.group({ classType: Projectile });
    this.pickups = this.physics.add.group({ classType: Pickup, runChildUpdate: false });

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);

    this.physics.add.overlap(this.playerProjectiles, this.enemies, (proj, enemy) =>
      this.onPlayerProjectileHitEnemy(proj as Projectile, enemy as Enemy),
    );
    this.physics.add.overlap(this.allyProjectiles, this.enemies, (proj, enemy) =>
      this.onAllyProjectileHitEnemy(proj as Projectile, enemy as Enemy),
    );
    this.physics.add.overlap(this.enemyProjectiles, this.player, (_p, proj) =>
      this.onEnemyProjectileHitPlayer(proj as Projectile),
    );
    this.physics.add.overlap(this.player, this.pickups, (_p, pickup) => this.onPickupCollected(pickup as Pickup));

    this.buildControls();
    this.buildHud();

    this.spawnWave();

    this.input.keyboard?.on('keydown-R', () => this.player.startReload());
    this.input.keyboard?.on('keydown-I', () => this.openInventory());
    this.input.keyboard?.on('keydown-K', () => this.openSkillTree());
  }

  private buildArena() {
    for (let x = 0; x < ARENA_WIDTH; x += 64) {
      for (let y = 0; y < ARENA_HEIGHT; y += 64) {
        this.add.image(x + 32, y + 32, 'floor_tile');
      }
    }
    this.walls = this.physics.add.staticGroup();
    const thickness = 32;
    this.addWallRect(0, 0, ARENA_WIDTH, thickness);
    this.addWallRect(0, ARENA_HEIGHT - thickness, ARENA_WIDTH, thickness);
    this.addWallRect(0, 0, thickness, ARENA_HEIGHT);
    this.addWallRect(ARENA_WIDTH - thickness, 0, thickness, ARENA_HEIGHT);

    const obstacles = [
      [400, 400], [1400, 400], [400, 1000], [1400, 1000], [900, 700],
    ];
    obstacles.forEach(([ox, oy]) => this.addWallRect(ox, oy, 96, 96));
  }

  private addWallRect(x: number, y: number, w: number, h: number) {
    for (let i = 0; i < w; i += 32) {
      for (let j = 0; j < h; j += 32) {
        const tile = this.add.image(x + i + 16, y + j + 16, 'wall_tile');
        this.walls.add(tile);
      }
    }
  }

  private giveStartingLoadout() {
    const gun = this.itemGenerator.generateGun({ level: 1, rarity: 'common' });
    this.player.inventory.equipItem(gun);
    this.player.onEquipActiveGunChanged();
    const shield = this.itemGenerator.generateShield({ level: 1, rarity: 'common' });
    this.player.inventory.equipItem(shield);
    this.player.recomputeStats();
  }

  private buildControls() {
    const { width, height } = this.scale;
    this.joystick = new VirtualJoystick(this, 90, height - 110);

    this.fireBtn = new ActionButton(this, width - 80, height - 100, 42, 'FIRE', 0xff5252);
    this.meleeBtn = new ActionButton(this, width - 160, height - 60, 30, 'MELEE', 0xffa726, () => this.doMelee());
    this.grenadeBtn = new ActionButton(this, width - 160, height - 150, 30, 'NADE', 0x66bb6a, () => this.throwGrenade());
    this.actionBtn = new ActionButton(this, width - 250, height - 100, 36, 'SKILL', 0x42a5f5, () => this.useActionSkill());
    this.reloadBtn = new ActionButton(this, width - 80, height - 170, 24, 'RELD', 0xbdbdbd, () => this.player.startReload());

    this.inventoryBtn = new ActionButton(this, width - 40, 30, 22, 'BAG', 0x9575cd, () => this.openInventory());
    this.skillBtn = new ActionButton(this, width - 100, 30, 22, 'TREE', 0x4db6ac, () => this.openSkillTree());
  }

  private buildHud() {
    const style = { fontSize: '12px', color: '#ffffff' };
    this.hudTexts.name = this.add.text(12, 10, '', style).setScrollFactor(0).setDepth(1000);
    this.hudTexts.level = this.add.text(12, 28, '', style).setScrollFactor(0).setDepth(1000);
    this.hudTexts.ammo = this.add.text(12, 64, '', style).setScrollFactor(0).setDepth(1000);
    this.hudTexts.gun = this.add.text(12, 82, '', style).setScrollFactor(0).setDepth(1000);
    this.hudTexts.wave = this.add.text(this.scale.width / 2, 10, '', style).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1000);

    this.hudBars.healthBg = this.add.rectangle(12, 100, 160, 10, 0x000000, 0.6).setOrigin(0, 0).setScrollFactor(0).setDepth(1000);
    this.hudBars.health = this.add.rectangle(12, 100, 160, 10, 0xff3b3b, 1).setOrigin(0, 0).setScrollFactor(0).setDepth(1001);
    this.hudBars.shieldBg = this.add.rectangle(12, 114, 160, 6, 0x000000, 0.6).setOrigin(0, 0).setScrollFactor(0).setDepth(1000);
    this.hudBars.shield = this.add.rectangle(12, 114, 160, 6, 0x42a5f5, 1).setOrigin(0, 0).setScrollFactor(0).setDepth(1001);
    this.hudBars.xpBg = this.add.rectangle(12, 124, 160, 4, 0x000000, 0.6).setOrigin(0, 0).setScrollFactor(0).setDepth(1000);
    this.hudBars.xp = this.add.rectangle(12, 124, 160, 4, 0xffd54f, 1).setOrigin(0, 0).setScrollFactor(0).setDepth(1001);

    this.toastText = this.add
      .text(this.scale.width / 2, 150, '', { fontSize: '13px', color: '#ffd54f', align: 'center' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1002);
  }

  private spawnWave() {
    this.waveNumber += 1;
    const count = 3 + this.waveNumber * 2;
    const level = this.player?.level ?? 1;
    const kinds: EnemyKind[] = ['grunt', 'shooter', 'brute'];
    for (let i = 0; i < count; i++) {
      const kind = this.waveNumber < 2 ? 'grunt' : rngPick(this.rng, kinds);
      this.spawnEnemy(kind, level);
    }
    this.waveTimer = 28;
    this.showToast(`Wave ${this.waveNumber} incoming!`);
  }

  private spawnEnemy(kind: EnemyKind, level: number) {
    let x = 0;
    let y = 0;
    let tries = 0;
    do {
      x = rngFloat(this.rng, 80, ARENA_WIDTH - 80);
      y = rngFloat(this.rng, 80, ARENA_HEIGHT - 80);
      tries++;
    } while (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 350 && tries < 10);
    const enemy = new Enemy(this, x, y, kind, level);
    this.enemies.add(enemy);
  }

  update(time: number, deltaMs: number) {
    const dt = Math.min(0.05, deltaMs / 1000);
    if (this.player.isDead()) return;

    this.player.tick(dt);
    this.updateMovement();
    this.updateFiring(dt);
    this.updateEnemies(dt);
    this.updateAllies(dt);
    this.updateHud();
    this.updateWaveTimer(dt);

    this.pickups.children.iterate((p) => {
      (p as Pickup).update(time, deltaMs);
      return true;
    });

    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.toastText.setText('');
    }
  }

  private updateMovement() {
    const speed = this.player.stats.moveSpeed;
    const v = this.joystick.vector;
    this.player.setVelocity(v.x * speed, v.y * speed);
    if (v.x !== 0 || v.y !== 0) {
      this.player.setRotation(Math.atan2(v.y, v.x) + Math.PI / 2);
    }
    this.player.setAlpha(this.player.cloaked ? 0.45 : 1);
  }

  private findNearestEnemy(x: number, y: number, maxRange = Infinity): Enemy | null {
    let nearest: Enemy | null = null;
    let nearestDist = maxRange;
    this.enemies.children.iterate((obj) => {
      const e = obj as Enemy;
      if (!e.active) return true;
      const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = e;
      }
      return true;
    });
    return nearest;
  }

  private updateFiring(dt: number) {
    this.fireTimer -= dt;
    if (!this.fireBtn.isDown) return;
    const gun = this.player.inventory.activeGun;
    if (!gun) return;
    if (this.player.reloadTimeRemaining > 0) return;
    if (this.player.ammoInMagazine <= 0) {
      this.player.startReload();
      return;
    }
    const interval = 1 / (gun.stats.fireRate * this.player.stats.fireRateMult);
    if (this.fireTimer > 0) return;
    const target = this.findNearestEnemy(this.player.x, this.player.y, 700);
    if (!target) return;
    this.fireTimer = interval;
    this.player.ammoInMagazine -= 1;
    this.fireGunAt(gun, target);
    if (this.player.ammoInMagazine <= 0) this.player.startReload();
  }

  private fireGunAt(gun: GeneratedGun, target: Enemy) {
    const accuracy = Math.min(0.99, gun.stats.accuracy + this.player.stats.accuracyBonus);
    const spread = (1 - accuracy) * 0.5;
    for (let p = 0; p < gun.stats.pelletCount; p++) {
      const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y);
      const angle = baseAngle + rngFloat(this.rng, -spread, spread);
      const isCrit = this.player.guaranteedCritNextShot || rollCrit(this.rng, BASE_CRIT_CHANCE);
      this.player.guaranteedCritNextShot = false;
      const isElemental = gun.element !== 'kinetic' && rngBool(this.rng, gun.elementalChance);
      const element: ElementType = isElemental ? gun.element : 'kinetic';
      const dmg = rollDamage({
        baseDamage: gun.stats.damage,
        gunDamageMult: this.player.stats.gunDamageMult,
        elementalDamageMult: this.player.stats.elementalDamageMult,
        critDamageMult: gun.stats.critMult * this.player.stats.critDamageMult,
        isCrit,
        element,
      });
      const proj = new Projectile(
        this,
        this.player.x,
        this.player.y,
        'proj_player',
        'player',
        dmg.amount,
        dmg.element,
        dmg.dotPerSecond,
        dmg.dotDuration,
        isCrit,
      );
      proj.setTint(elementTintFor(element));
      proj.fireAngle(angle, gun.stats.projectileSpeed);
      this.playerProjectiles.add(proj);
    }
  }

  private onPlayerProjectileHitEnemy(proj: Projectile, enemy: Enemy) {
    if (!proj.active || !enemy.active) return;
    enemy.applyDamage(proj.damage);
    enemy.applyDot(proj.dotPerSecond, proj.dotDuration);
    this.spawnDamageNumber(enemy.x, enemy.y, proj.damage, proj.isCrit);
    proj.destroy();
    if (enemy.isDead()) this.onEnemyKilled(enemy);
  }

  private onAllyProjectileHitEnemy(proj: Projectile, enemy: Enemy) {
    if (!proj.active || !enemy.active) return;
    enemy.applyDamage(proj.damage);
    this.spawnDamageNumber(enemy.x, enemy.y, proj.damage, false);
    proj.destroy();
    if (enemy.isDead()) this.onEnemyKilled(enemy);
  }

  private onEnemyProjectileHitPlayer(proj: Projectile) {
    if (!proj.active) return;
    this.player.takeDamage(proj.damage);
    proj.destroy();
  }

  private spawnDamageNumber(x: number, y: number, amount: number, isCrit: boolean) {
    const text = this.add.text(x, y - 20, isCrit ? `${amount}!` : `${amount}`, {
      fontSize: isCrit ? '15px' : '12px',
      color: isCrit ? '#ffd54f' : '#ffffff',
    });
    this.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 600,
      onComplete: () => text.destroy(),
    });
  }

  private onEnemyKilled(enemy: Enemy) {
    const xp = enemy.def.baseXp * enemy.level;
    const leveledUp = this.player.addXp(xp);
    if (leveledUp) this.showToast(`Level Up! You are now level ${this.player.level}`);

    if (this.player.character.id === 'riot' && this.player.actionSkillActiveRemaining > 0) {
      this.player.actionSkillActiveRemaining += 2;
      this.player.bloodlustStacks = Math.min(5, this.player.bloodlustStacks + 1);
      this.player.addBuff({ meleeDamagePct: 10, moveSpeedPct: 5 }, 2.1);
    }

    const drops = this.lootSystem.rollDrops(enemy.level, this.player.character.id);
    drops.forEach((item, i) => {
      const angle = (i / drops.length) * Math.PI * 2;
      const px = enemy.x + Math.cos(angle) * 20;
      const py = enemy.y + Math.sin(angle) * 20;
      const pickup = new Pickup(this, px, py, item);
      this.pickups.add(pickup);
    });

    enemy.destroyWithBars();
  }

  private updateEnemies(dt: number) {
    this.enemies.children.iterate((obj) => {
      const e = obj as Enemy;
      if (!e.active) return true;
      e.tickDots(dt);
      if (e.isDead()) {
        this.onEnemyKilled(e);
        return true;
      }
      e.syncBars();
      this.runEnemyAi(e, dt);
      return true;
    });
  }

  private runEnemyAi(e: Enemy, dt: number) {
    if (e.phaseLocked) {
      e.setVelocity(0, 0);
      return;
    }
    const dist = Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y);
    e.attackTimer -= dt;

    if (e.def.isRanged) {
      if (dist > e.def.attackRange * 0.6) {
        const angle = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
        e.setVelocity(Math.cos(angle) * e.def.baseSpeed, Math.sin(angle) * e.def.baseSpeed);
      } else {
        e.setVelocity(0, 0);
      }
      if (dist <= e.def.attackRange && e.attackTimer <= 0) {
        e.attackTimer = e.def.attackCooldown;
        const proj = new Projectile(
          this,
          e.x,
          e.y,
          'proj_enemy',
          'enemy',
          e.projectileDamage,
          'kinetic',
          0,
          0,
          false,
        );
        proj.fireAt(this.player.x, this.player.y, e.def.projectileSpeed);
        this.enemyProjectiles.add(proj);
      }
    } else {
      const angle = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
      if (dist > e.def.attackRange * 0.7) {
        e.setVelocity(Math.cos(angle) * e.def.baseSpeed, Math.sin(angle) * e.def.baseSpeed);
      } else {
        e.setVelocity(0, 0);
        if (e.attackTimer <= 0) {
          e.attackTimer = e.def.attackCooldown;
          this.player.takeDamage(e.contactDamage);
        }
      }
    }
  }

  private updateAllies(dt: number) {
    const nearest = this.findNearestEnemy(this.player.x, this.player.y, 900);
    const nearestVec = nearest ? new Phaser.Math.Vector2(nearest.x, nearest.y) : null;
    this.allies = this.allies.filter((ally) => {
      if (ally.isExpired() || !ally.active) {
        if (ally.active) ally.destroy();
        return false;
      }
      ally.update(dt, nearestVec);
      return true;
    });
  }

  private updateWaveTimer(dt: number) {
    this.waveTimer -= dt;
    if (this.waveTimer <= 0 && this.enemies.countActive(true) === 0) {
      this.spawnWave();
    } else if (this.waveTimer <= 0) {
      this.waveTimer = 5;
    }
  }

  private doMelee() {
    const range = 60;
    const dmg = Math.round(22 * this.player.stats.meleeDamageMult);
    this.enemies.children.iterate((obj) => {
      const e = obj as Enemy;
      if (!e.active) return true;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
      if (dist <= range) {
        e.applyDamage(dmg);
        this.spawnDamageNumber(e.x, e.y, dmg, false);
        if (this.player.stats.lifestealPct > 0) {
          this.player.heal(dmg * this.player.stats.lifestealPct);
        }
        if (e.isDead()) this.onEnemyKilled(e);
      }
      return true;
    });
  }

  private throwGrenade() {
    const grenade = this.player.inventory.equipped.grenadeMod;
    const damage = grenade ? grenade.damage * this.player.stats.elementalDamageMult : 50;
    const radius = grenade ? grenade.radius : 70;
    const target = this.findNearestEnemy(this.player.x, this.player.y, 700);
    const angle = target
      ? Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y)
      : this.player.rotation - Math.PI / 2;
    const proj = this.add.image(this.player.x, this.player.y, 'proj_grenade');
    this.tweens.add({
      targets: proj,
      x: this.player.x + Math.cos(angle) * 320,
      y: this.player.y + Math.sin(angle) * 320,
      duration: 450,
      onComplete: () => {
        this.detonateGrenade(proj.x, proj.y, damage, radius);
        proj.destroy();
      },
    });
  }

  private detonateGrenade(x: number, y: number, damage: number, radius: number) {
    const fx = this.add.image(x, y, 'explosion_fx').setScale(radius / 24);
    this.tweens.add({ targets: fx, alpha: 0, scale: (radius / 24) * 1.3, duration: 300, onComplete: () => fx.destroy() });
    this.enemies.children.iterate((obj) => {
      const e = obj as Enemy;
      if (!e.active) return true;
      const dist = Phaser.Math.Distance.Between(x, y, e.x, e.y);
      if (dist <= radius) {
        e.applyDamage(Math.round(damage));
        if (e.isDead()) this.onEnemyKilled(e);
      }
      return true;
    });
  }

  private useActionSkill() {
    if (this.player.actionSkillCooldownRemaining > 0) return;
    const character = this.player.character;
    const stats = this.player.stats;
    const duration = character.actionSkill.baseDuration * stats.actionSkillDurationMult;
    this.player.actionSkillCooldownRemaining = character.actionSkill.baseCooldown * stats.actionSkillCooldownMult;
    this.player.actionSkillActiveRemaining = duration;
    this.showToast(`${character.actionSkill.name} activated!`);

    switch (character.actionSkill.id) {
      case 'sentry_drop':
        this.spawnAlly('turret', duration, 18 * stats.actionSkillPowerMult);
        break;
      case 'combat_bot':
        this.spawnAlly('bot', duration, 14 * stats.actionSkillPowerMult);
        break;
      case 'phase_lock':
        this.castPhaseLock(duration, 25 * stats.actionSkillPowerMult);
        break;
      case 'rampage':
        this.player.addBuff(
          { fireRatePct: 40 * stats.actionSkillPowerMult, lifestealPct: 15, damageReductionPct: 20 },
          duration,
        );
        break;
      case 'shadow_step':
        this.player.cloaked = true;
        this.player.guaranteedCritNextShot = true;
        this.player.addBuff({ moveSpeedPct: 25 }, duration);
        break;
      case 'bloodlust':
        this.player.bloodlustStacks = 0;
        this.player.addBuff({ meleeDamagePct: 20 * stats.actionSkillPowerMult, moveSpeedPct: 15 }, duration);
        break;
    }
  }

  private spawnAlly(kind: 'turret' | 'bot', duration: number, damage: number) {
    const texture = kind === 'turret' ? 'ally_turret' : 'ally_bot';
    const ox = this.player.x + rngFloat(this.rng, -40, 40);
    const oy = this.player.y + rngFloat(this.rng, -40, 40);
    const ally = new AllyUnit(this, ox, oy, kind, texture, damage, 380, 0.9, duration, 160, (x, y, tx, ty) => {
      const proj = new Projectile(this, x, y, 'proj_ally', 'ally', damage, 'kinetic', 0, 0, false);
      proj.fireAt(tx, ty, 500);
      this.allyProjectiles.add(proj);
    });
    this.allies.push(ally);
  }

  private castPhaseLock(duration: number, damagePerSecond: number) {
    const target = this.findNearestEnemy(this.player.x, this.player.y, 500);
    if (!target) return;
    target.phaseLocked = true;
    target.applyDot(damagePerSecond, duration);
    this.time.delayedCall(duration * 1000, () => {
      if (target.active) target.phaseLocked = false;
    });
  }

  private onPickupCollected(pickup: Pickup) {
    const added = this.player.inventory.addToBackpack(pickup.item);
    if (added) {
      this.showToast(`Picked up ${pickup.item.name} (${RARITY_INFO[pickup.item.rarity].label})`);
    } else {
      this.showToast('Backpack full!');
    }
    pickup.destroyWithLabel();
  }

  private updateHud() {
    const p = this.player;
    this.hudTexts.name.setText(`${p.character.name} — ${p.character.title}`);
    this.hudTexts.level.setText(`Level ${p.level}  (${Math.floor(p.xp)}/${p.xpToNext} XP)  Skill Pts: ${p.skillTree.availablePoints}`);
    const gun = p.inventory.activeGun;
    this.hudTexts.ammo.setText(gun ? `Ammo: ${p.ammoInMagazine}/${gun.stats.magazineSize}${p.reloadTimeRemaining > 0 ? ' (reloading)' : ''}` : 'No weapon');
    this.hudTexts.gun.setText(gun ? `${gun.name} [${RARITY_INFO[gun.rarity].label}]` : '');
    this.hudTexts.wave.setText(`Wave ${this.waveNumber}  |  Enemies: ${this.enemies.countActive(true)}`);

    this.hudBars.health.width = 160 * Math.max(0, p.health / p.stats.maxHealth);
    this.hudBars.shield.width = 160 * Math.max(0, p.shieldCurrent / p.shieldCapacity);
    this.hudBars.xp.width = 160 * Math.max(0, p.xp / p.xpToNext);

    const cdFraction = p.actionSkillCooldownRemaining / (p.character.actionSkill.baseCooldown * p.stats.actionSkillCooldownMult);
    this.actionBtn.setCooldownFraction(Math.max(0, cdFraction));
  }

  private showToast(message: string) {
    this.toastText.setText(message);
    this.toastTimer = 2.5;
  }

  private openInventory() {
    this.scene.pause('Game');
    this.scene.launch('Inventory', { player: this.player });
  }

  private openSkillTree() {
    this.scene.pause('Game');
    this.scene.launch('SkillTree', { player: this.player });
  }
}
