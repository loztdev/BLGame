import Phaser from 'phaser';
import { CHARACTERS } from '../game/characters/characters';
import { ENEMY_TYPES } from '../game/entities/EnemyTypes';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.generatePlayerTextures();
    this.generateEnemyTextures();
    this.generateProjectileTextures();
    this.generateAllyTextures();
    this.generateMiscTextures();
    this.scene.start('CharacterSelect');
  }

  private generatePlayerTextures() {
    CHARACTERS.forEach((c) => {
      const g = this.add.graphics();
      g.fillStyle(c.color, 1);
      g.fillCircle(20, 20, 18);
      g.lineStyle(3, 0xffffff, 0.9);
      g.strokeCircle(20, 20, 18);
      g.fillStyle(0xffffff, 0.9);
      g.fillTriangle(20, 2, 14, 14, 26, 14);
      g.generateTexture(`player_${c.id}`, 40, 40);
      g.destroy();
    });
  }

  private generateEnemyTextures() {
    (Object.keys(ENEMY_TYPES) as (keyof typeof ENEMY_TYPES)[]).forEach((kind) => {
      const def = ENEMY_TYPES[kind];
      const size = def.radius * 2 + 4;
      const g = this.add.graphics();
      g.fillStyle(def.color, 1);
      g.fillCircle(size / 2, size / 2, def.radius);
      g.lineStyle(2, 0x000000, 0.5);
      g.strokeCircle(size / 2, size / 2, def.radius);
      g.generateTexture(`enemy_${kind}`, size, size);
      g.destroy();
    });
  }

  private generateProjectileTextures() {
    const g1 = this.add.graphics();
    g1.fillStyle(0xfff176, 1);
    g1.fillCircle(5, 5, 5);
    g1.generateTexture('proj_player', 10, 10);
    g1.destroy();

    const g2 = this.add.graphics();
    g2.fillStyle(0xff5252, 1);
    g2.fillCircle(5, 5, 5);
    g2.generateTexture('proj_enemy', 10, 10);
    g2.destroy();

    const g3 = this.add.graphics();
    g3.fillStyle(0x9e9e9e, 1);
    g3.fillCircle(6, 6, 6);
    g3.generateTexture('proj_grenade', 12, 12);
    g3.destroy();

    const g4 = this.add.graphics();
    g4.fillStyle(0x80deea, 1);
    g4.fillCircle(4, 4, 4);
    g4.generateTexture('proj_ally', 8, 8);
    g4.destroy();
  }

  private generateAllyTextures() {
    const turret = this.add.graphics();
    turret.fillStyle(0x607d8b, 1);
    turret.fillRect(2, 2, 28, 28);
    turret.lineStyle(2, 0xffffff, 0.8);
    turret.strokeRect(2, 2, 28, 28);
    turret.fillStyle(0xffffff, 1);
    turret.fillRect(14, 0, 4, 16);
    turret.generateTexture('ally_turret', 32, 32);
    turret.destroy();

    const bot = this.add.graphics();
    bot.fillStyle(0xe91e63, 1);
    bot.fillCircle(14, 14, 13);
    bot.lineStyle(2, 0xffffff, 0.8);
    bot.strokeCircle(14, 14, 13);
    bot.generateTexture('ally_bot', 28, 28);
    bot.destroy();
  }

  private generateMiscTextures() {
    const diamond = this.add.graphics();
    diamond.fillStyle(0xffffff, 1);
    diamond.beginPath();
    diamond.moveTo(10, 0);
    diamond.lineTo(20, 10);
    diamond.lineTo(10, 20);
    diamond.lineTo(0, 10);
    diamond.closePath();
    diamond.fillPath();
    diamond.lineStyle(2, 0x000000, 0.4);
    diamond.strokePath();
    diamond.generateTexture('pickup_diamond', 20, 20);
    diamond.destroy();

    const floor = this.add.graphics();
    floor.fillStyle(0x1c1f26, 1);
    floor.fillRect(0, 0, 64, 64);
    floor.lineStyle(1, 0x2a2e38, 1);
    floor.strokeRect(0, 0, 64, 64);
    floor.generateTexture('floor_tile', 64, 64);
    floor.destroy();

    const wall = this.add.graphics();
    wall.fillStyle(0x3a3f4b, 1);
    wall.fillRect(0, 0, 32, 32);
    wall.lineStyle(1, 0x50566655, 1);
    wall.strokeRect(0, 0, 32, 32);
    wall.generateTexture('wall_tile', 32, 32);
    wall.destroy();

    const explosion = this.add.graphics();
    explosion.fillStyle(0xffa726, 0.8);
    explosion.fillCircle(24, 24, 24);
    explosion.generateTexture('explosion_fx', 48, 48);
    explosion.destroy();
  }
}
