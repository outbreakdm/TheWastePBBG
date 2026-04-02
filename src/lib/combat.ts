import type { Survivor } from './types'
import type { EnemyDef, LootEntry } from '../data/enemies'
import { createRng, type SeededRng } from './rng'
import { computeDerivedStats } from './formulas'
import { ITEM_MAP } from '../data/items'
import { rollAffixes, generateItemLevel } from './itemgen'

export interface CombatConfig {
  survivor: Survivor
  enemy: EnemyDef
  seed: number
  weaponAtk: number
  armorGear: number
  gearHp: number
  gearStamina: number
}

export interface CombatTurn {
  actor: 'player' | 'enemy'
  action: string
  damage: number
  playerHp: number
  enemyHp: number
  isCrit?: boolean
  isDodge?: boolean
}

export interface CombatResult {
  outcome: 'victory' | 'defeat'
  turns: CombatTurn[]
  hpLost: number
  xpGained: number
  loot: LootDrop[]
  durationMs: number
}

export interface LootDrop {
  type: 'material' | 'gear'
  id: string
  name: string
  quantity: number
  rarity?: string
  affixes?: { type: string; value: number; tier: number }[]
  level?: number
  slot?: string
}

export function simulateCombat(config: CombatConfig): CombatResult {
  const startTime = performance.now()
  const rng = createRng(config.seed)

  const base = {
    str: config.survivor.str,
    def: config.survivor.def,
    agi: config.survivor.agi,
    per: config.survivor.per,
    vit: config.survivor.vit,
    wil: config.survivor.wil,
  }
  const derived = computeDerivedStats(base, config.gearHp, config.gearStamina, config.weaponAtk, config.armorGear)

  let playerHp = config.survivor.hp
  let enemyHp = config.enemy.hp
  const turns: CombatTurn[] = []

  const playerSpeed = base.agi + 5
  const enemySpeed = config.enemy.speed

  const maxTurns = 100

  for (let t = 0; t < maxTurns && playerHp > 0 && enemyHp > 0; t++) {
    // Determine who acts this turn based on speed
    const playerFirst = playerSpeed >= enemySpeed
      ? true
      : rng.chance(playerSpeed / (playerSpeed + enemySpeed))

    const actors = playerFirst
      ? (['player', 'enemy'] as const)
      : (['enemy', 'player'] as const)

    for (const actor of actors) {
      if (playerHp <= 0 || enemyHp <= 0) break

      if (actor === 'player') {
        // Player attacks enemy
        if (rng.chance(derived.dodgeChance)) {
          // Enemy dodges (not applicable on player turn, skip)
        }

        const isCrit = rng.chance(derived.critChance)
        const baseDmg = derived.meleePower
        const dmgReduction = config.enemy.def * 0.5
        let damage = Math.max(1, Math.floor(baseDmg - dmgReduction))
        if (isCrit) damage = Math.floor(damage * derived.critDamage)

        enemyHp = Math.max(0, enemyHp - damage)
        turns.push({
          actor: 'player',
          action: isCrit ? 'Critical hit!' : 'Attacks',
          damage,
          playerHp,
          enemyHp,
          isCrit,
        })
      } else {
        // Enemy attacks player
        const isDodge = rng.chance(derived.dodgeChance)
        if (isDodge) {
          turns.push({
            actor: 'enemy',
            action: 'Misses!',
            damage: 0,
            playerHp,
            enemyHp,
            isDodge: true,
          })
          continue
        }

        const baseDmg = config.enemy.atk
        const dmgReduction = derived.armor * 0.3
        const damage = Math.max(1, Math.floor(baseDmg - dmgReduction))

        playerHp = Math.max(0, playerHp - damage)
        turns.push({
          actor: 'enemy',
          action: 'Attacks',
          damage,
          playerHp,
          enemyHp,
        })
      }
    }
  }

  const outcome = playerHp > 0 ? 'victory' : 'defeat'
  const hpLost = config.survivor.hp - playerHp
  const xpGained = outcome === 'victory' ? config.enemy.xpReward : Math.floor(config.enemy.xpReward * 0.25)
  const loot = outcome === 'victory' ? rollLoot(config.enemy.lootTable, rng, config.enemy.tier) : []

  return {
    outcome,
    turns,
    hpLost,
    xpGained,
    loot,
    durationMs: Math.floor(performance.now() - startTime),
  }
}

function rollLoot(table: LootEntry[], rng: SeededRng, tier: number): LootDrop[] {
  const drops: LootDrop[] = []

  for (const entry of table) {
    if (!rng.chance(entry.chance)) continue

    if (entry.type === 'material') {
      const qty = rng.int(entry.minQty ?? 1, entry.maxQty ?? 1)
      drops.push({
        type: 'material',
        id: entry.id,
        name: entry.id.replace('_', ' '),
        quantity: qty,
      })
    } else if (entry.type === 'gear') {
      const baseDef = ITEM_MAP[entry.id]
      if (!baseDef) continue
      // Roll rarity based on tier
      const rarity = rollRarity(rng, tier)
      const affixes = rollAffixes(rarity)
      drops.push({
        type: 'gear',
        id: entry.id,
        name: baseDef.name,
        quantity: 1,
        rarity,
        affixes,
        level: generateItemLevel(baseDef.tier),
        slot: baseDef.slot,
      })
    }
  }

  return drops
}

function rollRarity(rng: SeededRng, tier: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'relic' {
  const r = rng.random()
  // Higher tier = better rarity chances
  const relicThreshold = 0.005 * tier
  const epicThreshold = relicThreshold + 0.02 * tier
  const rareThreshold = epicThreshold + 0.05 * tier
  const uncommonThreshold = rareThreshold + 0.15

  if (r < relicThreshold) return 'relic'
  if (r < epicThreshold) return 'epic'
  if (r < rareThreshold) return 'rare'
  if (r < uncommonThreshold) return 'uncommon'
  return 'common'
}
