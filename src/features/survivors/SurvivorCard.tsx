import type { Survivor } from '../../lib/types'
import { CLASS_MAP } from '../../data/classes'

interface SurvivorCardProps {
  survivor: Survivor
  isActive: boolean
  onTap: () => void
}

export function SurvivorCard({ survivor, isActive, onTap }: SurvivorCardProps) {
  const classDef = CLASS_MAP[survivor.class]

  return (
    <button
      onClick={onTap}
      className={`w-full text-left p-3 rounded-xl border transition-colors active:scale-[0.98] ${
        isActive
          ? 'border-brand-500 bg-brand-500/10'
          : 'border-gray-800 bg-gray-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
          {survivor.name[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-100 truncate">{survivor.name}</span>
            {isActive && <span className="text-[10px] bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded">Active</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>{classDef?.name}</span>
            <span>Lv {survivor.level}</span>
          </div>
        </div>
        <div className="text-right text-xs shrink-0">
          <div className="text-hp">{survivor.hp}/{survivor.hp_max} HP</div>
          <div className="text-stamina">{survivor.stamina}/{survivor.stamina_max} STA</div>
        </div>
      </div>
    </button>
  )
}
