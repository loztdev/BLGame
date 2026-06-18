import Phaser from 'phaser';
import { ENEMY_TYPES, levelScaledDamage, levelScaledHealth, type EnemyKind, type EnemyTypeDef } from './EnemyTypes';
import type { ElementType } from '../items/types';

export interface DotInstance {
  perSecond: number;
  remaining: number;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  def: EnemyTypeDef;
  level: number;
  maxHealth: number;
  health: number;
  attackTimer = 0;
  phaseLocked = false;
  dots: DotInstance[] = [];
  healthBarBg: Phaser.GameObjects.Rectangle;
  healthBarFg: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: EnemyKind, level: number) {
    const def = ENEMY_TYPES[kind];
    super(scene, x, y, `enemy_${kind}`);
    this.def = def;
    this.level = level;
    this.maxHealth = levelScaledHealth(def.baseHealth, level);
    this.health = this.maxHealth;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(def.radius);
    this.setDamping(true);
    this.setDrag(0.001);

    this.healthBarBg = scene.add.rectangle(x, y - def.radius - 10, 32, 5, 0x000000, 0.6);
    this.healthBarFg = scene.add.rectangle(x, y - def.radius - 10, 32, 5, 0xff3b3b, 1);
  }

  get contactDamage(): number {
    return levelScaledDamage(this.def.baseContactDamage, this.level);
  }

  get projectileDamage(): number {
    return levelScaledDamage(this.def.projectileDamage, this.level);
  }

  applyDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
    this.refreshHealthBar();
  }

  applyDot(perSecond: number, duration: number) {
    if (perSecond <= 0) return;
    this.dots.push({ perSecond, remaining: duration });
  }

  tickDots(dt: number) {
    if (this.dots.length === 0) return;
    let total = 0;
    this.dots.forEach((d) => (total += d.perSecond * dt));
    if (total > 0) this.applyDamage(total);
    this.dots = this.dots.filter((d) => {
      d.remaining -= dt;
      return d.remaining > 0;
    });
  }

  refreshHealthBar() {
    this.healthBarFg.width = 32 * Math.max(0, this.health / this.maxHealth);
  }

  syncBars() {
    this.healthBarBg.setPosition(this.x, this.y - this.def.radius - 10);
    this.healthBarFg.setPosition(this.x - (32 - this.healthBarFg.width) / 2, this.y - this.def.radius - 10);
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  destroyWithBars() {
    this.healthBarBg.destroy();
    this.healthBarFg.destroy();
    this.destroy();
  }
}

export function elementTintFor(element: ElementType): number {
  const tints: Record<ElementType, number> = {
    kinetic: 0xffffff,
    incendiary: 0xff7043,
    shock: 0x4dd0e1,
    corrosive: 0x9ccc65,
    cryo: 0x81d4fa,
    explosive: 0xffb74d,
  };
  return tints[element];
}
