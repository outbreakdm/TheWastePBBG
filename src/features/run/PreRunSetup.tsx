import { useCombatStore } from '../../stores/combatStore'
import { useSurvivorStore } from '../../stores/survivorStore'
import { NODE_TYPES } from '../../data/nodes'
import { REGION_MAP } from '../../data/regions'
import { useState } from 'react'

export function PreRunSetup() {
  const { region, sector, nodeIndex, nodeType, enemy, staminaCost, confirmRun, reset } = useCombatStore()
  const activeSurvivor = useSurvivorStore((s) => s.activeSurvivor)
  const [loading, setLoading] = useState(false)

  if (!region || !nodeType || !enemy || !activeSurvivor) return null

  const regionDef = REGION_MAP[region]
  const nodeDef = NODE_TYPES[nodeType]
  const canAfford = activeSurvivor.stamina >= staminaCost

  const handleConfirm = async () => {
    setLoading(true)
    await confirmRun()
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <button onClick={reset} className="text-sm text-gray-500 active:text-gray-300">
        &larr; Back
      </button>

      <div className={`rounded-xl p-4 border border-gray-800 ${regionDef.bgColor}`}>
        <div className="text-xs text-gray-500 mb-1">
          {regionDef.name} — Sector {sector} — Node {nodeIndex + 1}
        </div>
        <h3 className="text-lg font-bold text-gray-100">{nodeDef.label}</h3>
        <p className="text-sm text-gray-500 mt-1">{nodeDef.description}</p>
      </div>

      {/* Enemy info */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h4 className="text-sm font-semibold text-danger-400 mb-2">Threat: {enemy.name}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">HP</span><span className="text-gray-300">{enemy.hp}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">ATK</span><span className="text-gray-300">{enemy.atk}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">DEF</span><span className="text-gray-300">{enemy.def}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Speed</span><span className="text-gray-300">{enemy.speed}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">XP Reward</span><span className="text-xp">{enemy.xpReward}</span></div>
        </div>
      </div>

      {/* Cost summary */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Stamina Cost</span>
          <span className={canAfford ? 'text-stamina' : 'text-danger-400'}>
            {staminaCost} / {activeSurvivor.stamina}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Current HP</span>
          <span className="text-hp">{activeSurvivor.hp} / {activeSurvivor.hp_max}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Hunger</span>
          <span className="text-hunger">{activeSurvivor.hunger}/100</span>
        </div>
        {activeSurvivor.hunger >= 50 && (
          <p className="text-xs text-hunger">Warning: High hunger reduces combat effectiveness</p>
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!canAfford || loading}
        className="w-full py-3 bg-brand-500 active:bg-brand-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-40"
      >
        {loading ? 'Engaging...' : !canAfford ? 'Not enough stamina' : 'Enter Combat'}
      </button>
    </div>
  )
}
