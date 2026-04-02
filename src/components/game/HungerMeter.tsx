import { HUNGER_MAX } from '../../lib/constants'

interface HungerMeterProps {
  hunger: number
}

export function HungerMeter({ hunger }: HungerMeterProps) {
  const pct = Math.min(100, (hunger / HUNGER_MAX) * 100)
  const color = hunger >= 75 ? 'bg-danger-500' : hunger >= 50 ? 'bg-hunger' : 'bg-success-500'
  const label = hunger >= 75 ? 'Starving' : hunger >= 50 ? 'Hungry' : hunger >= 25 ? 'Peckish' : 'Fed'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-hunger font-semibold">Hunger</span>
        <span className="text-gray-500">{label} ({hunger}/{HUNGER_MAX})</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
