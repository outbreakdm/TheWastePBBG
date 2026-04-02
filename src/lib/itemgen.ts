import type { Rarity, Affix } from './types'
import { AFFIXES } from '../data/affixes'

const RARITY_AFFIX_COUNT: Record<Rarity, { min: number; max: number }> = {
  common: { min: 0, max: 0 },
  uncommon: { min: 0, max: 1 },
  rare: { min: 1, max: 2 },
  epic: { min: 2, max: 3 },
  relic: { min: 2, max: 3 },
}

const RARITY_AFFIX_TIER: Record<Rarity, number> = {
  common: 0,
  uncommon: 0,
  rare: 1,
  epic: 1,
  relic: 2,
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function rollAffixes(rarity: Rarity): Affix[] {
  const { min, max } = RARITY_AFFIX_COUNT[rarity]
  const count = randInt(min, max)
  if (count === 0) return []

  const maxTier = RARITY_AFFIX_TIER[rarity]
  const pool = [...AFFIXES]
  const result: Affix[] = []

  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    const affix = pool.splice(idx, 1)[0]
    const tier = Math.min(maxTier, affix.tiers.length - 1)
    const range = affix.tiers[tier]
    result.push({
      type: affix.id,
      value: randInt(range.min, range.max),
      tier,
    })
  }

  return result
}

export function generateItemLevel(baseTier: number): number {
  // Item level = tier * 5 + small random variance
  return baseTier * 5 + randInt(0, 3)
}
