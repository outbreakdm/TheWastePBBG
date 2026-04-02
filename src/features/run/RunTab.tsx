import { useEffect, useState } from 'react'
import type { Region } from '../../lib/types'
import type { NodeType } from '../../data/nodes'
import { useSurvivorStore } from '../../stores/survivorStore'
import { useAuthStore } from '../../stores/authStore'
import { useCombatStore } from '../../stores/combatStore'
import { useMapStore } from '../../stores/mapStore'
import { CLASS_MAP } from '../../data/classes'
import { HPBar } from '../../components/game/HPBar'
import { StaminaBar } from '../../components/game/StaminaBar'
import { HungerMeter } from '../../components/game/HungerMeter'
import { XPBar } from '../../components/game/XPBar'
import { WorldMap } from '../map/WorldMap'
import { RegionView } from '../map/RegionView'
import { PreRunSetup } from './PreRunSetup'
import { CombatView } from './CombatView'
import { LootSummary } from './LootSummary'

export function RunTab() {
  const profile = useAuthStore((s) => s.profile)
  const { activeSurvivor, fetchSurvivors } = useSurvivorStore()
  const { phase, startPreRun } = useCombatStore()
  const { fetchProgress } = useMapStore()
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)

  useEffect(() => {
    if (profile) {
      fetchSurvivors()
      fetchProgress()
    }
  }, [profile, fetchSurvivors, fetchProgress])

  if (!activeSurvivor) {
    return (
      <div className="p-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <p className="text-gray-500 text-sm">No active survivor</p>
          <p className="text-gray-600 text-xs mt-1">Create one in the Crew tab</p>
        </div>
      </div>
    )
  }

  const classDef = CLASS_MAP[activeSurvivor.class]

  // Combat flow states
  if (phase === 'pre_run') {
    return <div className="p-4"><PreRunSetup /></div>
  }
  if (phase === 'fighting') {
    return <div className="p-4"><CombatView /></div>
  }
  if (phase === 'result') {
    return <div className="p-4"><LootSummary /></div>
  }

  const handleSelectNode = (sector: number, nodeIndex: number, nodeType: NodeType, staminaCost: number) => {
    if (!selectedRegion) return
    startPreRun(selectedRegion, sector, nodeIndex, nodeType, staminaCost)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Survivor Status */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-brand-400 font-bold text-sm">
            {activeSurvivor.name[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-100">{activeSurvivor.name}</h2>
            <p className="text-xs text-gray-500">{classDef?.name} — Lv {activeSurvivor.level}</p>
          </div>
        </div>
        <div className="space-y-2">
          <HPBar current={activeSurvivor.hp} max={activeSurvivor.hp_max} />
          <StaminaBar current={activeSurvivor.stamina} max={activeSurvivor.stamina_max} />
          <HungerMeter hunger={activeSurvivor.hunger} />
          <XPBar level={activeSurvivor.level} xp={activeSurvivor.xp} />
        </div>
      </div>

      {/* Map */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-200 mb-3">
          {selectedRegion ? 'Select a Node' : 'World Map'}
        </h3>

        {selectedRegion ? (
          <RegionView
            region={selectedRegion}
            onBack={() => setSelectedRegion(null)}
            onSelectNode={handleSelectNode}
          />
        ) : (
          <WorldMap onSelectRegion={setSelectedRegion} />
        )}
      </div>
    </div>
  )
}
