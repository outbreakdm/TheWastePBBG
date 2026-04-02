import { REGIONS } from '../../data/regions'
import type { Region } from '../../lib/types'

interface WorldMapProps {
  onSelectRegion: (region: Region) => void
}

const DANGER_BADGES: Record<string, { label: string; color: string }> = {
  safe: { label: 'Safe', color: 'bg-blue-500/20 text-blue-400' },
  medium: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
  high: { label: 'High', color: 'bg-red-500/20 text-red-400' },
  extreme: { label: 'Extreme', color: 'bg-purple-500/20 text-purple-400' },
}

export function WorldMap({ onSelectRegion }: WorldMapProps) {
  return (
    <div className="space-y-3">
      {REGIONS.map((region) => {
        const badge = DANGER_BADGES[region.dangerLevel]
        return (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            className={`w-full text-left p-4 rounded-xl border border-gray-800 ${region.bgColor} active:opacity-80 transition-all`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-bold ${region.color}`}>{region.name}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{region.description}</p>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span>Lv {region.levelRange[0]}–{region.levelRange[1]}</span>
              <span>{region.staminaCost} STA/node</span>
              <span>{region.sectors} sectors</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
