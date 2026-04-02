import type { ShelterModule, Survivor } from './types'
import { OFFLINE_STAMINA_REGEN_RATE, OFFLINE_MAX_HOURS, HUNGER_TICK_INTERVAL } from './constants'
import { getModuleBonus } from '../data/modules'

export interface OfflineResult {
  elapsedSeconds: number
  staminaGained: number
  hungerGained: number
  tasksCompleted: string[]
}

export function calculateOfflineProgress(
  lastSeenAt: string,
  survivor: Survivor,
  modules: ShelterModule[],
): OfflineResult {
  const now = Date.now()
  const lastSeen = new Date(lastSeenAt).getTime()
  const elapsedMs = Math.max(0, now - lastSeen)
  const maxMs = OFFLINE_MAX_HOURS * 60 * 60 * 1000
  const cappedMs = Math.min(elapsedMs, maxMs)
  const elapsedSeconds = Math.floor(cappedMs / 1000)

  if (elapsedSeconds < 60) {
    return { elapsedSeconds: 0, staminaGained: 0, hungerGained: 0, tasksCompleted: [] }
  }

  // Bedroll: stamina recovery
  const bedroll = modules.find((m) => m.module_type === 'bedroll')
  const bedrollBonus = bedroll ? getModuleBonus('bedroll', bedroll.tier) : 1.0
  const staminaPerSec = OFFLINE_STAMINA_REGEN_RATE * bedrollBonus
  const rawStaminaGain = Math.floor(staminaPerSec * elapsedSeconds)
  const staminaGained = Math.min(rawStaminaGain, survivor.stamina_max - survivor.stamina)

  // Cookfire: hunger accumulation (slower with higher tier)
  const cookfire = modules.find((m) => m.module_type === 'cookfire')
  const cookfireBonus = cookfire ? getModuleBonus('cookfire', cookfire.tier) : 1.0
  const hungerPerSec = cookfireBonus / HUNGER_TICK_INTERVAL
  const rawHungerGain = Math.floor(hungerPerSec * elapsedSeconds)
  const hungerGained = Math.min(rawHungerGain, 100 - survivor.hunger)

  // Check passive tasks completed
  const tasksCompleted: string[] = []
  const taskDuration = 5 * 60 * 1000 // 5 min
  for (const mod of modules) {
    if (mod.task_started_at) {
      const taskStart = new Date(mod.task_started_at).getTime()
      if (now - taskStart >= taskDuration) {
        tasksCompleted.push(mod.module_type)
      }
    }
  }

  return { elapsedSeconds, staminaGained, hungerGained, tasksCompleted }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}
