import { useEffect, useState } from 'react'
import type { ShelterModule } from '../../lib/types'
import { useAuthStore } from '../../stores/authStore'
import { useShelterStore } from '../../stores/shelterStore'
import { useInventoryStore } from '../../stores/inventoryStore'
import { ModuleCard } from './ModuleCard'
import { UpgradeSheet } from './UpgradeSheet'
import { ResearchTree } from './ResearchTree'
import { AccountSettings } from './AccountSettings'

export function ShelterTab() {
  const profile = useAuthStore((s) => s.profile)
  const { modules, loading, fetchModules } = useShelterStore()
  const { fetchMaterials } = useInventoryStore()
  const [selected, setSelected] = useState<ShelterModule | null>(null)
  const [showResearch, setShowResearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (profile) {
      fetchModules()
      fetchMaterials()
    }
  }, [profile, fetchModules, fetchMaterials])

  if (loading && modules.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        <span className="text-gray-500 animate-pulse">Loading shelter...</span>
      </div>
    )
  }

  // Sort modules in a consistent order
  const order = ['bedroll', 'cookfire', 'workbench', 'locker', 'barricade', 'radio']
  const sorted = [...modules].sort((a, b) => order.indexOf(a.module_type) - order.indexOf(b.module_type))

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Shelter</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowResearch(true)}
            className="px-3 py-1.5 bg-purple-600 active:bg-purple-800 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Research
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="px-3 py-1.5 bg-gray-700 active:bg-gray-600 text-gray-300 text-sm font-semibold rounded-lg transition-colors"
          >
            Settings
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            onTap={() => setSelected(mod)}
          />
        ))}
      </div>

      {modules.length === 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <p className="text-gray-500 text-sm">No shelter modules found.</p>
          <p className="text-gray-600 text-xs mt-1">They are created automatically on sign-up.</p>
        </div>
      )}

      <UpgradeSheet
        module={selected}
        onClose={() => { setSelected(null); fetchModules() }}
      />
      <ResearchTree open={showResearch} onClose={() => setShowResearch(false)} />
      <AccountSettings open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
