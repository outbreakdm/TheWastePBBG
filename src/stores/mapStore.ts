import { create } from 'zustand'
import type { Region, WorldProgress } from '../lib/types'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'

interface MapState {
  progress: WorldProgress[]
  loading: boolean
  fetchProgress: () => Promise<void>
  markCleared: (region: Region, sector: number, nodeIndex: number) => Promise<void>
  isSectorCleared: (region: Region, sector: number, totalNodes: number) => boolean
  isNodeCleared: (region: Region, sector: number, nodeIndex: number) => boolean
  getHighestSector: (region: Region) => number
}

export const useMapStore = create<MapState>((set, get) => ({
  progress: [],
  loading: false,

  fetchProgress: async () => {
    const profile = useAuthStore.getState().profile
    if (!profile) return
    set({ loading: true })
    const { data } = await supabase
      .from('world_progress')
      .select('*')
      .eq('profile_id', profile.id)
    set({ progress: (data ?? []) as WorldProgress[], loading: false })
  },

  markCleared: async (region, sector, nodeIndex) => {
    const profile = useAuthStore.getState().profile
    if (!profile) return

    const existing = get().progress.find(
      (p) => p.region === region && p.sector === sector && p.node_index === nodeIndex
    )

    if (existing) {
      if (!existing.is_cleared) {
        await supabase.from('world_progress').update({ is_cleared: true }).eq('id', existing.id)
      }
    } else {
      await supabase.from('world_progress').insert({
        profile_id: profile.id,
        region,
        sector,
        node_index: nodeIndex,
        is_cleared: true,
      })
    }

    await get().fetchProgress()
  },

  isSectorCleared: (region, sector, totalNodes) => {
    const sectorProgress = get().progress.filter(
      (p) => p.region === region && p.sector === sector && p.is_cleared
    )
    return sectorProgress.length >= totalNodes
  },

  isNodeCleared: (region, sector, nodeIndex) => {
    return get().progress.some(
      (p) => p.region === region && p.sector === sector && p.node_index === nodeIndex && p.is_cleared
    )
  },

  getHighestSector: (region) => {
    const cleared = get().progress.filter((p) => p.region === region && p.is_cleared)
    if (cleared.length === 0) return 1
    const maxSector = Math.max(...cleared.map((p) => p.sector))
    return Math.min(maxSector + 1, 10)
  },
}))
