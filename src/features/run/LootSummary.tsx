import { useState } from 'react'
import { useCombatStore } from '../../stores/combatStore'
import { LOOT_LOSS_ON_DEATH } from '../../lib/constants'
import { rarityTextClass } from '../../components/ui/RarityBorder'
import type { Rarity } from '../../lib/types'

export function LootSummary() {
  const { result, enemy, collectAndReturn } = useCombatStore()
  const [collecting, setCollecting] = useState(false)

  if (!result || !enemy) return null

  const isVictory = result.outcome === 'victory'

  const handleCollect = async () => {
    setCollecting(true)
    await collectAndReturn()
    setCollecting(false)
  }

  return (
    <div className="space-y-4">
      {/* Outcome banner */}
      <div className={`rounded-xl p-6 text-center border ${
        isVictory
          ? 'bg-success-500/10 border-success-500/30'
          : 'bg-danger-500/10 border-danger-500/30'
      }`}>
        <h2 className={`text-2xl font-bold ${isVictory ? 'text-success-400' : 'text-danger-400'}`}>
          {isVictory ? 'Victory!' : 'Defeated'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isVictory
            ? `${enemy.name} has been defeated.`
            : 'Your survivor was forced to retreat.'
          }
        </p>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">XP Gained</span>
          <span className="text-xp font-semibold">+{result.xpGained}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">HP Lost</span>
          <span className="text-hp">-{result.hpLost}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Turns</span>
          <span className="text-gray-300">{result.turns.length}</span>
        </div>
      </div>

      {/* Loot */}
      {result.loot.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h4 className="text-sm font-semibold text-gray-200 mb-2">
            Loot {!isVictory && <span className="text-danger-400 text-xs">({Math.floor(LOOT_LOSS_ON_DEATH * 100)}% lost)</span>}
          </h4>
          <div className="space-y-1.5">
            {result.loot.map((drop, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1">
                <span className={drop.rarity ? rarityTextClass(drop.rarity as Rarity) : 'text-gray-300'}>
                  {drop.name}
                  {drop.rarity && <span className="text-gray-500 ml-1 capitalize">({drop.rarity})</span>}
                </span>
                <span className="text-gray-400">
                  {drop.type === 'material' ? `x${drop.quantity}` : 'Lv ' + drop.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleCollect}
        disabled={collecting}
        className="w-full py-3 bg-brand-500 active:bg-brand-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {collecting ? 'Collecting...' : 'Collect & Return'}
      </button>
    </div>
  )
}
