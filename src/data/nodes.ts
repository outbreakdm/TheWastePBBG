export type NodeType = 'combat' | 'scavenge' | 'rest' | 'event' | 'hazard' | 'boss'

export interface NodeDef {
  type: NodeType
  label: string
  icon: string
  staminaMultiplier: number // multiplied by region base cost
  description: string
}

export const NODE_TYPES: Record<NodeType, NodeDef> = {
  combat: {
    type: 'combat',
    label: 'Combat',
    icon: 'C',
    staminaMultiplier: 1.0,
    description: 'Fight hostiles for loot and XP.',
  },
  scavenge: {
    type: 'scavenge',
    label: 'Scavenge',
    icon: 'S',
    staminaMultiplier: 0.8,
    description: 'Search ruins for materials and gear.',
  },
  rest: {
    type: 'rest',
    label: 'Safe Cache',
    icon: 'R',
    staminaMultiplier: 0.3,
    description: 'A hidden stash. Recover some stamina and find supplies.',
  },
  event: {
    type: 'event',
    label: 'Event',
    icon: 'E',
    staminaMultiplier: 0.6,
    description: 'Something unusual. Could be an opportunity or a trap.',
  },
  hazard: {
    type: 'hazard',
    label: 'Hazard',
    icon: 'H',
    staminaMultiplier: 1.2,
    description: 'Dangerous environment. Higher risk, higher reward.',
  },
  boss: {
    type: 'boss',
    label: 'Boss',
    icon: 'B',
    staminaMultiplier: 1.5,
    description: 'The strongest enemy in this region. Prepare carefully.',
  },
}

// Generate a fixed node layout for a sector (deterministic from region+sector)
export function generateSectorNodes(sector: number): NodeType[] {
  // Sector 10 is always a boss
  if (sector === 10) {
    return ['combat', 'combat', 'hazard', 'rest', 'boss']
  }

  // Sectors 1-3: easy mix
  if (sector <= 3) {
    const patterns: NodeType[][] = [
      ['scavenge', 'combat', 'scavenge'],
      ['combat', 'scavenge', 'rest'],
      ['scavenge', 'event', 'combat'],
    ]
    return patterns[(sector - 1) % patterns.length]
  }

  // Sectors 4-6: medium
  if (sector <= 6) {
    const patterns: NodeType[][] = [
      ['combat', 'scavenge', 'combat', 'event'],
      ['scavenge', 'hazard', 'combat', 'rest'],
      ['combat', 'combat', 'scavenge', 'event'],
    ]
    return patterns[(sector - 4) % patterns.length]
  }

  // Sectors 7-9: hard
  const patterns: NodeType[][] = [
    ['combat', 'hazard', 'combat', 'scavenge', 'combat'],
    ['hazard', 'combat', 'event', 'combat', 'rest'],
    ['combat', 'combat', 'hazard', 'combat', 'scavenge'],
  ]
  return patterns[(sector - 7) % patterns.length]
}
