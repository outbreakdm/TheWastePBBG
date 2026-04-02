import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useSurvivorStore } from '../stores/survivorStore'
import { useShelterStore } from '../stores/shelterStore'
import { supabase } from '../lib/supabase'
import { calculateOfflineProgress, type OfflineResult } from '../lib/offline'

export function useOfflineProgress() {
  const profile = useAuthStore((s) => s.profile)
  const { activeSurvivor, fetchSurvivors } = useSurvivorStore()
  const { modules, fetchModules } = useShelterStore()
  const [result, setResult] = useState<OfflineResult | null>(null)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (!profile || !activeSurvivor || modules.length === 0 || applied) return

    const offlineResult = calculateOfflineProgress(
      profile.last_seen_at,
      activeSurvivor,
      modules,
    )

    // Only show if meaningful time passed (>1 min)
    if (offlineResult.elapsedSeconds < 60) {
      setApplied(true)
      return
    }

    setResult(offlineResult)
  }, [profile, activeSurvivor, modules, applied])

  const applyProgress = async () => {
    if (!result || !profile || !activeSurvivor) return

    // Apply stamina gain
    if (result.staminaGained > 0) {
      await supabase.from('survivors').update({
        stamina: Math.min(activeSurvivor.stamina_max, activeSurvivor.stamina + result.staminaGained),
      }).eq('id', activeSurvivor.id)
    }

    // Apply hunger gain
    if (result.hungerGained > 0) {
      await supabase.from('survivors').update({
        hunger: Math.min(100, activeSurvivor.hunger + result.hungerGained),
      }).eq('id', activeSurvivor.id)
    }

    // Clear completed tasks
    for (const moduleType of result.tasksCompleted) {
      const mod = modules.find((m) => m.module_type === moduleType)
      if (mod) {
        await supabase.from('shelter_modules').update({
          task_started_at: null,
          task_recipe_id: null,
        }).eq('id', mod.id)
      }
    }

    // Update last_seen_at
    await supabase.from('profiles').update({
      last_seen_at: new Date().toISOString(),
    }).eq('id', profile.id)

    // Refresh stores
    await Promise.all([
      fetchSurvivors(),
      fetchModules(),
      useAuthStore.getState().fetchProfile(),
    ])

    setResult(null)
    setApplied(true)
  }

  const dismiss = () => {
    // Update last_seen without applying gains (shouldn't normally happen, but safety valve)
    setResult(null)
    setApplied(true)
    if (profile) {
      supabase.from('profiles').update({
        last_seen_at: new Date().toISOString(),
      }).eq('id', profile.id)
    }
  }

  return { result, applyProgress, dismiss }
}
