interface StaminaBarProps {
  current: number
  max: number
}

export function StaminaBar({ current, max }: StaminaBarProps) {
  const pct = Math.min(100, (current / max) * 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-stamina font-semibold">Stamina</span>
        <span className="text-gray-500">{current} / {max}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-stamina rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
