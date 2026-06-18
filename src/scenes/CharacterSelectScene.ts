import Phaser from 'phaser';
import { CHARACTERS } from '../game/characters/characters';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelect');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0b0c10');

    this.add
      .text(width / 2, 40, 'VAULT RUNNERS', { fontSize: '28px', color: '#ff9f1a', fontStyle: 'bold' })
      .setOrigin(0.5);
    this.add
      .text(width / 2, 70, 'Choose your Vault Runner', { fontSize: '14px', color: '#cccccc' })
      .setOrigin(0.5);

    const cols = width < 700 ? 2 : 3;
    const cardW = Math.min(220, width / cols - 20);
    const cardH = 200;
    const startY = 110;
    const gapX = width / cols;

    CHARACTERS.forEach((c, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = gapX * col + gapX / 2;
      const cy = startY + row * (cardH + 20) + cardH / 2;

      const card = this.add.rectangle(cx, cy, cardW, cardH, 0x1c1f26, 1).setStrokeStyle(2, c.color, 1);
      card.setInteractive({ useHandCursor: true });

      this.add.image(cx, cy - 55, `player_${c.id}`).setScale(1.4);
      this.add.text(cx, cy - 10, c.name, { fontSize: '18px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
      this.add.text(cx, cy + 10, c.title, { fontSize: '12px', color: '#ff9f1a' }).setOrigin(0.5);
      this.add
        .text(cx, cy + 32, c.tagline, { fontSize: '10px', color: '#aaaaaa', align: 'center', wordWrap: { width: cardW - 16 } })
        .setOrigin(0.5);
      this.add
        .text(cx, cy + 68, `Action Skill: ${c.actionSkill.name}`, {
          fontSize: '10px',
          color: '#7fdbff',
          align: 'center',
          wordWrap: { width: cardW - 16 },
        })
        .setOrigin(0.5);

      card.on('pointerover', () => card.setFillStyle(0x2a2e38, 1));
      card.on('pointerout', () => card.setFillStyle(0x1c1f26, 1));
      card.on('pointerdown', () => this.startGame(c.id));
    });

    this.add
      .text(width / 2, height - 22, 'Tap a character to begin', { fontSize: '12px', color: '#777777' })
      .setOrigin(0.5);
  }

  private startGame(characterId: string) {
    this.scene.start('Game', { characterId });
  }
}
