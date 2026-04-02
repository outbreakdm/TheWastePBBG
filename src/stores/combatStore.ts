import { create } from 'zustand'
import type { Region } from '../lib/types'
import type { EnemyDef } from '../data/enemies'
import type { CombatResult, CombatTurn } from '../lib/combat'
import { simulateCombat } from '../lib/combat'
import { generateSeed } from '../lib/rng'
import { getEnemiesForNode, getBoss } from '../data/enemies'
import { useSurvivorStore } from './survivorStore'
import { useInventoryStore } from './inventoryStore'
import { useMapStore } from './mapStore'
import { useAuthStore } from './authStore'
import { supabase } from '../lib/supabase'
import { ITEM_MAP } from '../data/items'
import { LOOT_LOSS_ON_DEATH } from '../lib/constants'
import type { NodeType } from '../data/nodes'

type CombatPhase = 'idle' | 'pre_run' | 'fighting' | 'result'

interface CombatState {
  phase: CombatPhase
  region: Region | null
  sector: number
  nodeIndex: number
  nodeType: NodeType | null
  enemy: EnemyDef | null
  seed: number
  turns: CombatTurn[]
  currentTurnIndex: number
  result: CombatResult | null
  staminaCost: number

  startPreRun: (region: Region, sector: number, nodeIndex: number, nodeType: NodeType, staminaCost: number) => void
  confirmRun: () => Promise<void>
  advanceTurn: () => void
  skipToEnd: () => void
  collectAndReturn: () => Promise<void>
  reset: () => void
}

export const useCombatStore = create<CombatState>((set, get) => ({
  phase: 'idle',
  region: null,
  sector: 0,
  nodeIndex: 0,
  nodeType: null,
  enemy: null,
  seed: 0,
  turns: [],
  currentTurnIndex: 0,
  result: null,
  staminaCost: 0,

  startPreRun: (region, sector, nodeIndex, nodeType, staminaCost) => {
    // Pick enemy
    let enemy: EnemyDef | undefined
    if (nodeType === 'boss') {
      enemy = getBoss(region)
    } else {
      const candidates = getEnemiesForNode(region, sector)
      enemy = candidates[0]
    }

    if (!enemy) return

    set({
      phase: 'pre_run',
      region,
      sector,
      nodeIndex,
      nodeType,
      enemy,
      seed: generateSeed(),
      turns: [],
      currentTurnIndex: 0,
      result: null,
      staminaCost,
    })
  },

  confirmRun: async () => {
    const { enemy, seed, staminaCost, region, sector, nodeIndex } = get()
    const survivor = useSurvivorStore.getState().activeSurvivor
    if (!enemy || !survivor || !region) return

    // Check stamina
    if (survivor.stamina < staminaCost) return

    // Deduct stamina
    const newStamina = survivor.stamina - staminaCost
    await supabase.from('survivors').update({ stamina: newStamina }).eq('id', survivor.id)

    // Increase hunger slightly
    const hungerIncrease = Math.ceil(staminaCost * 0.3)
    const newHunger = Math.min(100, survivor.hunger + hungerIncrease)
    await supabase.from('survivors').update({ hunger: newHunger }).eq('id', survivor.id)

    // Get gear bonuses from equipped items
    const gear = useInventoryStore.getState().gear.filter(
      (g) => g.survivor_id === survivor.id && g.is_equipped
    )
    let weaponAtk = 0, armorGear = 0, gearHp = 0, gearStamina = 0
    for (const g of gear) {
      const base = ITEM_MAP[g.base_item_id]
      if (base) {
        weaponAtk += base.baseAtk ?? 0
        armorGear += base.baseArmor ?? 0
        gearHp += base.baseHp ?? 0
        gearStamina += base.baseStamina ?? 0
      }
    }

    // Hunger penalty
    const hungerPenalty = newHunger >= 75 ? 0.7 : newHunger >= 50 ? 0.85 : 1.0

    const result = simulateCombat({
      survivor: { ...survivor, stamina: newStamina, hunger: newHunger, hp: Math.floor(survivor.hp * hungerPenalty) },
      enemy,
      seed,
      weaponAtk,
      armorGear,
      gearHp,
      gearStamina,
    })

    // Record combat run
    const profile = useAuthStore.getState().profile
    if (profile) {
      await supabase.from('combat_runs').insert({
        profile_id: profile.id,
        survivor_id: survivor.id,
        region,
        sector,
        node_index: nodeIndex,
        seed,
        result: result.outcome,
        loot_json: { loot: result.loot },
        stamina_spent: staminaCost,
        hp_lost: result.hpLost,
        duration_ms: result.durationMs,
      })
    }

    set({
      phase: 'fighting',
      turns: result.turns,
      currentTurnIndex: 0,
      result,
    })
  },

  advanceTurn: () => {
    const { currentTurnIndex, turns } = get()
    if (currentTurnIndex < turns.length - 1) {
      set({ currentTurnIndex: currentTurnIndex + 1 })
    } else {
      set({ phase: 'result' })
    }
  },

  skipToEnd: () => {
    set({ phase: 'result', currentTurnIndex: get().turns.length - 1 })
  },

  collectAndReturn: async () => {
    const { result, region, sector, nodeIndex } = get()
    const survivor = useSurvivorStore.getState().activeSurvivor
    const profile = useAuthStore.getState().profile
    if (!result || !survivor || !profile || !region) return

    if (result.outcome === 'victory') {
      // Award XP
      const newXp = survivor.xp + result.xpGained
      await supabase.from('survivors').update({
        xp: newXp,
        hp: Math.max(1, survivor.hp - result.hpLost),
      }).eq('id', survivor.id)

      // Award material loot
      const matLoot = result.loot.filter((l) => l.type === 'material')
      if (matLoot.length > 0) {
        const materials = useInventoryStore.getState().materials
        if (materials) {
          const matRecord = materials as unknown as Record<string, number>
          const updates: Record<string, number> = {}
          for (const drop of matLoot) {
            if (drop.id in matRecord && typeof matRecord[drop.id] === 'number') {
              updates[drop.id] = (updates[drop.id] ?? matRecord[drop.id]) + drop.quantity
            }
          }
          if (Object.keys(updates).length > 0) {
            await supabase.from('materials').update(updates).eq('profile_id', profile.id)
          }
        }
      }

      // Award gear loot
      const gearLoot = result.loot.filter((l) => l.type === 'gear')
      for (const drop of gearLoot) {
        await supabase.from('gear_items').insert({
          profile_id: profile.id,
          survivor_id: survivor.id,
          slot: drop.slot,
          is_equipped: false,
          base_item_id: drop.id,
          rarity: drop.rarity ?? 'common',
          level: drop.level ?? 1,
          affixes: drop.affixes ?? [],
        })
      }

      // Mark node cleared
      await useMapStore.getState().markCleared(region, sector, nodeIndex)
    } else {
      // Defeat: lose HP, apply percentage loot loss
      const lostPct = LOOT_LOSS_ON_DEATH
      const partialMats = result.loot.filter((l) => l.type === 'material')
      // Only award partial materials
      const materials = useInventoryStore.getState().materials
      if (materials && partialMats.length > 0) {
        const matRecord = materials as unknown as Record<string, number>
        const updates: Record<string, number> = {}
        for (const drop of partialMats) {
          const kept = Math.floor(drop.quantity * (1 - lostPct))
          if (kept > 0 && drop.id in matRecord && typeof matRecord[drop.id] === 'number') {
            updates[drop.id] = (updates[drop.id] ?? matRecord[drop.id]) + kept
          }
        }
        if (Object.keys(updates).length > 0) {
          await supabase.from('materials').update(updates).eq('profile_id', profile.id)
        }
      }

      // HP goes to 1 on defeat
      await supabase.from('survivors').update({ hp: 1 }).eq('id', survivor.id)
    }

    // Refresh stores
    await Promise.all([
      useSurvivorStore.getState().fetchSurvivors(),
      useInventoryStore.getState().fetchGear(),
      useInventoryStore.getState().fetchMaterials(),
    ])

    set({ phase: 'idle' })
  },

  reset: () => {
    set({
      phase: 'idle', region: null, sector: 0, nodeIndex: 0, nodeType: null,
      enemy: null, seed: 0, turns: [], currentTurnIndex: 0, result: null, staminaCost: 0,
    })
  },
}))
