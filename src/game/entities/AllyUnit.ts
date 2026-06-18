import Phaser from 'phaser';

export type AllyKind = 'turret' | 'bot';

export class AllyUnit extends Phaser.Physics.Arcade.Sprite {
  kind: AllyKind;
  damage: number;
  fireRange: number;
  fireCooldown: number;
  fireTimer = 0;
  moveSpeed: number;
  remainingLife: number;
  onFire: (x: number, y: number, targetX: number, targetY: number) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    kind: AllyKind,
    textureKey: string,
    damage: number,
    fireRange: number,
    fireCooldown: number,
    lifeSeconds: number,
    moveSpeed: number,
    onFire: (x: number, y: number, targetX: number, targetY: number) => void,
  ) {
    super(scene, x, y, textureKey);
    this.kind = kind;
    this.damage = damage;
    this.fireRange = fireRange;
    this.fireCooldown = fireCooldown;
    this.remainingLife = lifeSeconds;
    this.moveSpeed = moveSpeed;
    this.onFire = onFire;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    if (kind === 'turret') {
      (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    }
  }

  update(dt: number, nearestEnemy: Phaser.Math.Vector2 | null) {
    this.remainingLife -= dt;
    this.fireTimer -= dt;

    if (this.kind === 'bot' && nearestEnemy) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
      const body = this.body as Phaser.Physics.Arcade.Body;
      if (dist > this.fireRange * 0.6) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
        body.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);
      } else {
        body.setVelocity(0, 0);
      }
    }

    if (nearestEnemy && this.fireTimer <= 0) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
      if (dist <= this.fireRange) {
        this.fireTimer = this.fireCooldown;
        this.onFire(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
      }
    }
  }

  isExpired(): boolean {
    return this.remainingLife <= 0;
  }
}
