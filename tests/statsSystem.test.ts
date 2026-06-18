import { describe, expect, it } from 'vitest';
import { computeFinalStats, mergeStatBonuses } from '../src/game/systems/StatsSystem';
import { getCharacter } from '../src/game/characters/characters';

describe('StatsSystem', () => {
  it('returns base stats with no bonuses', () => {
    const rook = getCharacter('rook');
    const stats = computeFinalStats(rook, {});
    expect(stats.maxHealth).toBe(rook.baseHealth);
    expect(stats.moveSpeed).toBe(rook.baseMoveSpeed);
    expect(stats.gunDamageMult).toBe(rook.baseGunDamageMult);
    expect(stats.damageReductionPct).toBe(0);
  });

  it('applies percentage bonuses multiplicatively on top of base', () => {
    const rook = getCharacter('rook');
    const stats = computeFinalStats(rook, { maxHealthPct: 20, gunDamagePct: 10 });
    expect(stats.maxHealth).toBeCloseTo(rook.baseHealth * 1.2);
    expect(stats.gunDamageMult).toBeCloseTo(rook.baseGunDamageMult * 1.1);
  });

  it('clamps damage reduction at 75%', () => {
    const rook = getCharacter('rook');
    const stats = computeFinalStats(rook, { damageReductionPct: 999 });
    expect(stats.damageReductionPct).toBe(0.75);
  });

  it('merges multiple stat bonus maps additively', () => {
    const merged = mergeStatBonuses({ gunDamagePct: 5 }, { gunDamagePct: 10, moveSpeedPct: 3 });
    expect(merged.gunDamagePct).toBe(15);
    expect(merged.moveSpeedPct).toBe(3);
  });
});
