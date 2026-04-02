import { useEffect, useState } from 'react'
import { useSurvivorStore } from '../../stores/survivorStore'
import { useAuthStore } from '../../stores/authStore'
import { SurvivorCard } from './SurvivorCard'
import { SurvivorDetail } from './SurvivorDetail'
import { CreateSurvivorSheet } from './CreateSurvivorSheet'

export function SurvivorsTab() {
  const profile = useAuthStore((s) => s.profile)
  const { survivors, activeSurvivor, loading, fetchSurvivors } = useSurvivorStore()
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    if (profile) fetchSurvivors()
  }, [profile, fetchSurvivors])

  const viewingSurvivor = viewingId ? survivors.find((s) => s.id === viewingId) : null

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        <span className="text-gray-500 animate-pulse">Loading survivors...</span>
      </div>
    )
  }

  if (viewingSurvivor) {
    return (
      <div className="p-4">
        <SurvivorDetail survivor={viewingSurvivor} onBack={() => setViewingId(null)} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Survivors</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="px-3 py-1.5 bg-brand-500 active:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          + New
        </button>
      </div>

      {survivors.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <p className="text-gray-500 text-sm mb-3">No survivors yet</p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-brand-500 active:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Create your first survivor
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {survivors.map((s) => (
            <SurvivorCard
              key={s.id}
              survivor={s}
              isActive={activeSurvivor?.id === s.id}
              onTap={() => setViewingId(s.id)}
            />
          ))}
        </div>
      )}

      <CreateSurvivorSheet open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
