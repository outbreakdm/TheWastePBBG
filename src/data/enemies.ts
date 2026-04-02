import type { Region } from '../lib/types'

export interface EnemyDef {
  id: string
  name: string
  region: Region
  tier: number // 1-10 within region (maps to sector)
  hp: number
  atk: number
  def: number
  speed: number // determines turn order
  xpReward: number
  lootTable: LootEntry[]
}

export interface LootEntry {
  type: 'material' | 'gear'
  id: string // material name or base_item_id
  chance: number // 0-1
  minQty?: number
  maxQty?: number
}

function enemy(
  id: string, name: string, region: Region, tier: number,
  hp: number, atk: number, def: number, speed: number,
  xpReward: number, loot: LootEntry[]
): EnemyDef {
  return { id, name, region, tier, hp, atk, def, speed, xpReward, lootTable: loot }
}

export const ENEMIES: EnemyDef[] = [
  // Dust Flats (tier 1-10)
  enemy('dust_rat', 'Dust Rat', 'dust_flats', 1, 25, 5, 1, 3, 10, [
    { type: 'material', id: 'scrap', chance: 0.8, minQty: 2, maxQty: 5 },
    { type: 'material', id: 'cloth', chance: 0.4, minQty: 1, maxQty: 3 },
  ]),
  enemy('scavenger_thug', 'Scavenger Thug', 'dust_flats', 2, 40, 8, 3, 4, 18, [
    { type: 'material', id: 'scrap', chance: 0.9, minQty: 3, maxQty: 7 },
    { type: 'material', id: 'parts', chance: 0.3, minQty: 1, maxQty: 3 },
    { type: 'gear', id: 'pipe_club', chance: 0.08 },
  ]),
  enemy('sand_scorpion', 'Sand Scorpion', 'dust_flats', 3, 55, 10, 5, 6, 25, [
    { type: 'material', id: 'scrap', chance: 0.7, minQty: 3, maxQty: 6 },
    { type: 'material', id: 'cloth', chance: 0.5, minQty: 2, maxQty: 4 },
  ]),
  enemy('raider_scout', 'Raider Scout', 'dust_flats', 5, 80, 14, 7, 7, 40, [
    { type: 'material', id: 'scrap', chance: 1.0, minQty: 5, maxQty: 10 },
    { type: 'material', id: 'parts', chance: 0.5, minQty: 2, maxQty: 5 },
    { type: 'gear', id: 'sharpened_blade', chance: 0.1 },
    { type: 'gear', id: 'cloth_wrap', chance: 0.08 },
  ]),
  enemy('dust_alpha', 'Dust Alpha', 'dust_flats', 10, 200, 22, 12, 5, 120, [
    { type: 'material', id: 'scrap', chance: 1.0, minQty: 15, maxQty: 25 },
    { type: 'material', id: 'parts', chance: 0.8, minQty: 5, maxQty: 12 },
    { type: 'material', id: 'cloth', chance: 0.6, minQty: 5, maxQty: 10 },
    { type: 'gear', id: 'rusty_pistol', chance: 0.2 },
    { type: 'gear', id: 'leather_vest', chance: 0.15 },
  ]),

  // Dead Blocks (tier 1-10)
  enemy('block_crawler', 'Block Crawler', 'dead_blocks', 1, 70, 12, 8, 5, 30, [
    { type: 'material', id: 'scrap', chance: 0.9, minQty: 5, maxQty: 10 },
    { type: 'material', id: 'parts', chance: 0.5, minQty: 2, maxQty: 5 },
  ]),
  enemy('pipe_bomber', 'Pipe Bomber', 'dead_blocks', 3, 90, 18, 6, 8, 45, [
    { type: 'material', id: 'parts', chance: 0.8, minQty: 4, maxQty: 8 },
    { type: 'material', id: 'scrap', chance: 0.7, minQty: 5, maxQty: 12 },
    { type: 'gear', id: 'spiked_bat', chance: 0.1 },
  ]),
  enemy('feral_pack', 'Feral Pack', 'dead_blocks', 5, 120, 20, 10, 9, 60, [
    { type: 'material', id: 'cloth', chance: 0.8, minQty: 5, maxQty: 10 },
    { type: 'material', id: 'scrap', chance: 0.6, minQty: 8, maxQty: 15 },
    { type: 'gear', id: 'scrap_helmet', chance: 0.08 },
  ]),
  enemy('block_warlord', 'Block Warlord', 'dead_blocks', 10, 350, 30, 18, 6, 200, [
    { type: 'material', id: 'scrap', chance: 1.0, minQty: 20, maxQty: 35 },
    { type: 'material', id: 'parts', chance: 0.9, minQty: 10, maxQty: 20 },
    { type: 'material', id: 'alloy', chance: 0.3, minQty: 1, maxQty: 3 },
    { type: 'gear', id: 'hunting_rifle', chance: 0.18 },
    { type: 'gear', id: 'raider_jacket', chance: 0.15 },
  ]),

  // Ash Marsh
  enemy('toxic_lurker', 'Toxic Lurker', 'ash_marsh', 1, 130, 22, 14, 7, 55, [
    { type: 'material', id: 'scrap', chance: 0.8, minQty: 8, maxQty: 15 },
    { type: 'material', id: 'alloy', chance: 0.3, minQty: 1, maxQty: 3 },
  ]),
  enemy('marsh_brute', 'Marsh Brute', 'ash_marsh', 5, 200, 30, 18, 5, 90, [
    { type: 'material', id: 'alloy', chance: 0.5, minQty: 2, maxQty: 5 },
    { type: 'material', id: 'parts', chance: 0.7, minQty: 8, maxQty: 15 },
    { type: 'gear', id: 'combat_shotgun', chance: 0.08 },
  ]),
  enemy('swamp_queen', 'Swamp Queen', 'ash_marsh', 10, 500, 38, 24, 8, 350, [
    { type: 'material', id: 'alloy', chance: 0.9, minQty: 5, maxQty: 12 },
    { type: 'material', id: 'relic_fragments', chance: 0.2, minQty: 1, maxQty: 2 },
    { type: 'gear', id: 'plate_carrier', chance: 0.15 },
    { type: 'gear', id: 'gas_mask', chance: 0.12 },
  ]),

  // The Spine
  enemy('spine_sentry', 'Spine Sentry', 'the_spine', 1, 220, 32, 22, 8, 100, [
    { type: 'material', id: 'alloy', chance: 0.7, minQty: 3, maxQty: 8 },
    { type: 'material', id: 'parts', chance: 0.6, minQty: 10, maxQty: 18 },
  ]),
  enemy('mech_walker', 'Mech Walker', 'the_spine', 5, 400, 42, 30, 6, 180, [
    { type: 'material', id: 'alloy', chance: 0.8, minQty: 5, maxQty: 12 },
    { type: 'material', id: 'relic_fragments', chance: 0.4, minQty: 1, maxQty: 3 },
    { type: 'gear', id: 'plasma_cutter', chance: 0.06 },
  ]),
  enemy('overlord', 'The Overlord', 'the_spine', 10, 800, 55, 40, 7, 500, [
    { type: 'material', id: 'alloy', chance: 1.0, minQty: 10, maxQty: 25 },
    { type: 'material', id: 'relic_fragments', chance: 0.7, minQty: 3, maxQty: 8 },
    { type: 'gear', id: 'void_blade', chance: 0.05 },
    { type: 'gear', id: 'relic_chestplate', chance: 0.05 },
  ]),
]

export function getEnemiesForNode(region: Region, sector: number): EnemyDef[] {
  const regionEnemies = ENEMIES.filter((e) => e.region === region)
  // Pick enemies whose tier is <= sector, prefer those closest to sector
  return regionEnemies
    .filter((e) => e.tier <= sector)
    .sort((a, b) => b.tier - a.tier)
    .slice(0, 3)
}

export function getBoss(region: Region): EnemyDef | undefined {
  return ENEMIES.find((e) => e.region === region && e.tier === 10)
}
