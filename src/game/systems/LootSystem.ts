import { ItemGenerator } from '../items/ItemGenerator';
import type { GeneratedItem } from '../items/types';
import { createRng, rngBool, rngPick } from '../items/rng';

export type LootKind = 'gun' | 'shield' | 'classmod' | 'artifact' | 'grenade';

const LOOT_KINDS: LootKind[] = ['gun', 'shield', 'classmod', 'artifact', 'grenade'];

export class LootSystem {
  private generator: ItemGenerator;
  private seed: number;

  constructor(generator: ItemGenerator, seed?: number) {
    this.generator = generator;
    this.seed = seed ?? (Date.now() & 0xffffffff);
  }

  rollDrops(enemyLevel: number, characterId: string, dropChance = 0.45, maxDrops = 2): GeneratedItem[] {
    this.seed = (this.seed + 1013904223) >>> 0;
    const rng = createRng(this.seed);
    const drops: GeneratedItem[] = [];
    for (let i = 0; i < maxDrops; i++) {
      if (!rngBool(rng, dropChance / (i + 1))) continue;
      const kind = rngPick(rng, LOOT_KINDS);
      drops.push(this.generateKind(kind, enemyLevel, characterId));
    }
    return drops;
  }

  generateKind(kind: LootKind, level: number, characterId: string): GeneratedItem {
    switch (kind) {
      case 'gun':
        return this.generator.generateGun({ level });
      case 'shield':
        return this.generator.generateShield({ level });
      case 'grenade':
        return this.generator.generateGrenade({ level });
      case 'artifact':
        return this.generator.generateArtifact({ level });
      case 'classmod':
        return this.generator.generateClassMod({ level }, characterId);
    }
  }
}
