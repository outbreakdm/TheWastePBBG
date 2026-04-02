import type { SurvivorClass, BaseStats, ModuleType } from './types'

// --- Class starting stat distributions ---
export const CLASS_BASE_STATS: Record<SurvivorClass, BaseStats> = {
  scavenger: { str: 4, def: 4, agi: 6, per: 7, vit: 5, wil: 4 },
  bruiser:   { str: 7, def: 6, agi: 3, per: 4, vit: 6, wil: 4 },
  runner:    { str: 4, def: 3, agi: 8, per: 5, vit: 5, wil: 5 },
  tinkerer:  { str: 4, def: 4, agi: 5, per: 6, vit: 4, wil: 7 },
  warden:    { str: 5, def: 7, agi: 4, per: 4, vit: 6, wil: 4 },
}

// --- Level & XP ---
export const LEVEL_SOFT_CAP = 30
export const XP_BASE = 80  // lowered for faster early levels
export const XP_GROWTH = 1.18 // steeper curve to slow mid/late game
export const STAT_POINTS_PER_LEVEL = 2
export const DISCRETIONARY_POINT_INTERVAL = 3 // +1 free point every N levels

// --- Stamina tuning ---
export const BASE_STAMINA = 50
export const STAMINA_PER_VIT = 4
export const STAMINA_PER_AGI = 2
export const STAMINA_REGEN_BASE = 1 // per second
export const STAMINA_REGEN_PER_AGI = 0.05
export const STAMINA_REGEN_PER_WIL = 0.03

// --- Hunger tuning ---
export const HUNGER_MAX = 100 // 0 = full, 100 = starving
export const HUNGER_TICK_INTERVAL = 150 // seconds per 1 hunger point baseline (slower drain)
export const HUNGER_STRENUOUS_MULTIPLIER = 1.5 // reduced to feel less punishing
export const HUNGER_DRAIN_REDUCTION_PER_VIT = 0.005
export const HUNGER_DRAIN_REDUCTION_CAP = 0.35

// --- HP ---
export const BASE_HP = 100
export const HP_PER_VIT = 12

// --- Combat ---
export const MELEE_STR_SCALE = 2
export const RANGED_PER_SCALE = 1.5
export const RANGED_AGI_SCALE = 0.5
export const ARMOR_DEF_SCALE = 2
export const BASE_CRIT_CHANCE = 0.05
export const CRIT_PER_PER = 0.003
export const BASE_CRIT_DAMAGE = 1.5
export const DODGE_PER_AGI = 0.004
export const BASE_CARRY_CAPACITY = 20
export const CARRY_PER_STR = 1.5

// --- Node stamina costs by region ---
export const NODE_STAMINA_COST: Record<string, number> = {
  dust_flats: 8,
  dead_blocks: 10,
  ash_marsh: 12,
  the_spine: 14,
}

// --- Shelter module bonuses per tier ---
export const MODULE_TIER_BONUSES: Record<ModuleType, number[]> = {
  bedroll:   [1.0, 1.15, 1.30, 1.50, 1.75],   // stamina regen multiplier
  cookfire:  [1.0, 0.90, 0.80, 0.70, 0.55],    // hunger drain multiplier
  workbench: [1, 2, 3, 4, 5],                    // recipe tier unlocked
  locker:    [20, 35, 50, 75, 100],              // shared locker slots
  barricade: [0, 0.10, 0.20, 0.30, 0.45],       // loot loss reduction on death
  radio:     [1, 2, 3, 4, 5],                    // event tier unlocked
}

// --- Death penalty ---
export const LOOT_LOSS_ON_DEATH = 0.25 // 25% of unbanked loot lost (less punishing)

// --- Offline ---
export const OFFLINE_STAMINA_REGEN_RATE = 0.5 // per second, before module bonus
export const OFFLINE_MAX_HOURS = 12 // cap offline progress at 12 hours
