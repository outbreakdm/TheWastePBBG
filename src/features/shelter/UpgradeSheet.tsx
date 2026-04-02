import { useState } from 'react'
import type { ShelterModule } from '../../lib/types'
import { SheetModal } from '../../components/ui/SheetModal'
import { MODULE_MAP, getModuleBonus } from '../../data/modules'
import { useShelterStore } from '../../stores/shelterStore'
import { useInventoryStore } from '../../stores/inventoryStore'

interface UpgradeSheetProps {
  module: ShelterModule | null
  onClose: () => void
}

const MAT_LABELS: Record<string, string> = {
  scrap: 'Scrap', parts: 'Parts', cloth: 'Cloth', alloy: 'Alloy', relic_fragments: 'Relic Frags',
}

export function UpgradeSheet({ module, onClose }: UpgradeSheetProps) {
  const { upgradeModule, collectTask } = useShelterStore()
  const materials = useInventoryStore((s) => s.materials)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!module) return null

  const def = MODULE_MAP[module.module_type]
  const currentBonus = getModuleBonus(module.module_type, module.tier)
  const canUpgrade = module.tier < 5
  const nextCost = canUpgrade ? def.upgradeCosts[module.tier] : null
  const nextBonus = canUpgrade ? getModuleBonus(module.module_type, module.tier + 1) : null
  const hasTask = !!module.task_started_at

  const canAfford = nextCost && materials ? (
    materials.scrap >= nextCost.scrap &&
    materials.parts >= nextCost.parts &&
    materials.cloth >= nextCost.cloth &&
    materials.alloy >= nextCost.alloy &&
    materials.relic_fragments >= nextCost.relic_fragments
  ) : false

  const handleUpgrade = async () => {
    setError('')
    setLoading(true)
    try {
      await upgradeModule(module.module_type)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upgrade failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCollect = async () => {
    setLoading(true)
    const success = await collectTask(module.module_type)
    setLoading(false)
    if (success) onClose()
    else setError('Task not ready yet')
  }

  return (
    <SheetModal open={!!module} onClose={onClose} title={def.name}>
      <div className="space-y-4">
        <p className="text-sm text-gray-400">{def.description}</p>

        {/* Current tier */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-medium">Current: Tier {module.tier}</span>
            <span className="text-xs text-brand-300">{formatBonus(module.module_type, currentBonus)}</span>
          </div>
          <p className="text-xs text-gray-500">{def.tierDescriptions[module.tier - 1]}</p>
        </div>

        {/* Task section */}
        {hasTask && (
          <button
            onClick={handleCollect}
            disabled={loading}
            className="w-full py-2.5 bg-success-500/20 text-success-400 text-sm font-semibold rounded-lg active:bg-success-500/30 transition-colors disabled:opacity-50"
          >
            {loading ? 'Collecting...' : 'Collect Task'}
          </button>
        )}

        {/* Next tier preview */}
        {canUpgrade && nextCost && nextBonus !== null && (
          <>
            <div className="bg-brand-500/5 border border-brand-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-brand-400 font-medium">Next: Tier {module.tier + 1}</span>
                <span className="text-xs text-brand-300">{formatBonus(module.module_type, nextBonus)}</span>
              </div>
              <p className="text-xs text-gray-500">{def.tierDescriptions[module.tier]}</p>
            </div>

            {/* Cost */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Upgrade Cost</p>
              <div className="grid grid-cols-5 gap-1">
                {Object.entries(nextCost).filter(([, v]) => v > 0).map(([mat, amount]) => {
                  const have = materials ? Number(materials[mat as keyof typeof materials] ?? 0) : 0
                  const enough = have >= amount
                  return (
                    <div key={mat} className={`text-center text-[10px] rounded p-1.5 ${enough ? 'bg-gray-800 text-gray-300' : 'bg-danger-600/10 text-danger-400'}`}>
                      <div>{MAT_LABELS[mat] ?? mat}</div>
                      <div className="font-semibold">{have}/{amount}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {error && <p className="text-danger-400 text-sm">{error}</p>}

            <button
              onClick={handleUpgrade}
              disabled={!canAfford || loading}
              className="w-full py-3 bg-brand-500 active:bg-brand-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-40"
            >
              {loading ? 'Upgrading...' : !canAfford ? 'Not enough materials' : `Upgrade to Tier ${module.tier + 1}`}
            </button>
          </>
        )}

        {!canUpgrade && (
          <div className="text-center py-4">
            <span className="text-success-400 text-sm font-semibold">Max tier reached</span>
          </div>
        )}
      </div>
    </SheetModal>
  )
}

function formatBonus(type: string, value: number): string {
  switch (type) {
    case 'bedroll': return `+${((value - 1) * 100).toFixed(0)}% stamina regen`
    case 'cookfire': return `-${((1 - value) * 100).toFixed(0)}% hunger drain`
    case 'workbench': return `Tier ${value} recipes`
    case 'locker': return `${value} slots`
    case 'barricade': return `-${(value * 100).toFixed(0)}% loot loss`
    case 'radio': return `Tier ${value} events`
    default: return String(value)
  }
}
