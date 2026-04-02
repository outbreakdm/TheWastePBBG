export interface ResearchNode {
  id: string
  name: string
  description: string
  effect: string
  cost: { scrap_tokens: number; echo_shards?: number }
  prerequisites: string[]
  tier: number // visual grouping 1-4
}

export const RESEARCH_TREE: ResearchNode[] = [
  // Tier 1 — basic bonuses
  {
    id: 'xp_boost_1', name: 'Quick Study I', description: 'Learn faster from every encounter.',
    effect: '+5% XP gain', cost: { scrap_tokens: 200 }, prerequisites: [], tier: 1,
  },
  {
    id: 'stamina_regen_1', name: 'Deep Breath I', description: 'Recover stamina more efficiently.',
    effect: '+10% stamina regen', cost: { scrap_tokens: 200 }, prerequisites: [], tier: 1,
  },
  {
    id: 'hunger_slow_1', name: 'Iron Metabolism I', description: 'Your body burns fuel slower.',
    effect: '-5% hunger drain', cost: { scrap_tokens: 250 }, prerequisites: [], tier: 1,
  },
  {
    id: 'inventory_1', name: 'Pack Expansion I', description: 'More room to carry loot.',
    effect: '+5 carry capacity', cost: { scrap_tokens: 150 }, prerequisites: [], tier: 1,
  },

  // Tier 2 — requires 1 tier-1 node
  {
    id: 'xp_boost_2', name: 'Quick Study II', description: 'Even faster learning.',
    effect: '+10% XP gain', cost: { scrap_tokens: 500 }, prerequisites: ['xp_boost_1'], tier: 2,
  },
  {
    id: 'salvage_boost', name: 'Efficient Salvage', description: 'Extract more from scrapped gear.',
    effect: '+15% salvage returns', cost: { scrap_tokens: 400 }, prerequisites: ['inventory_1'], tier: 2,
  },
  {
    id: 'stamina_regen_2', name: 'Deep Breath II', description: 'Enhanced recovery.',
    effect: '+20% stamina regen', cost: { scrap_tokens: 500 }, prerequisites: ['stamina_regen_1'], tier: 2,
  },
  {
    id: 'upgrade_discount', name: 'Frugal Forging', description: 'Spend less on gear upgrades.',
    effect: '-10% upgrade costs', cost: { scrap_tokens: 450 }, prerequisites: ['hunger_slow_1'], tier: 2,
  },

  // Tier 3 — requires 2 tier-2 nodes
  {
    id: 'extra_stat', name: 'Innate Potential', description: 'Survivors start with more stat points.',
    effect: '+1 starting stat point', cost: { scrap_tokens: 800, echo_shards: 5 }, prerequisites: ['xp_boost_2', 'stamina_regen_2'], tier: 3,
  },
  {
    id: 'contract_slots', name: 'Radio Mastery', description: 'Handle more contracts simultaneously.',
    effect: '+1 active contract slot', cost: { scrap_tokens: 700 }, prerequisites: ['salvage_boost', 'upgrade_discount'], tier: 3,
  },
  {
    id: 'loot_quality', name: 'Fortune Favors', description: 'Better loot across the board.',
    effect: '+5% rare+ drop chance', cost: { scrap_tokens: 900, echo_shards: 3 }, prerequisites: ['salvage_boost'], tier: 3,
  },

  // Tier 4 — endgame
  {
    id: 'fourth_skill', name: 'Versatile', description: 'Unlock a 4th skill slot for all survivors.',
    effect: '+1 skill slot', cost: { scrap_tokens: 1500, echo_shards: 15 }, prerequisites: ['extra_stat', 'contract_slots'], tier: 4,
  },
  {
    id: 'second_trait', name: 'Dual Nature', description: 'Survivors can equip a second trait.',
    effect: '+1 trait slot', cost: { scrap_tokens: 2000, echo_shards: 20 }, prerequisites: ['loot_quality', 'extra_stat'], tier: 4,
  },
]

export const RESEARCH_MAP = Object.fromEntries(RESEARCH_TREE.map((r) => [r.id, r])) as Record<string, ResearchNode>
