import type { GearSlot, Rarity } from '../lib/types'

export interface RecipeDef {
  id: string
  name: string
  description: string
  workbenchTier: number // minimum workbench tier required
  materials: {
    scrap?: number
    parts?: number
    cloth?: number
    alloy?: number
    relic_fragments?: number
  }
  output: {
    type: 'gear' | 'consumable'
    baseItemId?: string
    slot?: GearSlot
    rarity: Rarity
    tier: number
  }
}

export const RECIPES: RecipeDef[] = [
  // Tier 1 workbench — basic gear
  {
    id: 'craft_pipe_club', name: 'Pipe Club', description: 'Bend some pipe into a weapon.',
    workbenchTier: 1,
    materials: { scrap: 15, parts: 5 },
    output: { type: 'gear', baseItemId: 'pipe_club', slot: 'weapon', rarity: 'common', tier: 1 },
  },
  {
    id: 'craft_cloth_wrap', name: 'Cloth Wrap', description: 'Fashion protective headwear.',
    workbenchTier: 1,
    materials: { cloth: 10 },
    output: { type: 'gear', baseItemId: 'cloth_wrap', slot: 'head', rarity: 'common', tier: 1 },
  },
  {
    id: 'craft_leather_vest', name: 'Leather Vest', description: 'Stitch together some hide.',
    workbenchTier: 1,
    materials: { cloth: 12, scrap: 5 },
    output: { type: 'gear', baseItemId: 'leather_vest', slot: 'chest', rarity: 'common', tier: 1 },
  },
  {
    id: 'craft_sack', name: 'Burlap Sack', description: 'A basic carrying solution.',
    workbenchTier: 1,
    materials: { cloth: 8 },
    output: { type: 'gear', baseItemId: 'sack', slot: 'backpack', rarity: 'common', tier: 1 },
  },
  {
    id: 'craft_patched_pants', name: 'Patched Pants', description: 'Stitch scraps into leg coverage.',
    workbenchTier: 1,
    materials: { cloth: 10, scrap: 3 },
    output: { type: 'gear', baseItemId: 'patched_pants', slot: 'legs', rarity: 'common', tier: 1 },
  },
  {
    id: 'craft_wrapped_sandals', name: 'Wrapped Sandals', description: 'Rubber and cloth foot protection.',
    workbenchTier: 1,
    materials: { cloth: 6, scrap: 4 },
    output: { type: 'gear', baseItemId: 'wrapped_sandals', slot: 'boots', rarity: 'common', tier: 1 },
  },

  // Tier 2 workbench — improved gear
  {
    id: 'craft_spiked_bat', name: 'Spiked Bat', description: 'Hammer nails through a bat.',
    workbenchTier: 2,
    materials: { scrap: 25, parts: 12 },
    output: { type: 'gear', baseItemId: 'spiked_bat', slot: 'weapon', rarity: 'uncommon', tier: 2 },
  },
  {
    id: 'craft_scrap_helmet', name: 'Scrap Helmet', description: 'Weld metal plates into a helm.',
    workbenchTier: 2,
    materials: { scrap: 20, parts: 10 },
    output: { type: 'gear', baseItemId: 'scrap_helmet', slot: 'head', rarity: 'uncommon', tier: 2 },
  },
  {
    id: 'craft_raider_jacket', name: 'Raider Jacket', description: 'Padded jacket with metal studs.',
    workbenchTier: 2,
    materials: { cloth: 18, scrap: 15, parts: 8 },
    output: { type: 'gear', baseItemId: 'raider_jacket', slot: 'chest', rarity: 'uncommon', tier: 2 },
  },
  {
    id: 'craft_duffle_bag', name: 'Duffle Bag', description: 'Reinforced canvas carrying bag.',
    workbenchTier: 2,
    materials: { cloth: 15, parts: 8 },
    output: { type: 'gear', baseItemId: 'duffle_bag', slot: 'backpack', rarity: 'uncommon', tier: 2 },
  },

  // Tier 3 workbench — military grade
  {
    id: 'craft_combat_shotgun', name: 'Combat Shotgun', description: 'Assemble a working shotgun.',
    workbenchTier: 3,
    materials: { scrap: 35, parts: 25, alloy: 10 },
    output: { type: 'gear', baseItemId: 'combat_shotgun', slot: 'weapon', rarity: 'rare', tier: 3 },
  },
  {
    id: 'craft_plate_carrier', name: 'Plate Carrier', description: 'Ceramic plate body armor.',
    workbenchTier: 3,
    materials: { alloy: 15, parts: 20, cloth: 10 },
    output: { type: 'gear', baseItemId: 'plate_carrier', slot: 'chest', rarity: 'rare', tier: 3 },
  },
  {
    id: 'craft_military_pack', name: 'Military Pack', description: 'Proper expedition backpack.',
    workbenchTier: 3,
    materials: { cloth: 25, parts: 15, alloy: 5 },
    output: { type: 'gear', baseItemId: 'military_pack', slot: 'backpack', rarity: 'rare', tier: 3 },
  },

  // Tier 4 workbench — advanced tech
  {
    id: 'craft_plasma_cutter', name: 'Plasma Cutter', description: 'Relic tech repurposed as a blade.',
    workbenchTier: 4,
    materials: { alloy: 25, parts: 30, relic_fragments: 5 },
    output: { type: 'gear', baseItemId: 'plasma_cutter', slot: 'weapon', rarity: 'epic', tier: 4 },
  },
  {
    id: 'craft_composite_vest', name: 'Composite Vest', description: 'Layered alloy weave armor.',
    workbenchTier: 4,
    materials: { alloy: 30, parts: 20, relic_fragments: 3 },
    output: { type: 'gear', baseItemId: 'composite_vest', slot: 'chest', rarity: 'epic', tier: 4 },
  },

  // Tier 5 workbench — relic tier
  {
    id: 'craft_void_blade', name: 'Void Blade', description: 'Channel relic energy into a weapon.',
    workbenchTier: 5,
    materials: { alloy: 40, relic_fragments: 20, parts: 25 },
    output: { type: 'gear', baseItemId: 'void_blade', slot: 'weapon', rarity: 'relic', tier: 5 },
  },
]

export const RECIPE_MAP = Object.fromEntries(RECIPES.map((r) => [r.id, r])) as Record<string, RecipeDef>
