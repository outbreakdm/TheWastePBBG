import type { Region, DangerLevel } from '../lib/types'

export interface RegionDef {
  id: Region
  name: string
  description: string
  dangerLevel: DangerLevel
  color: string // tailwind color class
  bgColor: string
  levelRange: [number, number]
  staminaCost: number
  hungerMultiplier: number
  sectors: number
}

export const REGIONS: RegionDef[] = [
  {
    id: 'dust_flats',
    name: 'Dust Flats',
    description: 'Tutorial wasteland. Basic scavengers and raiders roam the open plains.',
    dangerLevel: 'safe',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    levelRange: [1, 8],
    staminaCost: 8,
    hungerMultiplier: 1.0,
    sectors: 10,
  },
  {
    id: 'dead_blocks',
    name: 'Dead Blocks',
    description: 'Ruined city districts. Higher loot density but traps lurk in every building.',
    dangerLevel: 'medium',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    levelRange: [6, 16],
    staminaCost: 10,
    hungerMultiplier: 1.25,
    sectors: 10,
  },
  {
    id: 'ash_marsh',
    name: 'Ash Marsh',
    description: 'Toxic lowlands. Hazard-heavy and loot-rich. The air itself is a weapon.',
    dangerLevel: 'high',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    levelRange: [14, 24],
    staminaCost: 12,
    hungerMultiplier: 1.5,
    sectors: 10,
  },
  {
    id: 'the_spine',
    name: 'The Spine',
    description: 'Fortified late-game zone. Elite enemies guard relic technology.',
    dangerLevel: 'extreme',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    levelRange: [22, 30],
    staminaCost: 14,
    hungerMultiplier: 1.75,
    sectors: 10,
  },
]

export const REGION_MAP = Object.fromEntries(REGIONS.map((r) => [r.id, r])) as Record<Region, RegionDef>
