import { create } from 'zustand'
import type { Survivor, SurvivorClass } from '../lib/types'
import { supabase } from '../lib/supabase'
import { CLASS_BASE_STATS } from '../lib/constants'
import { computeDerivedStats } from '../lib/formulas'
import { useAuthStore } from './authStore'
import { TRAITS } from '../data/traits'

interface SurvivorState {
  survivors: Survivor[]
  activeSurvivor: Survivor | null
  loading: boolean
  fetchSurvivors: () => Promise<void>
  createSurvivor: (name: string, survivorClass: SurvivorClass) => Promise<Survivor>
  setActiveSurvivor: (id: string) => Promise<void>
  allocateStat: (survivorId: string, stat: keyof typeof CLASS_BASE_STATS.scavenger) => Promise<void>
  equipSkill: (survivorId: string, slotIndex: number, skillId: string | null) => Promise<void>
  refreshActive: () => void
}

function rollStartingTrait(): string {
  const idx = Math.floor(Math.random() * TRAITS.length)
  return TRAITS[idx].id
}

export const useSurvivorStore = create<SurvivorState>((set, get) => ({
  survivors: [],
  activeSurvivor: null,
  loading: false,

  fetchSurvivors: async () => {
    set({ loading: true })
    const profile = useAuthStore.getState().profile
    if (!profile) { set({ loading: false }); return }

    const { data } = await supabase
      .from('survivors')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: true })

    const survivors = (data ?? []) as Survivor[]
    const active = profile.active_survivor_id
      ? survivors.find((s) => s.id === profile.active_survivor_id) ?? null
      : null

    set({ survivors, activeSurvivor: active, loading: false })
  },

  createSurvivor: async (name, survivorClass) => {
    const profile = useAuthStore.getState().profile
    if (!profile) throw new Error('Not authenticated')

    const base = CLASS_BASE_STATS[survivorClass]
    const derived = computeDerivedStats(base)
    const traitId = rollStartingTrait()

    const { data, error } = await supabase
      .from('survivors')
      .insert({
        profile_id: profile.id,
        name,
        class: survivorClass,
        str: base.str,
        def: base.def,
        agi: base.agi,
        per: base.per,
        vit: base.vit,
        wil: base.wil,
        stamina: Math.floor(derived.maxStamina),
        stamina_max: Math.floor(derived.maxStamina),
        hp: Math.floor(derived.maxHp),
        hp_max: Math.floor(derived.maxHp),
        hunger: 0,
        trait_ids: [traitId],
        skill_slots: [],
        stat_points: 0,
        level: 1,
        xp: 0,
        is_alive: true,
      })
      .select()
      .single()

    if (error) throw error

    const survivor = data as Survivor

    // If this is the first survivor, set as active
    const { survivors } = get()
    if (survivors.length === 0) {
      await supabase.from('profiles').update({ active_survivor_id: survivor.id }).eq('id', profile.id)
      useAuthStore.getState().fetchProfile()
      set({ activeSurvivor: survivor })
    }

    set({ survivors: [...get().survivors, survivor] })
    return survivor
  },

  setActiveSurvivor: async (id) => {
    const profile = useAuthStore.getState().profile
    if (!profile) return

    await supabase.from('profiles').update({ active_survivor_id: id }).eq('id', profile.id)
    useAuthStore.getState().fetchProfile()

    const survivor = get().survivors.find((s) => s.id === id) ?? null
    set({ activeSurvivor: survivor })
  },

  allocateStat: async (survivorId, stat) => {
    const survivor = get().survivors.find((s) => s.id === survivorId)
    if (!survivor || survivor.stat_points <= 0) return

    const newVal = survivor[stat] + 1
    const newPoints = survivor.stat_points - 1
    const newBase = { str: survivor.str, def: survivor.def, agi: survivor.agi, per: survivor.per, vit: survivor.vit, wil: survivor.wil, [stat]: newVal }
    const derived = computeDerivedStats(newBase)

    const updates: Partial<Survivor> = {
      [stat]: newVal,
      stat_points: newPoints,
      stamina_max: Math.floor(derived.maxStamina),
      hp_max: Math.floor(derived.maxHp),
    }

    await supabase.from('survivors').update(updates).eq('id', survivorId)

    const updated = { ...survivor, ...updates } as Survivor
    const survivors = get().survivors.map((s) => s.id === survivorId ? updated : s)
    set({
      survivors,
      activeSurvivor: get().activeSurvivor?.id === survivorId ? updated : get().activeSurvivor,
    })
  },

  equipSkill: async (survivorId, slotIndex, skillId) => {
    const survivor = get().survivors.find((s) => s.id === survivorId)
    if (!survivor) return

    const slots = [...survivor.skill_slots]
    // Ensure array has at least 3 slots
    while (slots.length < 3) slots.push('')

    // Remove skill from any existing slot if equipping
    if (skillId) {
      const existingIdx = slots.indexOf(skillId)
      if (existingIdx >= 0) slots[existingIdx] = ''
    }

    slots[slotIndex] = skillId ?? ''

    await supabase.from('survivors').update({ skill_slots: slots }).eq('id', survivorId)

    const updated = { ...survivor, skill_slots: slots }
    const survivors = get().survivors.map((s) => s.id === survivorId ? updated : s)
    set({
      survivors,
      activeSurvivor: get().activeSurvivor?.id === survivorId ? updated : get().activeSurvivor,
    })
  },

  refreshActive: () => {
    const profile = useAuthStore.getState().profile
    if (!profile?.active_survivor_id) return
    const active = get().survivors.find((s) => s.id === profile.active_survivor_id) ?? null
    set({ activeSurvivor: active })
  },
}))
