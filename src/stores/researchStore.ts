import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'
import { RESEARCH_MAP, type ResearchNode } from '../data/research'

interface ResearchState {
  unlocked: Record<string, number> // nodeId → 1
  loading: boolean
  fetchResearch: () => void
  purchaseNode: (nodeId: string) => Promise<{ success: boolean; message: string }>
  isUnlocked: (nodeId: string) => boolean
  canUnlock: (node: ResearchNode) => boolean
}

export const useResearchStore = create<ResearchState>((set, get) => ({
  unlocked: {},
  loading: false,

  fetchResearch: () => {
    const profile = useAuthStore.getState().profile
    if (!profile) return
    set({ unlocked: profile.meta_research ?? {}, loading: false })
  },

  purchaseNode: async (nodeId) => {
    const profile = useAuthStore.getState().profile
    if (!profile) return { success: false, message: 'Not logged in' }

    const node = RESEARCH_MAP[nodeId]
    if (!node) return { success: false, message: 'Unknown research' }

    if (get().isUnlocked(nodeId)) return { success: false, message: 'Already researched' }
    if (!get().canUnlock(node)) return { success: false, message: 'Prerequisites not met' }

    // Check currencies
    if (profile.scrap_tokens < node.cost.scrap_tokens) {
      return { success: false, message: 'Not enough Scrap Tokens' }
    }
    if (node.cost.echo_shards && profile.echo_shards < node.cost.echo_shards) {
      return { success: false, message: 'Not enough Echo Shards' }
    }

    // Deduct currencies and add to meta_research
    const newResearch = { ...profile.meta_research, [nodeId]: 1 }
    const updates: Record<string, unknown> = {
      scrap_tokens: profile.scrap_tokens - node.cost.scrap_tokens,
      meta_research: newResearch,
    }
    if (node.cost.echo_shards) {
      updates.echo_shards = profile.echo_shards - node.cost.echo_shards
    }

    await supabase.from('profiles').update(updates).eq('id', profile.id)

    // Refresh profile and local state
    await useAuthStore.getState().fetchProfile()
    set({ unlocked: newResearch })

    return { success: true, message: `Researched: ${node.name}` }
  },

  isUnlocked: (nodeId) => {
    return !!get().unlocked[nodeId]
  },

  canUnlock: (node) => {
    const { isUnlocked } = get()
    return node.prerequisites.every((prereq) => isUnlocked(prereq))
  },
}))
