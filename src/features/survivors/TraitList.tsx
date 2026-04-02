import type { Survivor } from '../../lib/types'
import { TRAIT_MAP } from '../../data/traits'

export function TraitList({ survivor }: { survivor: Survivor }) {
  const traits = survivor.trait_ids
    .map((id) => TRAIT_MAP[id])
    .filter(Boolean)

  if (traits.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Traits</p>
      <div className="space-y-1.5">
        {traits.map((trait) => (
          <div key={trait.id} className="bg-gray-800/50 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-200">{trait.name}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{trait.description}</p>
            <p className="text-xs text-brand-300 mt-0.5">{trait.effect}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
