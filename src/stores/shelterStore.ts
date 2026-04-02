import { create } from 'zustand'
import type { ShelterModule, ModuleType } from '../lib/types'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'
import { useInventoryStore } from './inventoryStore'
import { MODULE_MAP } from '../data/modules'

interface ShelterState {
  modules: ShelterModule[]
  loading: boolean
  fetchModules: () => Promise<void>
  upgradeModule: (moduleType: ModuleType) => Promise<void>
  startTask: (moduleType: ModuleType, recipeId: string) => Promise<void>
  collectTask: (moduleType: ModuleType) => Promise<boolean>
  getModule: (type: ModuleType) => ShelterModule | undefined
}

export const useShelterStore = create<ShelterState>((set, get) => ({
  modules: [],
  loading: false,

  fetchModules: async () => {
    const profile = useAuthStore.getState().profile
    if (!profile) return
    set({ loading: true })
    const { data } = await supabase
      .from('shelter_modules')
      .select('*')
      .eq('profile_id', profile.id)
    set({ modules: (data ?? []) as ShelterModule[], loading: false })
  },

  upgradeModule: async (moduleType) => {
    const profile = useAuthStore.getState().profile
    if (!profile) return

    const mod = get().modules.find((m) => m.module_type === moduleType)
    if (!mod || mod.tier >= 5) return

    const moduleDef = MODULE_MAP[moduleType]
    const nextTier = mod.tier + 1
    const cost = moduleDef.upgradeCosts[nextTier - 1]

    // Check materials
    const materials = useInventoryStore.getState().materials
    if (!materials) return

    if (materials.scrap < cost.scrap) throw new Error('Not enough Scrap')
    if (materials.parts < cost.parts) throw new Error('Not enough Parts')
    if (materials.cloth < cost.cloth) throw new Error('Not enough Cloth')
    if (materials.alloy < cost.alloy) throw new Error('Not enough Alloy')
    if (materials.relic_fragments < cost.relic_fragments) throw new Error('Not enough Relic Fragments')

    // Deduct materials
    await supabase.from('materials').update({
      scrap: materials.scrap - cost.scrap,
      parts: materials.parts - cost.parts,
      cloth: materials.cloth - cost.cloth,
      alloy: materials.alloy - cost.alloy,
      relic_fragments: materials.relic_fragments - cost.relic_fragments,
    }).eq('profile_id', profile.id)

    // Upgrade tier
    await supabase.from('shelter_modules').update({ tier: nextTier }).eq('id', mod.id)

    await Promise.all([get().fetchModules(), useInventoryStore.getState().fetchMaterials()])
  },

  startTask: async (moduleType, recipeId) => {
    const mod = get().modules.find((m) => m.module_type === moduleType)
    if (!mod || mod.task_started_at) return

    await supabase.from('shelter_modules').update({
      task_started_at: new Date().toISOString(),
      task_recipe_id: recipeId,
    }).eq('id', mod.id)

    await get().fetchModules()
  },

  collectTask: async (moduleType) => {
    const mod = get().modules.find((m) => m.module_type === moduleType)
    if (!mod || !mod.task_started_at) return false

    // Check if task is complete (simple: 5 minutes per task)
    const started = new Date(mod.task_started_at).getTime()
    const elapsed = Date.now() - started
    const taskDuration = 5 * 60 * 1000 // 5 minutes

    if (elapsed < taskDuration) return false

    // Clear the task
    await supabase.from('shelter_modules').update({
      task_started_at: null,
      task_recipe_id: null,
    }).eq('id', mod.id)

    await get().fetchModules()
    return true
  },

  getModule: (type) => {
    return get().modules.find((m) => m.module_type === type)
  },
}))
