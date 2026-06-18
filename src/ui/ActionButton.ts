import Phaser from 'phaser';

export class ActionButton {
  circle: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;
  cooldownOverlay: Phaser.GameObjects.Arc;
  isDown = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    text: string,
    color: number,
    onDown?: () => void,
    onUp?: () => void,
  ) {
    this.circle = scene.add.circle(x, y, radius, color, 0.55).setScrollFactor(0).setDepth(1000);
    this.circle.setStrokeStyle(2, 0xffffff, 0.6);
    this.circle.setInteractive({ useHandCursor: true });
    this.cooldownOverlay = scene.add.circle(x, y, radius, 0x000000, 0.55).setScrollFactor(0).setDepth(1001);
    this.cooldownOverlay.setVisible(false);
    this.label = scene.add
      .text(x, y, text, { fontSize: '12px', color: '#ffffff', align: 'center', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1002);

    this.circle.on('pointerdown', () => {
      this.isDown = true;
      onDown?.();
    });
    this.circle.on('pointerup', () => {
      this.isDown = false;
      onUp?.();
    });
    this.circle.on('pointerout', () => {
      if (this.isDown) {
        this.isDown = false;
        onUp?.();
      }
    });
  }

  setCooldownFraction(fraction: number) {
    // fraction 1 = fully on cooldown, 0 = ready
    this.cooldownOverlay.setVisible(fraction > 0.001);
    this.cooldownOverlay.setScale(fraction);
  }

  setEnabled(enabled: boolean) {
    this.circle.setAlpha(enabled ? 1 : 0.4);
  }

  destroy() {
    this.circle.destroy();
    this.cooldownOverlay.destroy();
    this.label.destroy();
  }
}
