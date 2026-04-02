import type { OfflineResult } from '../../lib/offline'
import { formatDuration } from '../../lib/offline'
import { useState } from 'react'

interface WelcomeBackModalProps {
  result: OfflineResult
  onApply: () => Promise<void>
  onDismiss: () => void
}

export function WelcomeBackModal({ result, onApply, onDismiss }: WelcomeBackModalProps) {
  const [applying, setApplying] = useState(false)

  const handleApply = async () => {
    setApplying(true)
    await onApply()
    setApplying(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70" onClick={onDismiss} />
      <div className="relative w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-700 p-6 animate-slide-up">
        <h2 className="text-xl font-bold text-brand-400 text-center mb-1">Welcome Back</h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          You were away for {formatDuration(result.elapsedSeconds)}
        </p>

        <div className="space-y-3 mb-5">
          {result.staminaGained > 0 && (
            <ProgressRow
              icon="S"
              iconColor="text-stamina"
              label="Stamina Recovered"
              value={`+${result.staminaGained}`}
            />
          )}
          {result.hungerGained > 0 && (
            <ProgressRow
              icon="H"
              iconColor="text-hunger"
              label="Hunger Increased"
              value={`+${result.hungerGained}`}
            />
          )}
          {result.tasksCompleted.length > 0 && (
            <ProgressRow
              icon="T"
              iconColor="text-success-400"
              label="Tasks Completed"
              value={`${result.tasksCompleted.length}`}
            />
          )}
          {result.staminaGained === 0 && result.hungerGained === 0 && result.tasksCompleted.length === 0 && (
            <p className="text-sm text-gray-500 text-center">Nothing happened while you were away.</p>
          )}
        </div>

        <button
          onClick={handleApply}
          disabled={applying}
          className="w-full py-3 bg-brand-500 active:bg-brand-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {applying ? 'Applying...' : 'Collect & Continue'}
        </button>
      </div>
    </div>
  )
}

function ProgressRow({ icon, iconColor, label, value }: {
  icon: string; iconColor: string; label: string; value: string
}) {
  return (
    <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
      <div className="flex items-center gap-2">
        <span className={`font-bold text-sm ${iconColor}`}>{icon}</span>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-200">{value}</span>
    </div>
  )
}
