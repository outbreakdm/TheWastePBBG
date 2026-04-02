import { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useRadioStore } from '../../stores/radioStore'
import { useShelterStore } from '../../stores/shelterStore'
import { EventDetail } from './EventDetail'
import type { RadioEvent } from '../../lib/types'
import type { EventCategory } from '../../data/events'

const CATEGORY_COLORS: Record<EventCategory, string> = {
  contract: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
  warning: 'bg-danger-500/20 text-danger-400 border-danger-500/30',
  rescue: 'bg-success-500/20 text-success-400 border-success-500/30',
  tip: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  lore: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

const CATEGORY_LABELS: Record<EventCategory, string> = {
  contract: 'Contract',
  warning: 'Warning',
  rescue: 'Rescue',
  tip: 'Tip',
  lore: 'Lore',
}

export function RadioTab() {
  const profile = useAuthStore((s) => s.profile)
  const { events, loading, fetchEvents, generateEvent } = useRadioStore()
  const radioModule = useShelterStore((s) => s.getModule('radio'))
  const radioTier = radioModule?.tier ?? 1
  const [selectedEvent, setSelectedEvent] = useState<RadioEvent | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (profile) fetchEvents()
  }, [profile, fetchEvents])

  const handleGenerate = async () => {
    setGenerating(true)
    await generateEvent()
    setGenerating(false)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Radio</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Tier {radioTier}</span>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-3 py-1.5 bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {generating ? 'Scanning...' : 'Scan Airwaves'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="text-gray-500 animate-pulse">Tuning in...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <p className="text-gray-500 text-sm">No signals received. Scan the airwaves to pick up transmissions.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onTap={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      )}

      <EventDetail
        event={selectedEvent}
        onClose={() => { setSelectedEvent(null); fetchEvents() }}
      />
    </div>
  )
}

function EventCard({ event, onTap }: { event: RadioEvent; onTap: () => void }) {
  const payload = event.payload as { title?: string; body?: string; actionable?: boolean }
  const category = event.event_type as EventCategory
  const colors = CATEGORY_COLORS[category] ?? 'bg-gray-800 text-gray-400 border-gray-700'
  const label = CATEGORY_LABELS[category] ?? category

  return (
    <button
      onClick={onTap}
      className={`w-full text-left bg-gray-900 rounded-xl border p-3 transition-colors active:bg-gray-800 ${
        event.is_read ? 'border-gray-800 opacity-60' : 'border-gray-700'
      }`}
    >
      <div className="flex items-start gap-2">
        {!event.is_read && (
          <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-400 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colors}`}>
              {label}
            </span>
            {payload.actionable && !event.is_read && (
              <span className="text-[10px] font-semibold text-brand-400">ACTION</span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-200 truncate">{payload.title ?? 'Unknown Signal'}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{payload.body ?? ''}</p>
        </div>
        <span className="text-[10px] text-gray-600 shrink-0 mt-1">
          {formatTimeAgo(event.created_at)}
        </span>
      </div>
    </button>
  )
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}
