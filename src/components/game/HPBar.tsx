interface HPBarProps {
  current: number
  max: number
}

export function HPBar({ current, max }: HPBarProps) {
  const pct = Math.min(100, (current / max) * 100)
  const color = pct <= 25 ? 'bg-danger-500' : pct <= 50 ? 'bg-hunger' : 'bg-hp'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-hp font-semibold">HP</span>
        <span className="text-gray-500">{current} / {max}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
