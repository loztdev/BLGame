import Phaser from 'phaser';
import type { ElementType } from '../items/types';

export type ProjectileOwner = 'player' | 'enemy' | 'ally';

export class Projectile extends Phaser.Physics.Arcade.Image {
  damage: number;
  element: ElementType;
  dotPerSecond: number;
  dotDuration: number;
  owner: ProjectileOwner;
  isCrit: boolean;
  pierceRemaining: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureKey: string,
    owner: ProjectileOwner,
    damage: number,
    element: ElementType,
    dotPerSecond: number,
    dotDuration: number,
    isCrit: boolean,
    pierce = 0,
  ) {
    super(scene, x, y, textureKey);
    this.owner = owner;
    this.damage = damage;
    this.element = element;
    this.dotPerSecond = dotPerSecond;
    this.dotDuration = dotDuration;
    this.isCrit = isCrit;
    this.pierceRemaining = pierce;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  fireAt(targetX: number, targetY: number, speed: number, life = 1.6) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    this.setRotation(angle);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.scene.time.delayedCall(life * 1000, () => {
      if (this.active) this.destroy();
    });
  }

  fireAngle(angle: number, speed: number, life = 1.6) {
    this.setRotation(angle);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.scene.time.delayedCall(life * 1000, () => {
      if (this.active) this.destroy();
    });
  }
}
