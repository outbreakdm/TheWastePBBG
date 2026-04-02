import type { BaseStats, DerivedStats } from './types'
import {
  BASE_HP, HP_PER_VIT,
  BASE_STAMINA, STAMINA_PER_VIT, STAMINA_PER_AGI,
  STAMINA_REGEN_BASE, STAMINA_REGEN_PER_AGI, STAMINA_REGEN_PER_WIL,
  HUNGER_DRAIN_REDUCTION_PER_VIT, HUNGER_DRAIN_REDUCTION_CAP,
  MELEE_STR_SCALE, RANGED_PER_SCALE, RANGED_AGI_SCALE,
  ARMOR_DEF_SCALE,
  BASE_CRIT_CHANCE, CRIT_PER_PER, BASE_CRIT_DAMAGE,
  DODGE_PER_AGI,
  BASE_CARRY_CAPACITY, CARRY_PER_STR,
  XP_BASE, XP_GROWTH,
} from './constants'

export function computeDerivedStats(
  stats: BaseStats,
  gearHp = 0,
  gearStamina = 0,
  weaponAtk = 0,
  armorGear = 0,
  backpackBonus = 0,
  bonusRegen = 0,
  bonusDrainReduction = 0,
): DerivedStats {
  const maxHp = BASE_HP + stats.vit * HP_PER_VIT + gearHp
  const maxStamina = BASE_STAMINA + stats.vit * STAMINA_PER_VIT + stats.agi * STAMINA_PER_AGI + gearStamina
  const staminaRegen = STAMINA_REGEN_BASE + stats.agi * STAMINA_REGEN_PER_AGI + stats.wil * STAMINA_REGEN_PER_WIL + bonusRegen
  const hungerDrainMultiplier = 1 - Math.min(HUNGER_DRAIN_REDUCTION_CAP, stats.vit * HUNGER_DRAIN_REDUCTION_PER_VIT + bonusDrainReduction)
  const meleePower = weaponAtk + stats.str * MELEE_STR_SCALE
  const rangedPower = weaponAtk + stats.per * RANGED_PER_SCALE + stats.agi * RANGED_AGI_SCALE
  const critChance = BASE_CRIT_CHANCE + stats.per * CRIT_PER_PER
  const critDamage = BASE_CRIT_DAMAGE
  const dodgeChance = stats.agi * DODGE_PER_AGI
  const armor = stats.def * ARMOR_DEF_SCALE + armorGear
  const carryCapacity = BASE_CARRY_CAPACITY + stats.str * CARRY_PER_STR + backpackBonus
  const salvageBonus = stats.per * 0.01
  const healingEfficiency = 1 + stats.wil * 0.02
  const statusResistance = stats.wil * 0.01

  return {
    maxHp, maxStamina, staminaRegen, hungerDrainMultiplier,
    meleePower, rangedPower, critChance, critDamage,
    dodgeChance, armor, carryCapacity, salvageBonus,
    healingEfficiency, statusResistance,
  }
}

export function xpForLevel(level: number): number {
  return Math.floor(XP_BASE * Math.pow(XP_GROWTH, level - 1))
}

export function totalXpToLevel(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i)
  }
  return total
}
