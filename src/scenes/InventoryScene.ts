import Phaser from 'phaser';
import type { PlayerEntity } from '../game/entities/PlayerEntity';
import { RARITY_INFO, type GeneratedItem } from '../game/items/types';

function itemSummary(item: GeneratedItem): string {
  switch (item.itemType) {
    case 'gun':
      return `${item.gunType}  DMG ${Math.round(item.stats.damage)}  FR ${item.stats.fireRate.toFixed(1)}  MAG ${item.stats.magazineSize}  ${item.element}`;
    case 'shield':
      return `CAP ${item.capacity}  RECH ${item.rechargeRate}  ${item.specialEffect}`;
    case 'grenade':
      return `${item.grenadeKind}  DMG ${item.damage}  RAD ${item.radius}  ${item.element}`;
    case 'classmod':
      return item.statBonuses.map((b) => `+${b.amount} ${b.label}`).join(', ');
    case 'artifact': {
      const minor = item.minorBonuses.map((b) => `+${b.amount} ${b.label}`).join(', ');
      return `+${item.majorPerk.amount} ${item.majorPerk.label}${minor ? '; ' + minor : ''}`;
    }
  }
}

export class InventoryScene extends Phaser.Scene {
  player!: PlayerEntity;
  container!: Phaser.GameObjects.Container;
  scrollY = 0;
  contentHeight = 0;
  viewportHeight = 0;
  viewportTop = 0;

  constructor() {
    super('Inventory');
  }

  init(data: { player: PlayerEntity }) {
    this.player = data.player;
  }

  create() {
    const { width, height } = this.scale;
    const panel = this.add.rectangle(width / 2, height / 2, width - 30, height - 30, 0x14161c, 0.97).setStrokeStyle(2, 0xffffff, 0.3);
    panel.setScrollFactor(0);

    this.add.text(30, 28, 'INVENTORY', { fontSize: '20px', color: '#ffffff', fontStyle: 'bold' }).setScrollFactor(0);
    const closeBtn = this.add
      .text(width - 20, 28, '[ CLOSE ]', { fontSize: '14px', color: '#ff5252' })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.close());

    this.viewportTop = 70;
    this.viewportHeight = height - 110;
    this.container = this.add.container(0, this.viewportTop);

    this.renderEquipped();
    this.renderBackpack();

    const mask = this.add.graphics().fillStyle(0xffffff).fillRect(15, this.viewportTop, width - 30, this.viewportHeight);
    this.container.setMask(mask.createGeometryMask());
    mask.setVisible(false);

    this.input.on('wheel', (_p: unknown, _o: unknown, _dx: number, dy: number) => {
      this.scrollY = Phaser.Math.Clamp(this.scrollY + dy, 0, Math.max(0, this.contentHeight - this.viewportHeight));
      this.container.y = this.viewportTop - this.scrollY;
    });

    let dragStartY = 0;
    let dragStartScroll = 0;
    let dragging = false;
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.y < this.viewportTop) return;
      dragging = true;
      dragStartY = p.y;
      dragStartScroll = this.scrollY;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!dragging) return;
      const delta = dragStartY - p.y;
      this.scrollY = Phaser.Math.Clamp(dragStartScroll + delta, 0, Math.max(0, this.contentHeight - this.viewportHeight));
      this.container.y = this.viewportTop - this.scrollY;
    });
    this.input.on('pointerup', () => (dragging = false));
  }

  private renderEquipped() {
    const width = this.scale.width;
    let y = 0;
    this.container.add(this.makeRowText(20, y, 'EQUIPPED', '#ffd54f', 14));
    y += 22;

    const eq = this.player.inventory.equipped;
    eq.guns.forEach((gun, i) => {
      if (!gun) return;
      this.container.add(this.makeItemRow(20, y, width - 40, gun, true, i));
      y += 36;
    });
    [eq.shield, eq.classMod, eq.artifact, eq.grenadeMod].forEach((item) => {
      if (!item) return;
      this.container.add(this.makeItemRow(20, y, width - 40, item, true));
      y += 36;
    });

    y += 14;
    this.container.add(this.makeRowText(20, y, `BACKPACK (${this.player.inventory.backpack.length}/24)`, '#7fdbff', 14));
    y += 22;
    this.backpackStartY = y;
  }

  private backpackStartY = 0;

  private renderBackpack() {
    const width = this.scale.width;
    let y = this.backpackStartY;
    this.player.inventory.backpack.forEach((item) => {
      this.container.add(this.makeItemRow(20, y, width - 40, item, false));
      y += 36;
    });
    this.contentHeight = y + 20;
  }

  private makeRowText(x: number, y: number, text: string, color: string, size: number) {
    return this.add.text(x, y, text, { fontSize: `${size}px`, color, fontStyle: 'bold' });
  }

  private makeItemRow(x: number, y: number, w: number, item: GeneratedItem, equipped: boolean, slotIndex?: number) {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, w, 32, 0x222631, 0.9).setOrigin(0, 0).setStrokeStyle(1, RARITY_INFO[item.rarity].color, 1);
    bg.setInteractive({ useHandCursor: true });
    const title = this.add.text(8, 4, `${item.name}${equipped ? ' (equipped)' : ''}`, {
      fontSize: '12px',
      color: `#${RARITY_INFO[item.rarity].color.toString(16).padStart(6, '0')}`,
    });
    const detail = this.add.text(8, 18, itemSummary(item), { fontSize: '9px', color: '#aaaaaa' });
    c.add([bg, title, detail]);

    bg.on('pointerdown', () => {
      if (equipped) {
        this.player.inventory.unequipItem(item);
      } else {
        this.player.inventory.equipItem(item, item.itemType === 'gun' ? slotIndex : undefined);
        if (item.itemType === 'gun' && this.player.inventory.activeGun?.id === item.id) {
          this.player.onEquipActiveGunChanged();
        }
      }
      this.player.recomputeStats();
      this.refresh();
    });
    return c;
  }

  private refresh() {
    this.container.removeAll(true);
    this.renderEquipped();
    this.renderBackpack();
  }

  private close() {
    this.scene.stop();
    this.scene.resume('Game');
  }
}
