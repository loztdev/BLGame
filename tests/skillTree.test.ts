import { describe, expect, it } from 'vitest';
import { SkillTreeState } from '../src/game/characters/SkillTreeSystem';
import { CHARACTERS, getCharacter } from '../src/game/characters/characters';

describe('SkillTreeSystem', () => {
  it('all 6 characters have a complete 3-branch, 3-tier tree', () => {
    expect(CHARACTERS.length).toBe(6);
    CHARACTERS.forEach((c) => {
      expect(c.skillTree.length).toBe(9);
      ['branch1', 'branch2', 'branch3'].forEach((branch) => {
        [1, 2, 3].forEach((tier) => {
          const node = c.skillTree.find((n) => n.branch === branch && n.tier === tier);
          expect(node).toBeDefined();
        });
      });
    });
  });

  it('allocates points to tier 1 freely up to max', () => {
    const state = new SkillTreeState(getCharacter('rook'), 10);
    for (let i = 0; i < 5; i++) {
      expect(state.allocate('branch1_t1')).toBe(true);
    }
    expect(state.allocate('branch1_t1')).toBe(false); // maxed out
    expect(state.pointsIn('branch1_t1')).toBe(5);
  });

  it('blocks tier 2 until unlock requirement is met', () => {
    const state = new SkillTreeState(getCharacter('rook'), 10);
    expect(state.allocate('branch1_t2')).toBe(false);
    state.allocate('branch1_t1');
    state.allocate('branch1_t1');
    expect(state.allocate('branch1_t2')).toBe(false); // only 2 points, need 3
    state.allocate('branch1_t1');
    expect(state.allocate('branch1_t2')).toBe(true);
  });

  it('blocks the capstone until tier 2 requirement is met', () => {
    const state = new SkillTreeState(getCharacter('rook'), 20);
    for (let i = 0; i < 3; i++) state.allocate('branch1_t1');
    expect(state.allocate('branch1_t3')).toBe(false);
    for (let i = 0; i < 3; i++) state.allocate('branch1_t2');
    expect(state.allocate('branch1_t3')).toBe(true);
    expect(state.allocate('branch1_t3')).toBe(false); // capstone maxPoints = 1
  });

  it('will not allocate beyond available points', () => {
    const state = new SkillTreeState(getCharacter('nyx'), 1);
    expect(state.allocate('branch2_t1')).toBe(true);
    expect(state.allocate('branch2_t1')).toBe(false);
  });

  it('computes stat bonuses proportional to points spent', () => {
    const state = new SkillTreeState(getCharacter('vex'), 5);
    state.allocate('branch2_t1');
    state.allocate('branch2_t1');
    const bonuses = state.computeStatBonuses();
    expect(bonuses.critDamagePct).toBe(12); // 2 points * 6 per point
  });

  it('deallocate refunds a point and re-locks dependents appropriately', () => {
    const state = new SkillTreeState(getCharacter('rook'), 20);
    for (let i = 0; i < 3; i++) state.allocate('branch1_t1');
    state.allocate('branch1_t2');
    expect(state.deallocate('branch1_t1')).toBe(false); // would break tier2 unlock
    expect(state.deallocate('branch1_t2')).toBe(true);
    expect(state.deallocate('branch1_t1')).toBe(true);
  });
});
