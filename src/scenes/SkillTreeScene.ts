import Phaser from 'phaser';
import type { PlayerEntity } from '../game/entities/PlayerEntity';
import type { Branch, SkillNode } from '../game/characters/types';

const BRANCHES: Branch[] = ['branch1', 'branch2', 'branch3'];

export class SkillTreeScene extends Phaser.Scene {
  player!: PlayerEntity;
  pointsText!: Phaser.GameObjects.Text;
  nodeTexts: Map<string, Phaser.GameObjects.Text> = new Map();

  constructor() {
    super('SkillTree');
  }

  init(data: { player: PlayerEntity }) {
    this.player = data.player;
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width - 30, height - 30, 0x14161c, 0.97).setStrokeStyle(2, 0xffffff, 0.3);

    this.add.text(30, 20, `${this.player.character.name} — Skill Tree`, { fontSize: '18px', color: '#ffffff', fontStyle: 'bold' });
    this.pointsText = this.add.text(width - 260, 20, '', { fontSize: '14px', color: '#ffd54f' });

    const closeBtn = this.add.text(width - 20, 22, '[X]', { fontSize: '16px', color: '#ff5252' }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.close());

    const colWidth = (width - 60) / 3;
    BRANCHES.forEach((branch, colIdx) => {
      const cx = 30 + colWidth * colIdx + colWidth / 2;
      this.add
        .text(cx, 48, this.player.character.branchNames[branch], { fontSize: '14px', color: '#7fdbff', fontStyle: 'bold' })
        .setOrigin(0.5);

      [1, 2, 3].forEach((tier) => {
        const node = this.player.character.skillTree.find((n) => n.branch === branch && n.tier === tier)!;
        const ny = 105 + (tier - 1) * 100;
        this.renderNode(node, cx, ny, colWidth - 20);
      });
    });

    this.refreshTexts();
  }

  private renderNode(node: SkillNode, cx: number, cy: number, w: number) {
    const box = this.add.rectangle(cx, cy, w, 78, 0x1f2330, 0.95).setStrokeStyle(1, 0x444c5e, 1);
    box.setInteractive({ useHandCursor: true });

    this.add.text(cx, cy - 28, node.name, { fontSize: '12px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add
      .text(cx, cy - 12, node.description, { fontSize: '9px', color: '#9aa0ad', align: 'center', wordWrap: { width: w - 12 } })
      .setOrigin(0.5);

    const pointsLabel = this.add.text(cx, cy + 14, '', { fontSize: '11px', color: '#ffd54f' }).setOrigin(0.5);
    this.nodeTexts.set(node.id, pointsLabel);

    const plusBtn = this.add.text(cx + w / 2 - 16, cy + 30, '[+]', { fontSize: '12px', color: '#66bb6a' }).setInteractive({ useHandCursor: true });
    const minusBtn = this.add.text(cx - w / 2 + 16, cy + 30, '[-]', { fontSize: '12px', color: '#ff5252' }).setInteractive({ useHandCursor: true });

    plusBtn.on('pointerdown', () => {
      if (this.player.skillTree.allocate(node.id)) {
        this.player.recomputeStats();
        this.refreshTexts();
      }
    });
    minusBtn.on('pointerdown', () => {
      if (this.player.skillTree.deallocate(node.id)) {
        this.player.recomputeStats();
        this.refreshTexts();
      }
    });
  }

  private refreshTexts() {
    this.pointsText.setText(`Available Points: ${this.player.skillTree.availablePoints}`);
    this.player.character.skillTree.forEach((node) => {
      const text = this.nodeTexts.get(node.id);
      if (!text) return;
      const points = this.player.skillTree.pointsIn(node.id);
      const locked = !this.player.skillTree.canAllocate(node) && points === 0 && node.tier > 1;
      text.setText(`${points}/${node.maxPoints}${locked ? ' (locked)' : ''}`);
      text.setColor(locked ? '#666666' : '#ffd54f');
    });
  }

  private close() {
    this.scene.stop();
    this.scene.resume('Game');
  }
}
