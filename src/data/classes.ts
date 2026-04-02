import type { SurvivorClass, BaseStats } from '../lib/types'
import { CLASS_BASE_STATS } from '../lib/constants'

export interface ClassDef {
  id: SurvivorClass
  name: string
  title: string
  description: string
  strength: string
  baseStats: BaseStats
  statGrowth: BaseStats // per-level auto-assigned weights (sum to STAT_POINTS_PER_LEVEL)
}

export const CLASSES: ClassDef[] = [
  {
    id: 'scavenger',
    name: 'Scavenger',
    title: 'Efficient Looter',
    description: 'Keen-eyed survivors who find more in every ruin. Better salvage and drop rates let them squeeze value from the wasteland.',
    strength: 'Better salvage and drop rates',
    baseStats: CLASS_BASE_STATS.scavenger,
    statGrowth: { str: 0, def: 0, agi: 1, per: 1, vit: 0, wil: 0 },
  },
  {
    id: 'bruiser',
    name: 'Bruiser',
    title: 'Frontline Fighter',
    description: 'Built to take hits and deal them back. Bruisers survive encounters that would end others, with high HP and defense scaling.',
    strength: 'Higher HP and DEF scaling',
    baseStats: CLASS_BASE_STATS.bruiser,
    statGrowth: { str: 1, def: 1, agi: 0, per: 0, vit: 0, wil: 0 },
  },
  {
    id: 'runner',
    name: 'Runner',
    title: 'Fast Explorer',
    description: 'Speed is survival. Runners burn less stamina, move faster between zones, and get out before things go wrong.',
    strength: 'Lower stamina costs and faster travel',
    baseStats: CLASS_BASE_STATS.runner,
    statGrowth: { str: 0, def: 0, agi: 1, per: 0, vit: 0, wil: 1 },
  },
  {
    id: 'tinkerer',
    name: 'Tinkerer',
    title: 'Crafter / Systems Expert',
    description: 'Tinkerers stretch every scrap further. Better crafting results, cheaper upgrades, and field repairs keep their gear in top shape.',
    strength: 'Better gear upgrades and repair economy',
    baseStats: CLASS_BASE_STATS.tinkerer,
    statGrowth: { str: 0, def: 0, agi: 0, per: 1, vit: 0, wil: 1 },
  },
  {
    id: 'warden',
    name: 'Warden',
    title: 'Defensive Survivor',
    description: 'Wardens protect what matters. Stronger shelter defense, safer runs, and the endurance to weather anything the wasteland throws.',
    strength: 'Safer runs and stronger shelter defense',
    baseStats: CLASS_BASE_STATS.warden,
    statGrowth: { str: 0, def: 1, agi: 0, per: 0, vit: 1, wil: 0 },
  },
]

export const CLASS_MAP = Object.fromEntries(CLASSES.map((c) => [c.id, c])) as Record<SurvivorClass, ClassDef>
