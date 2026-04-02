export type SurvivorClass = 'scavenger' | 'bruiser' | 'runner' | 'tinkerer' | 'warden'
export type GearSlot = 'weapon' | 'head' | 'chest' | 'legs' | 'boots' | 'backpack' | 'trinket'
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'relic'
export type ModuleType = 'bedroll' | 'cookfire' | 'workbench' | 'locker' | 'barricade' | 'radio'
export type Region = 'dust_flats' | 'dead_blocks' | 'ash_marsh' | 'the_spine'
export type DangerLevel = 'safe' | 'medium' | 'high' | 'extreme'
export type CombatResult = 'victory' | 'defeat' | 'fled'

export interface BaseStats {
  str: number
  def: number
  agi: number
  per: number
  vit: number
  wil: number
}

export interface DerivedStats {
  maxHp: number
  maxStamina: number
  staminaRegen: number
  hungerDrainMultiplier: number
  meleePower: number
  rangedPower: number
  critChance: number
  critDamage: number
  dodgeChance: number
  armor: number
  carryCapacity: number
  salvageBonus: number
  healingEfficiency: number
  statusResistance: number
}

export interface Survivor {
  id: string
  profile_id: string
  name: string
  class: SurvivorClass
  level: number
  xp: number
  str: number
  def: number
  agi: number
  per: number
  vit: number
  wil: number
  stamina: number
  stamina_max: number
  hunger: number
  hp: number
  hp_max: number
  skill_slots: string[]
  trait_ids: string[]
  stat_points: number
  is_alive: boolean
  stamina_updated_at: string
  hunger_updated_at: string
  created_at: string
}

export interface Profile {
  id: string
  display_name: string
  active_survivor_id: string | null
  scrap_tokens: number
  food_packs: number
  echo_shards: number
  meta_research: Record<string, number>
  last_seen_at: string
  created_at: string
}

export interface GearItem {
  id: string
  profile_id: string
  survivor_id: string | null
  slot: GearSlot
  is_equipped: boolean
  base_item_id: string
  rarity: Rarity
  level: number
  affixes: Affix[]
  created_at: string
}

export interface Affix {
  type: string
  value: number
  tier: number
}

export interface ShelterModule {
  id: string
  profile_id: string
  module_type: ModuleType
  tier: number
  task_started_at: string | null
  task_recipe_id: string | null
}

export interface WorldProgress {
  id: string
  profile_id: string
  region: Region
  sector: number
  node_index: number
  is_cleared: boolean
  best_time_ms: number | null
}

export interface Materials {
  profile_id: string
  scrap: number
  parts: number
  cloth: number
  alloy: number
  relic_fragments: number
}

export interface RadioEvent {
  id: string
  profile_id: string
  event_type: string
  payload: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export interface CombatRun {
  id: string
  profile_id: string
  survivor_id: string
  region: Region
  sector: number
  node_index: number
  seed: number
  result: CombatResult | null
  loot_json: Record<string, unknown> | null
  stamina_spent: number | null
  hp_lost: number | null
  duration_ms: number | null
  created_at: string
}

// Supabase Database type for typed client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
      }
      survivors: {
        Row: Survivor
        Insert: Omit<Survivor, 'id' | 'created_at' | 'stamina_updated_at' | 'hunger_updated_at'> & { id?: string }
        Update: Partial<Survivor>
      }
      gear_items: {
        Row: GearItem
        Insert: Omit<GearItem, 'id' | 'created_at'> & { id?: string }
        Update: Partial<GearItem>
      }
      shelter_modules: {
        Row: ShelterModule
        Insert: Omit<ShelterModule, 'id'> & { id?: string }
        Update: Partial<ShelterModule>
      }
      world_progress: {
        Row: WorldProgress
        Insert: Omit<WorldProgress, 'id'> & { id?: string }
        Update: Partial<WorldProgress>
      }
      combat_runs: {
        Row: CombatRun
        Insert: Omit<CombatRun, 'id' | 'created_at'> & { id?: string }
        Update: Partial<CombatRun>
      }
      materials: {
        Row: Materials
        Insert: Materials
        Update: Partial<Materials>
      }
      radio_events: {
        Row: RadioEvent
        Insert: Omit<RadioEvent, 'id' | 'created_at'> & { id?: string }
        Update: Partial<RadioEvent>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
