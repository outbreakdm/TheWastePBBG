import { useState } from 'react'
import type { RadioEvent } from '../../lib/types'
import type { EventTemplate, EventCategory } from '../../data/events'
import { useRadioStore } from '../../stores/radioStore'
import { useSurvivorStore } from '../../stores/survivorStore'
import { SheetModal } from '../../components/ui/SheetModal'

const CATEGORY_ICONS: Record<EventCategory, string> = {
  contract: '\u{1F4CB}',
  warning: '\u26A0\uFE0F',
  rescue: '\u{1F198}',
  tip: '\u{1F4A1}',
  lore: '\u{1F4DC}',
}

interface EventDetailProps {
  event: RadioEvent | null
  onClose: () => void
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  const { markRead, respondToEvent } = useRadioStore()
  const survivor = useSurvivorStore((s) => s.activeSurvivor)
  const [responding, setResponding] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  if (!event) return null

  const payload = event.payload as unknown as EventTemplate & { templateId: string }
  const category = event.event_type as EventCategory
  const icon = CATEGORY_ICONS[category] ?? ''

  const handleOpen = async () => {
    if (!event.is_read) {
      await markRead(event.id)
    }
  }

  const handleRespond = async () => {
    setResponding(true)
    const res = await respondToEvent(event)
    setResult(res)
    setResponding(false)
  }

  const handleClose = () => {
    setResult(null)
    onClose()
  }

  const canRespond = payload.actionable && !event.is_read && survivor
  const staminaOk = survivor && (survivor.stamina >= (payload.staminaCost ?? 0))

  return (
    <SheetModal open={!!event} onClose={handleClose} title={`${icon} ${payload.title ?? 'Signal'}`}>
      <div className="space-y-4" onAnimationEnd={handleOpen}>
        {/* Body */}
        <p className="text-sm text-gray-300 leading-relaxed">{payload.body}</p>

        {/* Rewards preview */}
        {payload.actionable && payload.rewards && (
          <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rewards</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(payload.rewards).map(([key, val]) => (
                val ? (
                  <span key={key} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    +{val as number} {formatRewardKey(key)}
                  </span>
                ) : null
              ))}
            </div>
          </div>
        )}

        {/* Stamina cost */}
        {payload.actionable && payload.staminaCost && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Stamina cost:</span>
            <span className={staminaOk ? 'text-stamina-400' : 'text-danger-400'}>
              {payload.staminaCost}
            </span>
            {survivor && (
              <span className="text-gray-600">
                (you have {survivor.stamina})
              </span>
            )}
          </div>
        )}

        {/* Result message */}
        {result && (
          <div className={`rounded-lg p-3 text-sm font-medium ${
            result.success
              ? 'bg-success-500/20 text-success-400 border border-success-500/30'
              : 'bg-danger-500/20 text-danger-400 border border-danger-500/30'
          }`}>
            {result.message}
          </div>
        )}

        {/* Action button */}
        {canRespond && !result && (
          <button
            onClick={handleRespond}
            disabled={responding || !staminaOk}
            className="w-full py-3 bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {responding ? 'Responding...' : (payload.actionLabel ?? 'Respond')}
          </button>
        )}

        {!staminaOk && canRespond && !result && (
          <p className="text-xs text-danger-400 text-center">Not enough stamina</p>
        )}

        {event.is_read && !payload.actionable && (
          <p className="text-xs text-gray-600 text-center">Information only — no action required</p>
        )}

        {event.is_read && payload.actionable && !result && (
          <p className="text-xs text-gray-600 text-center">Already responded</p>
        )}
      </div>
    </SheetModal>
  )
}

function formatRewardKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
