import { ELEMENT_INFO, type ElementType } from '../items/types';
import type { RNG } from '../items/rng';
import { rngBool } from '../items/rng';

export interface DamageRollInput {
  baseDamage: number;
  gunDamageMult: number;
  elementalDamageMult: number;
  critDamageMult: number;
  isCrit: boolean;
  element: ElementType;
}

export interface DamageResult {
  amount: number;
  isCrit: boolean;
  element: ElementType;
  dotPerSecond: number;
  dotDuration: number;
}

export function rollDamage(input: DamageRollInput): DamageResult {
  let amount = input.baseDamage * input.gunDamageMult;
  if (input.element !== 'kinetic') {
    amount *= input.elementalDamageMult;
  }
  if (input.isCrit) {
    amount *= input.critDamageMult;
  }
  const elementInfo = ELEMENT_INFO[input.element];
  const dotPerSecond = amount * elementInfo.dotPerSecondFactor;
  return {
    amount: Math.round(amount),
    isCrit: input.isCrit,
    element: input.element,
    dotPerSecond: Math.round(dotPerSecond),
    dotDuration: dotPerSecond > 0 ? 3 : 0,
  };
}

export function rollCrit(rng: RNG, baseCritChance: number): boolean {
  return rngBool(rng, baseCritChance);
}

export function applyDamageReduction(damage: number, damageReductionPct: number): number {
  return Math.max(0, Math.round(damage * (1 - damageReductionPct)));
}

export function shieldAbsorb(damage: number, shieldCurrent: number): { toShield: number; toHealth: number; remainingShield: number } {
  const toShield = Math.min(damage, shieldCurrent);
  const toHealth = damage - toShield;
  return { toShield, toHealth, remainingShield: shieldCurrent - toShield };
}
