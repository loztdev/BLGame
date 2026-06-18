import Phaser from 'phaser';

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private baseRadius = 55;
  private knobRadius = 26;
  private base: Phaser.GameObjects.Arc;
  private knob: Phaser.GameObjects.Arc;
  private pointerId: number | null = null;
  private originX = 0;
  private originY = 0;

  vector = new Phaser.Math.Vector2(0, 0);

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.originX = x;
    this.originY = y;
    this.base = scene.add.circle(x, y, this.baseRadius, 0xffffff, 0.12).setScrollFactor(0).setDepth(1000);
    this.knob = scene.add.circle(x, y, this.knobRadius, 0xffffff, 0.35).setScrollFactor(0).setDepth(1001);
    this.base.setStrokeStyle(2, 0xffffff, 0.3);

    scene.input.on('pointerdown', this.handleDown, this);
    scene.input.on('pointermove', this.handleMove, this);
    scene.input.on('pointerup', this.handleUp, this);
    scene.input.on('pointerupoutside', this.handleUp, this);
  }

  private isInZone(px: number, py: number): boolean {
    const dist = Phaser.Math.Distance.Between(px, py, this.originX, this.originY);
    return dist <= this.baseRadius * 2.2;
  }

  private handleDown(pointer: Phaser.Input.Pointer) {
    if (this.pointerId !== null) return;
    if (!this.isInZone(pointer.x, pointer.y)) return;
    this.pointerId = pointer.id;
    this.updateKnob(pointer.x, pointer.y);
  }

  private handleMove(pointer: Phaser.Input.Pointer) {
    if (this.pointerId !== pointer.id) return;
    this.updateKnob(pointer.x, pointer.y);
  }

  private handleUp(pointer: Phaser.Input.Pointer) {
    if (this.pointerId !== pointer.id) return;
    this.pointerId = null;
    this.vector.set(0, 0);
    this.knob.setPosition(this.originX, this.originY);
  }

  private updateKnob(px: number, py: number) {
    const dx = px - this.originX;
    const dy = py - this.originY;
    const dist = Math.min(this.baseRadius, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const kx = this.originX + Math.cos(angle) * dist;
    const ky = this.originY + Math.sin(angle) * dist;
    this.knob.setPosition(kx, ky);
    this.vector.set(Math.cos(angle) * (dist / this.baseRadius), Math.sin(angle) * (dist / this.baseRadius));
  }

  destroy() {
    this.scene.input.off('pointerdown', this.handleDown, this);
    this.scene.input.off('pointermove', this.handleMove, this);
    this.scene.input.off('pointerup', this.handleUp, this);
    this.scene.input.off('pointerupoutside', this.handleUp, this);
    this.base.destroy();
    this.knob.destroy();
  }
}
