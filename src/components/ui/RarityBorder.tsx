import type { Rarity } from '../../lib/types'

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'border-rarity-common',
  uncommon: 'border-rarity-uncommon',
  rare: 'border-rarity-rare',
  epic: 'border-rarity-epic',
  relic: 'border-rarity-relic',
}

const RARITY_TEXT: Record<Rarity, string> = {
  common: 'text-rarity-common',
  uncommon: 'text-rarity-uncommon',
  rare: 'text-rarity-rare',
  epic: 'text-rarity-epic',
  relic: 'text-rarity-relic',
}

const RARITY_BG: Record<Rarity, string> = {
  common: 'bg-rarity-common/10',
  uncommon: 'bg-rarity-uncommon/10',
  rare: 'bg-rarity-rare/10',
  epic: 'bg-rarity-epic/10',
  relic: 'bg-rarity-relic/10',
}

export function rarityBorderClass(rarity: Rarity): string {
  return RARITY_COLORS[rarity]
}

export function rarityTextClass(rarity: Rarity): string {
  return RARITY_TEXT[rarity]
}

export function rarityBgClass(rarity: Rarity): string {
  return RARITY_BG[rarity]
}
