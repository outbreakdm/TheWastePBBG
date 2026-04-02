import { xpForLevel } from '../../lib/formulas'

interface XPBarProps {
  level: number
  xp: number
}

export function XPBar({ level, xp }: XPBarProps) {
  const needed = xpForLevel(level)
  const pct = Math.min(100, (xp / needed) * 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-xp font-semibold">Lv {level}</span>
        <span className="text-gray-500">{xp} / {needed} XP</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-xp rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
