export type EnemyKind = 'grunt' | 'shooter' | 'brute';

export interface EnemyTypeDef {
  kind: EnemyKind;
  label: string;
  baseHealth: number;
  baseSpeed: number;
  baseContactDamage: number;
  baseXp: number;
  attackRange: number;
  isRanged: boolean;
  projectileDamage: number;
  projectileSpeed: number;
  attackCooldown: number;
  color: number;
  radius: number;
}

export const ENEMY_TYPES: Record<EnemyKind, EnemyTypeDef> = {
  grunt: {
    kind: 'grunt',
    label: 'Bandit Grunt',
    baseHealth: 40,
    baseSpeed: 110,
    baseContactDamage: 8,
    baseXp: 12,
    attackRange: 36,
    isRanged: false,
    projectileDamage: 0,
    projectileSpeed: 0,
    attackCooldown: 0.8,
    color: 0xb5651d,
    radius: 16,
  },
  shooter: {
    kind: 'shooter',
    label: 'Raider Shooter',
    baseHealth: 30,
    baseSpeed: 90,
    baseContactDamage: 4,
    baseXp: 16,
    attackRange: 320,
    isRanged: true,
    projectileDamage: 9,
    projectileSpeed: 420,
    attackCooldown: 1.4,
    color: 0x4d7ea8,
    radius: 14,
  },
  brute: {
    kind: 'brute',
    label: 'Psycho Brute',
    baseHealth: 130,
    baseSpeed: 70,
    baseContactDamage: 18,
    baseXp: 30,
    attackRange: 44,
    isRanged: false,
    projectileDamage: 0,
    projectileSpeed: 0,
    attackCooldown: 1.0,
    color: 0x7a1f1f,
    radius: 22,
  },
};

export function levelScaledHealth(base: number, level: number): number {
  return Math.round(base * (1 + (level - 1) * 0.18));
}

export function levelScaledDamage(base: number, level: number): number {
  return Math.round(base * (1 + (level - 1) * 0.1));
}
