import type { GearSlot } from '../lib/types'

export interface BaseItemDef {
  id: string
  name: string
  slot: GearSlot
  tier: number // 1-5 roughly maps to region difficulty
  baseAtk?: number
  baseArmor?: number
  baseHp?: number
  baseStamina?: number
  description: string
}

// --- Weapons ---
const weapons: BaseItemDef[] = [
  { id: 'pipe_club', name: 'Pipe Club', slot: 'weapon', tier: 1, baseAtk: 8, description: 'A bent pipe. Better than fists.' },
  { id: 'sharpened_blade', name: 'Sharpened Blade', slot: 'weapon', tier: 1, baseAtk: 10, description: 'A scrap-metal knife honed to an edge.' },
  { id: 'rusty_pistol', name: 'Rusty Pistol', slot: 'weapon', tier: 1, baseAtk: 12, description: 'Fires more often than it jams.' },
  { id: 'spiked_bat', name: 'Spiked Bat', slot: 'weapon', tier: 2, baseAtk: 16, description: 'Nails hammered through wood. Brutal.' },
  { id: 'hunting_rifle', name: 'Hunting Rifle', slot: 'weapon', tier: 2, baseAtk: 20, description: 'Pre-war bolt action. Still accurate.' },
  { id: 'machete', name: 'Machete', slot: 'weapon', tier: 2, baseAtk: 18, description: 'Cleaves through brush and bone alike.' },
  { id: 'combat_shotgun', name: 'Combat Shotgun', slot: 'weapon', tier: 3, baseAtk: 24, description: 'Close-range devastation.' },
  { id: 'power_fist', name: 'Power Fist', slot: 'weapon', tier: 3, baseAtk: 28, description: 'Pneumatic-assisted punches.' },
  { id: 'plasma_cutter', name: 'Plasma Cutter', slot: 'weapon', tier: 4, baseAtk: 34, description: 'Relic-tech that slices through armor.' },
  { id: 'rail_pistol', name: 'Rail Pistol', slot: 'weapon', tier: 4, baseAtk: 38, description: 'Magnetic acceleration. Devastating range.' },
  { id: 'void_blade', name: 'Void Blade', slot: 'weapon', tier: 5, baseAtk: 45, description: 'A weapon from before the dust. Hums with power.' },
  { id: 'thunder_cannon', name: 'Thunder Cannon', slot: 'weapon', tier: 5, baseAtk: 50, description: 'Relic artillery scaled for one hand.' },
]

// --- Head ---
const headgear: BaseItemDef[] = [
  { id: 'cloth_wrap', name: 'Cloth Wrap', slot: 'head', tier: 1, baseArmor: 2, description: 'Keeps sand out of your eyes.' },
  { id: 'scrap_helmet', name: 'Scrap Helmet', slot: 'head', tier: 2, baseArmor: 5, description: 'Welded-together metal plates.' },
  { id: 'gas_mask', name: 'Gas Mask', slot: 'head', tier: 3, baseArmor: 8, description: 'Filters the worst of it.' },
  { id: 'combat_visor', name: 'Combat Visor', slot: 'head', tier: 4, baseArmor: 12, description: 'Ballistic-rated polymer.' },
  { id: 'relic_helm', name: 'Relic Helm', slot: 'head', tier: 5, baseArmor: 18, description: 'Pre-war military. Nearly indestructible.' },
]

// --- Chest ---
const chestgear: BaseItemDef[] = [
  { id: 'leather_vest', name: 'Leather Vest', slot: 'chest', tier: 1, baseArmor: 4, description: 'Tough hide. Blocks scrapes.' },
  { id: 'raider_jacket', name: 'Raider Jacket', slot: 'chest', tier: 2, baseArmor: 8, description: 'Spiked shoulders, padded core.' },
  { id: 'plate_carrier', name: 'Plate Carrier', slot: 'chest', tier: 3, baseArmor: 14, description: 'Ceramic inserts still intact.' },
  { id: 'composite_vest', name: 'Composite Vest', slot: 'chest', tier: 4, baseArmor: 20, description: 'Layered alloy weave.' },
  { id: 'relic_chestplate', name: 'Relic Chestplate', slot: 'chest', tier: 5, baseArmor: 28, description: 'Power-assisted armor plating.' },
]

// --- Legs ---
const leggear: BaseItemDef[] = [
  { id: 'patched_pants', name: 'Patched Pants', slot: 'legs', tier: 1, baseArmor: 2, description: 'Better than nothing.' },
  { id: 'cargo_trousers', name: 'Cargo Trousers', slot: 'legs', tier: 2, baseArmor: 5, description: 'Extra pockets, reinforced knees.' },
  { id: 'armored_leggings', name: 'Armored Leggings', slot: 'legs', tier: 3, baseArmor: 9, description: 'Plated thigh guards.' },
  { id: 'composite_greaves', name: 'Composite Greaves', slot: 'legs', tier: 4, baseArmor: 14, description: 'Full lower-body coverage.' },
  { id: 'relic_legplates', name: 'Relic Legplates', slot: 'legs', tier: 5, baseArmor: 20, description: 'Servo-assisted movement.' },
]

// --- Boots ---
const boots: BaseItemDef[] = [
  { id: 'wrapped_sandals', name: 'Wrapped Sandals', slot: 'boots', tier: 1, baseArmor: 1, description: 'Cloth strips and rubber sole.' },
  { id: 'work_boots', name: 'Work Boots', slot: 'boots', tier: 2, baseArmor: 3, description: 'Steel-toed. Pre-war labor issue.' },
  { id: 'combat_boots', name: 'Combat Boots', slot: 'boots', tier: 3, baseArmor: 6, description: 'Military surplus. Grip and guard.' },
  { id: 'alloy_treads', name: 'Alloy Treads', slot: 'boots', tier: 4, baseArmor: 10, description: 'Magnetic sole, plated shin.' },
  { id: 'relic_boots', name: 'Relic Boots', slot: 'boots', tier: 5, baseArmor: 14, description: 'Self-adjusting fit. Silent step.' },
]

// --- Backpacks ---
const backpacks: BaseItemDef[] = [
  { id: 'sack', name: 'Burlap Sack', slot: 'backpack', tier: 1, baseStamina: 3, description: 'A sack with a rope strap.' },
  { id: 'duffle_bag', name: 'Duffle Bag', slot: 'backpack', tier: 2, baseStamina: 5, description: 'Canvas. Holds more than expected.' },
  { id: 'military_pack', name: 'Military Pack', slot: 'backpack', tier: 3, baseStamina: 8, description: 'MOLLE webbing. Proper support.' },
  { id: 'expedition_rig', name: 'Expedition Rig', slot: 'backpack', tier: 4, baseStamina: 12, description: 'Frame pack with hip belt.' },
  { id: 'relic_carrier', name: 'Relic Carrier', slot: 'backpack', tier: 5, baseStamina: 18, description: 'Anti-grav assisted. Weighs nothing.' },
]

// --- Trinkets ---
const trinkets: BaseItemDef[] = [
  { id: 'lucky_coin', name: 'Lucky Coin', slot: 'trinket', tier: 1, description: 'Feels warmer than it should.' },
  { id: 'compass_fragment', name: 'Compass Fragment', slot: 'trinket', tier: 2, description: 'Points somewhere. Maybe useful.' },
  { id: 'signal_beacon', name: 'Signal Beacon', slot: 'trinket', tier: 3, description: 'Pulses faintly. Something listens.' },
  { id: 'core_shard', name: 'Core Shard', slot: 'trinket', tier: 4, description: 'Warm to the touch. Hums with energy.' },
  { id: 'relic_amulet', name: 'Relic Amulet', slot: 'trinket', tier: 5, description: 'Pre-war tech fused with something else.' },
]

export const ALL_ITEMS: BaseItemDef[] = [
  ...weapons, ...headgear, ...chestgear, ...leggear, ...boots, ...backpacks, ...trinkets,
]

export const ITEM_MAP = Object.fromEntries(ALL_ITEMS.map((i) => [i.id, i])) as Record<string, BaseItemDef>

export function getItemsBySlot(slot: GearSlot): BaseItemDef[] {
  return ALL_ITEMS.filter((i) => i.slot === slot)
}

export function getItemsByTier(tier: number): BaseItemDef[] {
  return ALL_ITEMS.filter((i) => i.tier <= tier)
}
