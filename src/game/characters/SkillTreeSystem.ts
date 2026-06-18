import type { Branch, CharacterDefinition, SkillNode, StatKey } from './types';

export class SkillTreeState {
  readonly character: CharacterDefinition;
  private pointsSpent: Map<string, number> = new Map();
  availablePoints: number;

  constructor(character: CharacterDefinition, startingPoints = 0) {
    this.character = character;
    this.availablePoints = startingPoints;
    character.skillTree.forEach((node) => this.pointsSpent.set(node.id, 0));
  }

  grantPoints(amount: number) {
    this.availablePoints += amount;
  }

  pointsIn(nodeId: string): number {
    return this.pointsSpent.get(nodeId) ?? 0;
  }

  pointsInBranchTier(branch: Branch, tier: 1 | 2 | 3): number {
    const node = this.character.skillTree.find((n) => n.branch === branch && n.tier === tier);
    return node ? this.pointsIn(node.id) : 0;
  }

  canAllocate(node: SkillNode): boolean {
    if (this.availablePoints <= 0) return false;
    if (this.pointsIn(node.id) >= node.maxPoints) return false;
    if (node.tier === 1) return true;
    const prevTier = (node.tier - 1) as 1 | 2;
    return this.pointsInBranchTier(node.branch, prevTier) >= node.unlockRequirement;
  }

  allocate(nodeId: string): boolean {
    const node = this.character.skillTree.find((n) => n.id === nodeId);
    if (!node || !this.canAllocate(node)) return false;
    this.pointsSpent.set(nodeId, this.pointsIn(nodeId) + 1);
    this.availablePoints -= 1;
    return true;
  }

  deallocate(nodeId: string): boolean {
    const node = this.character.skillTree.find((n) => n.id === nodeId);
    if (!node) return false;
    const current = this.pointsIn(nodeId);
    if (current <= 0) return false;
    // prevent breaking downstream unlock requirements
    const dependentNext = this.character.skillTree.find(
      (n) => n.branch === node.branch && n.tier === node.tier + 1,
    );
    if (dependentNext && this.pointsIn(dependentNext.id) > 0 && current - 1 < dependentNext.unlockRequirement) {
      return false;
    }
    this.pointsSpent.set(nodeId, current - 1);
    this.availablePoints += 1;
    return true;
  }

  totalPointsSpent(): number {
    let total = 0;
    this.pointsSpent.forEach((v) => (total += v));
    return total;
  }

  computeStatBonuses(): Partial<Record<StatKey, number>> {
    const bonuses: Partial<Record<StatKey, number>> = {};
    this.character.skillTree.forEach((node) => {
      const points = this.pointsIn(node.id);
      if (points <= 0) return;
      bonuses[node.statKey] = (bonuses[node.statKey] ?? 0) + points * node.amountPerPoint;
    });
    return bonuses;
  }

  reset() {
    this.character.skillTree.forEach((node) => {
      this.availablePoints += this.pointsIn(node.id);
      this.pointsSpent.set(node.id, 0);
    });
  }
}
