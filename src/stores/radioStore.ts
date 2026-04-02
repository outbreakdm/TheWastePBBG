import { create } from 'zustand'
import type { RadioEvent } from '../lib/types'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'
import { useSurvivorStore } from './survivorStore'
import { useInventoryStore } from './inventoryStore'
import { useShelterStore } from './shelterStore'
import { getEventsForTier, type EventTemplate } from '../data/events'

interface RadioState {
  events: RadioEvent[]
  unreadCount: number
  loading: boolean
  fetchEvents: () => Promise<void>
  generateEvent: () => Promise<void>
  markRead: (eventId: string) => Promise<void>
  respondToEvent: (event: RadioEvent) => Promise<{ success: boolean; message: string }>
}

export const useRadioStore = create<RadioState>((set, get) => ({
  events: [],
  unreadCount: 0,
  loading: false,

  fetchEvents: async () => {
    const profile = useAuthStore.getState().profile
    if (!profile) return
    set({ loading: true })
    const { data } = await supabase
      .from('radio_events')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(50)
    const events = (data ?? []) as RadioEvent[]
    set({
      events,
      unreadCount: events.filter((e) => !e.is_read).length,
      loading: false,
    })
  },

  generateEvent: async () => {
    const profile = useAuthStore.getState().profile
    if (!profile) return

    const radioModule = useShelterStore.getState().getModule('radio')
    const radioTier = radioModule?.tier ?? 1
    const templates = getEventsForTier(radioTier)
    if (templates.length === 0) return

    const template = templates[Math.floor(Math.random() * templates.length)]

    await supabase.from('radio_events').insert({
      profile_id: profile.id,
      event_type: template.category,
      payload: {
        templateId: template.id,
        title: template.title,
        body: template.body,
        actionable: template.actionable,
        actionLabel: template.actionLabel,
        staminaCost: template.staminaCost,
        rewards: template.rewards,
      },
      is_read: false,
    })

    await get().fetchEvents()
  },

  markRead: async (eventId) => {
    await supabase.from('radio_events').update({ is_read: true }).eq('id', eventId)
    const events = get().events.map((e) => e.id === eventId ? { ...e, is_read: true } : e)
    set({ events, unreadCount: events.filter((e) => !e.is_read).length })
  },

  respondToEvent: async (event) => {
    const profile = useAuthStore.getState().profile
    const survivor = useSurvivorStore.getState().activeSurvivor
    if (!profile || !survivor) return { success: false, message: 'No active survivor' }

    const payload = event.payload as unknown as EventTemplate & { templateId: string }
    if (!payload.actionable) return { success: false, message: 'Not actionable' }

    // Check stamina
    const cost = payload.staminaCost ?? 0
    if (survivor.stamina < cost) return { success: false, message: 'Not enough stamina' }

    // Deduct stamina
    await supabase.from('survivors').update({
      stamina: survivor.stamina - cost,
    }).eq('id', survivor.id)

    // Award rewards
    const rewards = payload.rewards
    if (rewards) {
      const materials = useInventoryStore.getState().materials
      if (materials) {
        const matUpdates: Record<string, number> = {}
        for (const [key, val] of Object.entries(rewards)) {
          if (key === 'xp') continue
          if (key in materials) {
            matUpdates[key] = (materials as unknown as Record<string, number>)[key] + (val as number)
          }
        }
        if (Object.keys(matUpdates).length > 0) {
          await supabase.from('materials').update(matUpdates).eq('profile_id', profile.id)
        }
      }

      // Award XP
      if (rewards.xp) {
        await supabase.from('survivors').update({
          xp: survivor.xp + rewards.xp,
        }).eq('id', survivor.id)
      }
    }

    // Mark event as read (consumed)
    await supabase.from('radio_events').update({ is_read: true }).eq('id', event.id)

    // Refresh stores
    await Promise.all([
      useSurvivorStore.getState().fetchSurvivors(),
      useInventoryStore.getState().fetchMaterials(),
      get().fetchEvents(),
    ])

    return { success: true, message: 'Contract complete!' }
  },
}))
