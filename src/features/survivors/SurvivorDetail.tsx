import type { Survivor } from '../../lib/types'
import { CLASS_MAP } from '../../data/classes'
import { XPBar } from '../../components/game/XPBar'
import { HPBar } from '../../components/game/HPBar'
import { StaminaBar } from '../../components/game/StaminaBar'
import { HungerMeter } from '../../components/game/HungerMeter'
import { StatBlock } from './StatBlock'
import { SkillSlots } from './SkillSlots'
import { TraitList } from './TraitList'
import { useSurvivorStore } from '../../stores/survivorStore'

interface SurvivorDetailProps {
  survivor: Survivor
  onBack: () => void
}

export function SurvivorDetail({ survivor, onBack }: SurvivorDetailProps) {
  const { activeSurvivor, setActiveSurvivor } = useSurvivorStore()
  const classDef = CLASS_MAP[survivor.class]
  const isActive = activeSurvivor?.id === survivor.id

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-sm text-gray-500 active:text-gray-300 flex items-center gap-1"
      >
        &larr; Back to roster
      </button>

      {/* Header */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-brand-400 font-bold text-lg">
            {survivor.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-100">{survivor.name}</h2>
            <p className="text-sm text-gray-500">{classDef?.name} — {classDef?.title}</p>
          </div>
        </div>

        <XPBar level={survivor.level} xp={survivor.xp} />

        <div className="space-y-2 mt-3">
          <HPBar current={survivor.hp} max={survivor.hp_max} />
          <StaminaBar current={survivor.stamina} max={survivor.stamina_max} />
          <HungerMeter hunger={survivor.hunger} />
        </div>

        {!isActive && (
          <button
            onClick={() => setActiveSurvivor(survivor.id)}
            className="w-full mt-3 py-2 bg-brand-500/20 text-brand-400 text-sm font-semibold rounded-lg active:bg-brand-500/30 transition-colors"
          >
            Set as Active
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <StatBlock survivor={survivor} />
      </div>

      {/* Skills */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <SkillSlots survivor={survivor} />
      </div>

      {/* Traits */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <TraitList survivor={survivor} />
      </div>
    </div>
  )
}
