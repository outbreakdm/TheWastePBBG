import { useState } from 'react'
import type { SurvivorClass } from '../../lib/types'
import { SheetModal } from '../../components/ui/SheetModal'
import { CLASSES } from '../../data/classes'
import { useSurvivorStore } from '../../stores/survivorStore'

interface CreateSurvivorSheetProps {
  open: boolean
  onClose: () => void
}

const STAT_LABELS: Record<string, string> = {
  str: 'STR', def: 'DEF', agi: 'AGI', per: 'PER', vit: 'VIT', wil: 'WIL',
}

export function CreateSurvivorSheet({ open, onClose }: CreateSurvivorSheetProps) {
  const createSurvivor = useSurvivorStore((s) => s.createSurvivor)
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<SurvivorClass>('scavenger')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const classDef = CLASSES.find((c) => c.id === selectedClass)!

  const handleCreate = async () => {
    if (!name.trim()) { setError('Enter a name'); return }
    setError('')
    setLoading(true)
    try {
      await createSurvivor(name.trim(), selectedClass)
      setName('')
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create survivor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SheetModal open={open} onClose={onClose} title="New Survivor">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Survivor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500"
        />

        <div className="space-y-2">
          <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Class</label>
          <div className="grid grid-cols-1 gap-2">
            {CLASSES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClass(c.id)}
                className={`text-left p-3 rounded-lg border transition-colors active:scale-[0.98] ${
                  selectedClass === c.id
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-gray-800 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-100">{c.name}</span>
                  <span className="text-xs text-gray-500">{c.title}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{c.strength}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-2 font-medium">Starting Stats</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(classDef.baseStats).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{STAT_LABELS[key]}</span>
                <span className="text-gray-200 font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-danger-400 text-sm">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-3 bg-brand-500 active:bg-brand-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Survivor'}
        </button>
      </div>
    </SheetModal>
  )
}
