import { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useResearchStore } from '../../stores/researchStore'
import { RESEARCH_TREE, type ResearchNode } from '../../data/research'
import { SheetModal } from '../../components/ui/SheetModal'

const TIER_LABELS = ['', 'Tier I — Basics', 'Tier II — Advanced', 'Tier III — Elite', 'Tier IV — Endgame']

export function ResearchTree({ open, onClose }: { open: boolean; onClose: () => void }) {
  const profile = useAuthStore((s) => s.profile)
  const { unlocked, fetchResearch, purchaseNode, isUnlocked, canUnlock } = useResearchStore()
  const [selected, setSelected] = useState<ResearchNode | null>(null)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    if (open) fetchResearch()
  }, [open, fetchResearch])

  const tiers = [1, 2, 3, 4].map((t) => ({
    tier: t,
    label: TIER_LABELS[t],
    nodes: RESEARCH_TREE.filter((n) => n.tier === t),
  }))

  const handlePurchase = async (node: ResearchNode) => {
    setPurchasing(true)
    const res = await purchaseNode(node.id)
    setResult(res)
    setPurchasing(false)
  }

  const unlockedCount = Object.keys(unlocked).length

  return (
    <SheetModal open={open} onClose={onClose} title="Meta Research">
      <div className="space-y-5">
        {/* Currency display */}
        {profile && (
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-gray-800 px-2 py-1 rounded text-yellow-400 font-medium">
              {profile.scrap_tokens} Scrap Tokens
            </span>
            <span className="bg-gray-800 px-2 py-1 rounded text-purple-400 font-medium">
              {profile.echo_shards} Echo Shards
            </span>
            <span className="text-gray-600 ml-auto">
              {unlockedCount}/{RESEARCH_TREE.length} researched
            </span>
          </div>
        )}

        {/* Tier groups */}
        {tiers.map(({ tier, label, nodes }) => (
          <div key={tier}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
            <div className="grid grid-cols-2 gap-2">
              {nodes.map((node) => {
                const done = isUnlocked(node.id)
                const available = !done && canUnlock(node)
                return (
                  <button
                    key={node.id}
                    onClick={() => { setSelected(node); setResult(null) }}
                    className={`text-left p-3 rounded-xl border transition-colors ${
                      done
                        ? 'bg-brand-500/10 border-brand-500/30'
                        : available
                          ? 'bg-gray-800 border-gray-600 active:bg-gray-700'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${done ? 'text-brand-400' : 'text-gray-200'}`}>
                      {node.name}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{node.effect}</p>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Node detail sub-sheet */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-lg bg-gray-900 rounded-t-2xl border-t border-gray-700 p-4 space-y-3 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-100">{selected.name}</h4>
              <button onClick={() => setSelected(null)} className="text-gray-500 active:text-gray-300">&times;</button>
            </div>
            <p className="text-sm text-gray-400">{selected.description}</p>
            <p className="text-xs text-brand-400 font-medium">{selected.effect}</p>

            {/* Cost */}
            <div className="flex gap-2 text-xs">
              <span className="bg-gray-800 px-2 py-1 rounded text-yellow-400">
                {selected.cost.scrap_tokens} ST
              </span>
              {selected.cost.echo_shards && (
                <span className="bg-gray-800 px-2 py-1 rounded text-purple-400">
                  {selected.cost.echo_shards} ES
                </span>
              )}
            </div>

            {/* Prerequisites */}
            {selected.prerequisites.length > 0 && (
              <div className="text-xs text-gray-500">
                Requires: {selected.prerequisites.map((p) => {
                  const prereq = RESEARCH_TREE.find((n) => n.id === p)
                  const met = isUnlocked(p)
                  return (
                    <span key={p} className={met ? 'text-success-400' : 'text-danger-400'}>
                      {prereq?.name ?? p}{' '}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className={`rounded-lg p-2 text-xs font-medium ${
                result.success
                  ? 'bg-success-500/20 text-success-400'
                  : 'bg-danger-500/20 text-danger-400'
              }`}>
                {result.message}
              </div>
            )}

            {/* Purchase button */}
            {!isUnlocked(selected.id) && canUnlock(selected) && !result?.success && (
              <button
                onClick={() => handlePurchase(selected)}
                disabled={purchasing}
                className="w-full py-3 bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
              >
                {purchasing ? 'Researching...' : 'Research'}
              </button>
            )}

            {isUnlocked(selected.id) && (
              <p className="text-xs text-brand-400 text-center font-medium">Already Researched</p>
            )}

            {!isUnlocked(selected.id) && !canUnlock(selected) && (
              <p className="text-xs text-gray-600 text-center">Prerequisites not met</p>
            )}
          </div>
        </div>
      )}
    </SheetModal>
  )
}
