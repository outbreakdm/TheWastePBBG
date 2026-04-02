export type EventCategory = 'contract' | 'warning' | 'rescue' | 'tip' | 'lore'

export interface EventTemplate {
  id: string
  category: EventCategory
  title: string
  body: string
  minRadioTier: number
  actionable: boolean
  actionLabel?: string
  staminaCost?: number
  rewards?: {
    scrap?: number
    parts?: number
    cloth?: number
    alloy?: number
    relic_fragments?: number
    xp?: number
  }
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  // Tier 1
  {
    id: 'tip_hunger', category: 'tip', title: 'Survival Tip', minRadioTier: 1,
    body: 'Cook food at the Cookfire before long expeditions. Hunger penalties reduce your combat effectiveness.',
    actionable: false,
  },
  {
    id: 'tip_stamina', category: 'tip', title: 'Stamina Management', minRadioTier: 1,
    body: 'Upgrading your Bedroll increases offline stamina recovery. Rest smart, push harder.',
    actionable: false,
  },
  {
    id: 'lore_dust_flats', category: 'lore', title: 'Signal Fragment', minRadioTier: 1,
    body: 'A garbled transmission: "...the dust came first, then the silence. We thought the city would hold..."',
    actionable: false,
  },
  {
    id: 'contract_scrap_run', category: 'contract', title: 'Scrap Delivery', minRadioTier: 1,
    body: 'A nearby camp needs scrap metal. Complete a quick run for a reward.',
    actionable: true, actionLabel: 'Accept Contract', staminaCost: 10,
    rewards: { scrap: 25, parts: 10, xp: 30 },
  },

  // Tier 2
  {
    id: 'warning_storm', category: 'warning', title: 'Dust Storm Incoming', minRadioTier: 2,
    body: 'Sensors detect a major dust storm approaching. Hazard zones will be more dangerous for the next few hours.',
    actionable: false,
  },
  {
    id: 'contract_patrol', category: 'contract', title: 'Patrol Route', minRadioTier: 2,
    body: 'Clear a patrol route through Dead Blocks. Raiders have been spotted.',
    actionable: true, actionLabel: 'Begin Patrol', staminaCost: 15,
    rewards: { scrap: 40, parts: 20, cloth: 15, xp: 60 },
  },
  {
    id: 'rescue_wanderer', category: 'rescue', title: 'Lost Wanderer', minRadioTier: 2,
    body: 'A distress signal from a survivor lost in the Dust Flats. Bring them in for a reward.',
    actionable: true, actionLabel: 'Mount Rescue', staminaCost: 12,
    rewards: { scrap: 20, cloth: 20, xp: 50 },
  },

  // Tier 3
  {
    id: 'contract_elite', category: 'contract', title: 'Elite Bounty', minRadioTier: 3,
    body: 'A dangerous target has been spotted in the Ash Marsh. High risk, high reward.',
    actionable: true, actionLabel: 'Accept Bounty', staminaCost: 20,
    rewards: { alloy: 8, parts: 30, relic_fragments: 1, xp: 120 },
  },
  {
    id: 'lore_old_world', category: 'lore', title: 'Pre-War Broadcast', minRadioTier: 3,
    body: 'An automated message loops: "Evacuation routes are no longer available. Shelter in place. This is not a drill."',
    actionable: false,
  },
  {
    id: 'rescue_convoy', category: 'rescue', title: 'Stranded Convoy', minRadioTier: 3,
    body: 'A supply convoy broke down near the Ash Marsh. Salvage what you can.',
    actionable: true, actionLabel: 'Investigate', staminaCost: 18,
    rewards: { scrap: 50, parts: 25, alloy: 5, xp: 80 },
  },

  // Tier 4
  {
    id: 'contract_spine', category: 'contract', title: 'Spine Recon', minRadioTier: 4,
    body: 'Intel needed on The Spine fortifications. Scout and report back.',
    actionable: true, actionLabel: 'Begin Recon', staminaCost: 25,
    rewards: { alloy: 15, relic_fragments: 3, xp: 200 },
  },
  {
    id: 'warning_raid', category: 'warning', title: 'Raid Alert', minRadioTier: 4,
    body: 'Multiple hostile signals converging. Barricade upgrades will help protect your shelter gains.',
    actionable: false,
  },

  // Tier 5
  {
    id: 'contract_relic', category: 'contract', title: 'Relic Recovery', minRadioTier: 5,
    body: 'A relic-tech cache has been located deep in The Spine. Extremely dangerous extraction.',
    actionable: true, actionLabel: 'Launch Extraction', staminaCost: 30,
    rewards: { alloy: 20, relic_fragments: 8, xp: 350 },
  },
  {
    id: 'lore_endgame', category: 'lore', title: 'The Signal Beyond', minRadioTier: 5,
    body: 'A signal from beyond the known wasteland. Something is out there. Something old.',
    actionable: false,
  },
]

export function getEventsForTier(radioTier: number): EventTemplate[] {
  return EVENT_TEMPLATES.filter((e) => e.minRadioTier <= radioTier)
}
