import type {
  GeneratedArtifact,
  GeneratedClassMod,
  GeneratedGrenade,
  GeneratedGun,
  GeneratedItem,
  GeneratedShield,
} from '../items/types';
import { mergeStatBonuses, type StatBonusMap } from './StatsSystem';

const MAX_GUN_SLOTS = 4;
const MAX_BACKPACK = 24;

export interface EquippedLoadout {
  guns: (GeneratedGun | null)[];
  activeGunIndex: number;
  shield: GeneratedShield | null;
  classMod: GeneratedClassMod | null;
  artifact: GeneratedArtifact | null;
  grenadeMod: GeneratedGrenade | null;
}

export class InventorySystem {
  backpack: GeneratedItem[] = [];
  equipped: EquippedLoadout = {
    guns: new Array(MAX_GUN_SLOTS).fill(null),
    activeGunIndex: 0,
    shield: null,
    classMod: null,
    artifact: null,
    grenadeMod: null,
  };

  addToBackpack(item: GeneratedItem): boolean {
    if (this.backpack.length >= MAX_BACKPACK) return false;
    this.backpack.push(item);
    return true;
  }

  removeFromBackpack(itemId: string): GeneratedItem | null {
    const idx = this.backpack.findIndex((i) => i.id === itemId);
    if (idx === -1) return null;
    return this.backpack.splice(idx, 1)[0];
  }

  get activeGun(): GeneratedGun | null {
    return this.equipped.guns[this.equipped.activeGunIndex] ?? null;
  }

  cycleActiveGun(direction: 1 | -1) {
    const slots = this.equipped.guns;
    for (let i = 1; i <= slots.length; i++) {
      const idx = (this.equipped.activeGunIndex + direction * i + slots.length * 10) % slots.length;
      if (slots[idx]) {
        this.equipped.activeGunIndex = idx;
        return;
      }
    }
  }

  equipItem(item: GeneratedItem, slot?: number): GeneratedItem | null {
    let displaced: GeneratedItem | null = null;
    if (item.itemType === 'gun') {
      const targetSlot = slot ?? this.findFreeGunSlot();
      displaced = this.equipped.guns[targetSlot];
      this.equipped.guns[targetSlot] = item;
      this.equipped.activeGunIndex = targetSlot;
    } else if (item.itemType === 'shield') {
      displaced = this.equipped.shield;
      this.equipped.shield = item;
    } else if (item.itemType === 'classmod') {
      displaced = this.equipped.classMod;
      this.equipped.classMod = item;
    } else if (item.itemType === 'artifact') {
      displaced = this.equipped.artifact;
      this.equipped.artifact = item;
    } else if (item.itemType === 'grenade') {
      displaced = this.equipped.grenadeMod;
      this.equipped.grenadeMod = item;
    }
    this.removeFromBackpack(item.id);
    if (displaced) this.addToBackpack(displaced);
    return displaced;
  }

  unequipItem(item: GeneratedItem): boolean {
    let found = false;
    if (item.itemType === 'gun') {
      const idx = this.equipped.guns.findIndex((g) => g?.id === item.id);
      if (idx !== -1) {
        this.equipped.guns[idx] = null;
        found = true;
      }
    } else if (item.itemType === 'shield' && this.equipped.shield?.id === item.id) {
      this.equipped.shield = null;
      found = true;
    } else if (item.itemType === 'classmod' && this.equipped.classMod?.id === item.id) {
      this.equipped.classMod = null;
      found = true;
    } else if (item.itemType === 'artifact' && this.equipped.artifact?.id === item.id) {
      this.equipped.artifact = null;
      found = true;
    } else if (item.itemType === 'grenade' && this.equipped.grenadeMod?.id === item.id) {
      this.equipped.grenadeMod = null;
      found = true;
    }
    if (found) this.addToBackpack(item);
    return found;
  }

  private findFreeGunSlot(): number {
    const idx = this.equipped.guns.findIndex((g) => g === null);
    return idx === -1 ? this.equipped.activeGunIndex : idx;
  }

  computeEquipmentStatBonuses(characterId: string): StatBonusMap {
    const maps: StatBonusMap[] = [];
    if (this.equipped.artifact) {
      const a = this.equipped.artifact;
      maps.push({ [a.majorPerk.stat as keyof StatBonusMap]: a.majorPerk.amount });
      a.minorBonuses.forEach((b) => maps.push({ [b.stat as keyof StatBonusMap]: b.amount }));
    }
    if (this.equipped.classMod && this.equipped.classMod.characterId === characterId) {
      this.equipped.classMod.statBonuses.forEach((b) => maps.push({ [b.stat as keyof StatBonusMap]: b.amount }));
    }
    return mergeStatBonuses(...maps);
  }
}
