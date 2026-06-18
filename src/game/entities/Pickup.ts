import Phaser from 'phaser';
import type { GeneratedItem } from '../items/types';
import { RARITY_INFO } from '../items/types';

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  item: GeneratedItem;
  label: Phaser.GameObjects.Text;
  bobTime = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, item: GeneratedItem) {
    super(scene, x, y, 'pickup_diamond');
    this.item = item;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setTint(RARITY_INFO[item.rarity].color);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.label = scene.add.text(x, y - 22, item.name, {
      fontSize: '11px',
      color: '#ffffff',
      backgroundColor: '#00000080',
      padding: { x: 3, y: 1 },
    });
    this.label.setOrigin(0.5, 1);
  }

  update(_time: number, deltaMs: number) {
    this.bobTime += deltaMs / 1000;
    this.y += Math.sin(this.bobTime * 3) * 0.15;
    this.label.setPosition(this.x, this.y - 22);
  }

  destroyWithLabel() {
    this.label.destroy();
    this.destroy();
  }
}
