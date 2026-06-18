import { describe, expect, it } from 'vitest';
import { InventorySystem } from '../src/game/systems/InventorySystem';
import { ItemGenerator } from '../src/game/items/ItemGenerator';

describe('InventorySystem', () => {
  it('equips a gun into the first free slot', () => {
    const inv = new InventorySystem();
    const gen = new ItemGenerator(1);
    const gun = gen.generateGun({ level: 1 });
    inv.addToBackpack(gun);
    inv.equipItem(gun);
    expect(inv.activeGun?.id).toBe(gun.id);
  });

  it('displaces an existing gun into the backpack when re-equipping a slot', () => {
    const inv = new InventorySystem();
    const gen = new ItemGenerator(2);
    const gunA = gen.generateGun({ level: 1 });
    const gunB = gen.generateGun({ level: 1 });
    inv.equipItem(gunA, 0);
    inv.equipItem(gunB, 0);
    expect(inv.activeGun?.id).toBe(gunB.id);
    expect(inv.backpack.some((i) => i.id === gunA.id)).toBe(true);
  });

  it('only applies class mod bonuses for the matching character', () => {
    const inv = new InventorySystem();
    const gen = new ItemGenerator(3);
    const mod = gen.generateClassMod({ level: 5, rarity: 'rare' }, 'rook');
    inv.equipItem(mod);
    const bonusesForRook = inv.computeEquipmentStatBonuses('rook');
    const bonusesForNyx = inv.computeEquipmentStatBonuses('nyx');
    expect(Object.keys(bonusesForRook).length).toBeGreaterThan(0);
    expect(Object.keys(bonusesForNyx).length).toBe(0);
  });

  it('cycles to the next equipped gun skipping empty slots', () => {
    const inv = new InventorySystem();
    const gen = new ItemGenerator(4);
    inv.equipItem(gen.generateGun({ level: 1 }), 0);
    inv.equipItem(gen.generateGun({ level: 1 }), 2);
    inv.equipped.activeGunIndex = 0;
    inv.cycleActiveGun(1);
    expect(inv.equipped.activeGunIndex).toBe(2);
  });
});
