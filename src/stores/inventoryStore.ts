import { create } from 'zustand'
import type { GearItem, Materials } from '../lib/types'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'
import { useSurvivorStore } from './survivorStore'
import { rollAffixes, generateItemLevel } from '../lib/itemgen'
import { RECIPE_MAP } from '../data/recipes'

interface InventoryState {
  gear: GearItem[]
  materials: Materials | null
  loading: boolean
  fetchGear: () => Promise<void>
  fetchMaterials: () => Promise<void>
  equipItem: (itemId: string, survivorId: string) => Promise<void>
  unequipItem: (itemId: string) => Promise<void>
  transferToLocker: (itemId: string) => Promise<void>
  transferToSurvivor: (itemId: string, survivorId: string) => Promise<void>
  salvageItem: (itemId: string) => Promise<void>
  craftItem: (recipeId: string) => Promise<void>
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  gear: [],
  materials: null,
  loading: false,

  fetchGear: async () => {
    const profile = useAuthStore.getState().profile
    if (!profile) return
    set({ loading: true })
    const { data } = await supabase
      .from('gear_items')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
    set({ gear: (data ?? []) as GearItem[], loading: false })
  },

  fetchMaterials: async () => {
    const profile = useAuthStore.getState().profile
    if (!profile) return
    const { data } = await supabase
      .from('materials')
      .select('*')
      .eq('profile_id', profile.id)
      .single()
    if (data) set({ materials: data as Materials })
  },

  equipItem: async (itemId, survivorId) => {
    const item = get().gear.find((g) => g.id === itemId)
    if (!item) return

    // Unequip any item in the same slot on this survivor
    const existing = get().gear.find(
      (g) => g.survivor_id === survivorId && g.slot === item.slot && g.is_equipped && g.id !== itemId
    )
    if (existing) {
      await supabase.from('gear_items').update({ is_equipped: false }).eq('id', existing.id)
    }

    await supabase
      .from('gear_items')
      .update({ survivor_id: survivorId, is_equipped: true })
      .eq('id', itemId)

    await get().fetchGear()
  },

  unequipItem: async (itemId) => {
    await supabase.from('gear_items').update({ is_equipped: false }).eq('id', itemId)
    await get().fetchGear()
  },

  transferToLocker: async (itemId) => {
    await supabase
      .from('gear_items')
      .update({ survivor_id: null, is_equipped: false })
      .eq('id', itemId)
    await get().fetchGear()
  },

  transferToSurvivor: async (itemId, survivorId) => {
    await supabase
      .from('gear_items')
      .update({ survivor_id: survivorId, is_equipped: false })
      .eq('id', itemId)
    await get().fetchGear()
  },

  salvageItem: async (itemId) => {
    const item = get().gear.find((g) => g.id === itemId)
    if (!item) return

    const profile = useAuthStore.getState().profile
    if (!profile) return

    // Salvage returns scrap based on rarity
    const scrapReturn: Record<string, number> = { common: 5, uncommon: 12, rare: 25, epic: 50, relic: 100 }
    const partsReturn: Record<string, number> = { common: 2, uncommon: 5, rare: 10, epic: 20, relic: 40 }

    const mat = get().materials
    if (mat) {
      await supabase.from('materials').update({
        scrap: mat.scrap + (scrapReturn[item.rarity] ?? 5),
        parts: mat.parts + (partsReturn[item.rarity] ?? 2),
      }).eq('profile_id', profile.id)
    }

    await supabase.from('gear_items').delete().eq('id', itemId)
    await Promise.all([get().fetchGear(), get().fetchMaterials()])
  },

  craftItem: async (recipeId) => {
    const recipe = RECIPE_MAP[recipeId]
    if (!recipe) return

    const profile = useAuthStore.getState().profile
    if (!profile) return

    const mat = get().materials
    if (!mat) return

    // Check materials
    const costs = recipe.materials
    if ((costs.scrap ?? 0) > mat.scrap) throw new Error('Not enough Scrap')
    if ((costs.parts ?? 0) > mat.parts) throw new Error('Not enough Parts')
    if ((costs.cloth ?? 0) > mat.cloth) throw new Error('Not enough Cloth')
    if ((costs.alloy ?? 0) > mat.alloy) throw new Error('Not enough Alloy')
    if ((costs.relic_fragments ?? 0) > mat.relic_fragments) throw new Error('Not enough Relic Fragments')

    // Deduct materials
    await supabase.from('materials').update({
      scrap: mat.scrap - (costs.scrap ?? 0),
      parts: mat.parts - (costs.parts ?? 0),
      cloth: mat.cloth - (costs.cloth ?? 0),
      alloy: mat.alloy - (costs.alloy ?? 0),
      relic_fragments: mat.relic_fragments - (costs.relic_fragments ?? 0),
    }).eq('profile_id', profile.id)

    // Generate the item
    const affixes = rollAffixes(recipe.output.rarity)
    const activeSurvivor = useSurvivorStore.getState().activeSurvivor

    await supabase.from('gear_items').insert({
      profile_id: profile.id,
      survivor_id: activeSurvivor?.id ?? null,
      slot: recipe.output.slot,
      is_equipped: false,
      base_item_id: recipe.output.baseItemId,
      rarity: recipe.output.rarity,
      level: generateItemLevel(recipe.output.tier),
      affixes,
    })

    await Promise.all([get().fetchGear(), get().fetchMaterials()])
  },
}))
