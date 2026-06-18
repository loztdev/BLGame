import Phaser from 'phaser';
import type { CharacterDefinition, StatKey } from '../characters/types';
import { SkillTreeState } from '../characters/SkillTreeSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { computeFinalStats, mergeStatBonuses, type FinalStats, type StatBonusMap } from '../systems/StatsSystem';

interface TimedBuff {
  bonuses: StatBonusMap;
  remaining: number;
}

export const BASE_MELEE_DAMAGE = 22;
export const BASE_SHIELD_CAPACITY = 60;
export const BASE_SHIELD_RECHARGE = 12;
export const BASE_SHIELD_RECHARGE_DELAY = 2.5;

export class PlayerEntity extends Phaser.Physics.Arcade.Sprite {
  character: CharacterDefinition;
  skillTree: SkillTreeState;
  inventory = new InventorySystem();

  level = 1;
  xp = 0;
  xpToNext = 50;

  health = 0;
  shieldCurrent = 0;
  shieldRechargeDelayTimer = 0;

  stats: FinalStats;

  actionSkillCooldownRemaining = 0;
  actionSkillActiveRemaining = 0;
  bloodlustStacks = 0;

  guaranteedCritNextShot = false;
  cloaked = false;

  ammoInMagazine: number;
  reloadTimeRemaining = 0;

  private buffs: TimedBuff[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, character: CharacterDefinition) {
    super(scene, x, y, `player_${character.id}`);
    this.character = character;
    this.skillTree = new SkillTreeState(character, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(18);
    this.setCollideWorldBounds(true);

    this.stats = computeFinalStats(character, {});
    this.health = this.stats.maxHealth;
    this.shieldCurrent = BASE_SHIELD_CAPACITY * this.stats.shieldCapacityMult;
    this.ammoInMagazine = 0;
  }

  recomputeStats() {
    const skillBonuses = this.skillTree.computeStatBonuses();
    const equipBonuses = this.inventory.computeEquipmentStatBonuses(this.character.id);
    const buffBonuses = mergeStatBonuses(...this.buffs.map((b) => b.bonuses));
    const total = mergeStatBonuses(skillBonuses, equipBonuses, buffBonuses);
    const prevMaxHealth = this.stats?.maxHealth ?? 0;
    this.stats = computeFinalStats(this.character, total);
    if (prevMaxHealth > 0) {
      this.health = Math.min(this.stats.maxHealth, this.health * (this.stats.maxHealth / prevMaxHealth || 1));
    }
  }

  get shieldCapacity(): number {
    const shieldItemBonus = this.inventory.equipped.shield?.capacity ?? BASE_SHIELD_CAPACITY;
    return shieldItemBonus * this.stats.shieldCapacityMult;
  }

  get shieldRechargeRate(): number {
    const itemRate = this.inventory.equipped.shield?.rechargeRate ?? BASE_SHIELD_RECHARGE;
    return itemRate * this.stats.shieldRechargeMult;
  }

  get shieldRechargeDelay(): number {
    return this.inventory.equipped.shield?.rechargeDelay ?? BASE_SHIELD_RECHARGE_DELAY;
  }

  addBuff(bonuses: StatBonusMap, durationSeconds: number) {
    this.buffs.push({ bonuses, remaining: durationSeconds });
    this.recomputeStats();
  }

  tick(dt: number) {
    let buffsChanged = false;
    this.buffs = this.buffs.filter((b) => {
      b.remaining -= dt;
      if (b.remaining <= 0) buffsChanged = true;
      return b.remaining > 0;
    });
    if (buffsChanged) this.recomputeStats();

    if (this.actionSkillCooldownRemaining > 0) {
      this.actionSkillCooldownRemaining = Math.max(0, this.actionSkillCooldownRemaining - dt);
    }
    if (this.actionSkillActiveRemaining > 0) {
      this.actionSkillActiveRemaining = Math.max(0, this.actionSkillActiveRemaining - dt);
      if (this.actionSkillActiveRemaining === 0) {
        this.cloaked = false;
        this.bloodlustStacks = 0;
      }
    }

    if (this.health < this.stats.maxHealth && this.stats.healthRegenPerSec > 0) {
      this.health = Math.min(this.stats.maxHealth, this.health + this.stats.healthRegenPerSec * dt);
    }

    if (this.shieldCurrent < this.shieldCapacity) {
      if (this.shieldRechargeDelayTimer > 0) {
        this.shieldRechargeDelayTimer = Math.max(0, this.shieldRechargeDelayTimer - dt);
      } else {
        this.shieldCurrent = Math.min(this.shieldCapacity, this.shieldCurrent + this.shieldRechargeRate * dt);
      }
    }

    if (this.reloadTimeRemaining > 0) {
      this.reloadTimeRemaining = Math.max(0, this.reloadTimeRemaining - dt);
      if (this.reloadTimeRemaining === 0 && this.inventory.activeGun) {
        this.ammoInMagazine = this.inventory.activeGun.stats.magazineSize;
      }
    }
  }

  takeDamage(rawAmount: number): number {
    const reduced = Math.max(0, Math.round(rawAmount * (1 - this.stats.damageReductionPct)));
    let toHealth = reduced;
    if (this.shieldCurrent > 0) {
      const toShield = Math.min(reduced, this.shieldCurrent);
      this.shieldCurrent -= toShield;
      toHealth = reduced - toShield;
    }
    if (toHealth > 0) {
      this.health = Math.max(0, this.health - toHealth);
    }
    this.shieldRechargeDelayTimer = this.shieldRechargeDelay;
    return reduced;
  }

  heal(amount: number) {
    this.health = Math.min(this.stats.maxHealth, this.health + amount);
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  addXp(amount: number): boolean {
    this.xp += amount;
    let leveledUp = false;
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level += 1;
      this.xpToNext = Math.round(this.xpToNext * 1.35);
      this.skillTree.grantPoints(1);
      leveledUp = true;
    }
    if (leveledUp) this.recomputeStats();
    return leveledUp;
  }

  startReload() {
    const gun = this.inventory.activeGun;
    if (!gun || this.reloadTimeRemaining > 0) return;
    if (this.ammoInMagazine >= gun.stats.magazineSize) return;
    this.reloadTimeRemaining = gun.stats.reloadTime * this.stats.reloadSpeedMult;
  }

  onEquipActiveGunChanged() {
    const gun = this.inventory.activeGun;
    this.ammoInMagazine = gun ? gun.stats.magazineSize : 0;
    this.reloadTimeRemaining = 0;
  }

  statKeySnapshot(key: StatKey): number {
    const skillBonuses = this.skillTree.computeStatBonuses();
    return skillBonuses[key] ?? 0;
  }
}
