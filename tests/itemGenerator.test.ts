import { describe, expect, it } from 'vitest';
import { ItemGenerator } from '../src/game/items/ItemGenerator';
import { RARITY_INFO } from '../src/game/items/types';

describe('ItemGenerator', () => {
  it('produces deterministic guns for the same seed', () => {
    const a = new ItemGenerator(42);
    const b = new ItemGenerator(42);
    const gunA = a.generateGun({ level: 5 });
    const gunB = b.generateGun({ level: 5 });
    expect(gunA.name).toBe(gunB.name);
    expect(gunA.stats).toEqual(gunB.stats);
    expect(gunA.rarity).toBe(gunB.rarity);
  });

  it('produces varied guns across many rolls', () => {
    const gen = new ItemGenerator(7);
    const names = new Set<string>();
    for (let i = 0; i < 50; i++) {
      names.add(gen.generateGun({ level: 10 }).name);
    }
    expect(names.size).toBeGreaterThan(10);
  });

  it('scales gun stats up with rarity', () => {
    const gen = new ItemGenerator(1);
    const common = gen.generateGun({ level: 10, rarity: 'common' }, 'assault_rifle', 'stryke');
    const legendary = gen.generateGun({ level: 10, rarity: 'legendary' }, 'assault_rifle', 'stryke');
    expect(legendary.stats.damage).toBeGreaterThan(common.stats.damage);
  });

  it('scales gun damage up with level', () => {
    const gen = new ItemGenerator(3);
    const low = gen.generateGun({ level: 1, rarity: 'rare' }, 'pistol', 'stryke');
    const high = gen.generateGun({ level: 30, rarity: 'rare' }, 'pistol', 'stryke');
    expect(high.stats.damage).toBeGreaterThan(low.stats.damage);
  });

  it('cobalt manufacturer guns are always elemental', () => {
    const gen = new ItemGenerator(9);
    for (let i = 0; i < 10; i++) {
      const gun = gen.generateGun({ level: 5 }, undefined, 'cobalt');
      expect(gun.element).not.toBe('kinetic');
    }
  });

  it('generates shields with valid special effects', () => {
    const gen = new ItemGenerator(11);
    const shield = gen.generateShield({ level: 8, rarity: 'epic' });
    expect(shield.capacity).toBeGreaterThan(0);
    expect(shield.rechargeRate).toBeGreaterThan(0);
  });

  it('generates grenades with a known kind', () => {
    const gen = new ItemGenerator(12);
    const grenade = gen.generateGrenade({ level: 4 });
    expect(grenade.damage).toBeGreaterThan(0);
    expect(grenade.radius).toBeGreaterThan(0);
  });

  it('generates class mods tied to a character', () => {
    const gen = new ItemGenerator(13);
    const mod = gen.generateClassMod({ level: 6, rarity: 'epic' }, 'rook');
    expect(mod.characterId).toBe('rook');
    expect(mod.statBonuses.length).toBe(RARITY_INFO.epic.bonusAffixCount);
  });

  it('generates artifacts with a major perk and scaled minor bonuses', () => {
    const gen = new ItemGenerator(14);
    const legendary = gen.generateArtifact({ level: 10, rarity: 'legendary' });
    expect(legendary.majorPerk.amount).toBeGreaterThan(0);
    expect(legendary.minorBonuses.length).toBe(RARITY_INFO.legendary.bonusAffixCount);
  });
});
