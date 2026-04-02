import type { ModuleType } from '../lib/types'
import { MODULE_TIER_BONUSES } from '../lib/constants'

export interface ModuleDef {
  type: ModuleType
  name: string
  icon: string
  description: string
  tierDescriptions: string[]
  upgradeCosts: { scrap: number; parts: number; cloth: number; alloy: number; relic_fragments: number }[]
}

export const MODULES: ModuleDef[] = [
  {
    type: 'bedroll',
    name: 'Bedroll',
    icon: 'B',
    description: 'Where your survivor rests. Improves stamina recovery.',
    tierDescriptions: [
      'Basic blanket on dirt.',
      'Padded sleeping bag. +15% stamina regen.',
      'Camp cot with cover. +30% stamina regen.',
      'Insulated bunk. +50% stamina regen.',
      'Climate-controlled pod. +75% stamina regen.',
    ],
    upgradeCosts: [
      { scrap: 0, parts: 0, cloth: 0, alloy: 0, relic_fragments: 0 },
      { scrap: 20, parts: 10, cloth: 15, alloy: 0, relic_fragments: 0 },
      { scrap: 40, parts: 25, cloth: 30, alloy: 5, relic_fragments: 0 },
      { scrap: 80, parts: 50, cloth: 50, alloy: 15, relic_fragments: 0 },
      { scrap: 150, parts: 80, cloth: 80, alloy: 30, relic_fragments: 5 },
    ],
  },
  {
    type: 'cookfire',
    name: 'Cookfire',
    icon: 'F',
    description: 'Prepare meals. Slows hunger drain.',
    tierDescriptions: [
      'Open flame. No hunger bonus.',
      'Stone ring fire. -10% hunger drain.',
      'Grill setup. -20% hunger drain.',
      'Full kitchen. -30% hunger drain.',
      'Automated kitchen. -45% hunger drain.',
    ],
    upgradeCosts: [
      { scrap: 0, parts: 0, cloth: 0, alloy: 0, relic_fragments: 0 },
      { scrap: 15, parts: 10, cloth: 5, alloy: 0, relic_fragments: 0 },
      { scrap: 35, parts: 20, cloth: 10, alloy: 5, relic_fragments: 0 },
      { scrap: 70, parts: 40, cloth: 20, alloy: 15, relic_fragments: 0 },
      { scrap: 130, parts: 70, cloth: 40, alloy: 25, relic_fragments: 5 },
    ],
  },
  {
    type: 'workbench',
    name: 'Workbench',
    icon: 'W',
    description: 'Craft and upgrade gear. Higher tiers unlock recipes.',
    tierDescriptions: [
      'Flat rock and tools. Tier 1 recipes.',
      'Proper table. Tier 2 recipes.',
      'Full workshop. Tier 3 recipes.',
      'Advanced forge. Tier 4 recipes.',
      'Relic fabricator. Tier 5 recipes.',
    ],
    upgradeCosts: [
      { scrap: 0, parts: 0, cloth: 0, alloy: 0, relic_fragments: 0 },
      { scrap: 25, parts: 20, cloth: 0, alloy: 5, relic_fragments: 0 },
      { scrap: 50, parts: 40, cloth: 0, alloy: 15, relic_fragments: 0 },
      { scrap: 100, parts: 70, cloth: 0, alloy: 30, relic_fragments: 5 },
      { scrap: 180, parts: 120, cloth: 0, alloy: 50, relic_fragments: 15 },
    ],
  },
  {
    type: 'locker',
    name: 'Locker',
    icon: 'L',
    description: 'Shared gear storage. More tiers = more slots.',
    tierDescriptions: [
      'Small crate. 20 slots.',
      'Metal cabinet. 35 slots.',
      'Storage room. 50 slots.',
      'Vault. 75 slots.',
      'Secure warehouse. 100 slots.',
    ],
    upgradeCosts: [
      { scrap: 0, parts: 0, cloth: 0, alloy: 0, relic_fragments: 0 },
      { scrap: 20, parts: 15, cloth: 0, alloy: 0, relic_fragments: 0 },
      { scrap: 40, parts: 30, cloth: 0, alloy: 10, relic_fragments: 0 },
      { scrap: 80, parts: 55, cloth: 0, alloy: 20, relic_fragments: 0 },
      { scrap: 140, parts: 90, cloth: 0, alloy: 40, relic_fragments: 5 },
    ],
  },
  {
    type: 'barricade',
    name: 'Barricade',
    icon: 'D',
    description: 'Protects offline gains. Reduces loot loss on death.',
    tierDescriptions: [
      'No protection.',
      'Scrap fence. -10% loot loss.',
      'Reinforced wall. -20% loot loss.',
      'Fortified perimeter. -30% loot loss.',
      'Blast-proof bunker. -45% loot loss.',
    ],
    upgradeCosts: [
      { scrap: 0, parts: 0, cloth: 0, alloy: 0, relic_fragments: 0 },
      { scrap: 30, parts: 15, cloth: 0, alloy: 5, relic_fragments: 0 },
      { scrap: 60, parts: 35, cloth: 0, alloy: 15, relic_fragments: 0 },
      { scrap: 110, parts: 60, cloth: 0, alloy: 30, relic_fragments: 3 },
      { scrap: 200, parts: 100, cloth: 0, alloy: 50, relic_fragments: 10 },
    ],
  },
  {
    type: 'radio',
    name: 'Radio',
    icon: 'R',
    description: 'Unlocks contracts, events, and rescue missions.',
    tierDescriptions: [
      'Broken receiver. Basic signals.',
      'Patched radio. Local contracts.',
      'Boosted antenna. Regional events.',
      'Encrypted channel. Elite contracts.',
      'Satellite link. Global network.',
    ],
    upgradeCosts: [
      { scrap: 0, parts: 0, cloth: 0, alloy: 0, relic_fragments: 0 },
      { scrap: 20, parts: 15, cloth: 5, alloy: 0, relic_fragments: 0 },
      { scrap: 45, parts: 30, cloth: 10, alloy: 10, relic_fragments: 0 },
      { scrap: 90, parts: 55, cloth: 15, alloy: 20, relic_fragments: 5 },
      { scrap: 160, parts: 100, cloth: 25, alloy: 40, relic_fragments: 10 },
    ],
  },
]

export const MODULE_MAP = Object.fromEntries(MODULES.map((m) => [m.type, m])) as Record<ModuleType, ModuleDef>

export function getModuleBonus(type: ModuleType, tier: number): number {
  const bonuses = MODULE_TIER_BONUSES[type]
  return bonuses[Math.min(tier - 1, bonuses.length - 1)]
}
