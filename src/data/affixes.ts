export interface AffixDef {
  id: string
  name: string
  stat: string
  description: string
  tiers: { min: number; max: number }[] // indexed by affix tier (0-based)
}

export const AFFIXES: AffixDef[] = [
  { id: 'field_worn', name: 'Field-Worn', stat: 'stamina_cost_reduction', description: 'Stamina cost of scavenging -%', tiers: [{ min: 3, max: 6 }, { min: 5, max: 10 }, { min: 8, max: 15 }] },
  { id: 'vacuum_sealed', name: 'Vacuum-Sealed', stat: 'hunger_drain_reduction', description: 'Hunger drain -%', tiers: [{ min: 4, max: 8 }, { min: 6, max: 12 }, { min: 10, max: 18 }] },
  { id: 'raider_breaker', name: 'Raider-Breaker', stat: 'damage_vs_human', description: 'Damage vs humans +%', tiers: [{ min: 5, max: 10 }, { min: 8, max: 15 }, { min: 12, max: 22 }] },
  { id: 'scrappers_luck', name: "Scrapper's Luck", stat: 'salvage_bonus', description: 'Salvage drops +%', tiers: [{ min: 5, max: 10 }, { min: 8, max: 18 }, { min: 15, max: 25 }] },
  { id: 'insulated', name: 'Insulated', stat: 'hazard_reduction', description: 'Hazard damage -%', tiers: [{ min: 5, max: 10 }, { min: 8, max: 16 }, { min: 12, max: 22 }] },
  { id: 'last_march', name: 'Last March', stat: 'low_hp_damage', description: 'Damage when below 30% HP +%', tiers: [{ min: 8, max: 15 }, { min: 12, max: 22 }, { min: 18, max: 30 }] },
  { id: 'fortified', name: 'Fortified', stat: 'flat_armor', description: 'Armor +', tiers: [{ min: 2, max: 5 }, { min: 4, max: 10 }, { min: 8, max: 16 }] },
  { id: 'vigorous', name: 'Vigorous', stat: 'flat_hp', description: 'Max HP +', tiers: [{ min: 5, max: 12 }, { min: 10, max: 25 }, { min: 20, max: 40 }] },
  { id: 'energized', name: 'Energized', stat: 'flat_stamina', description: 'Max Stamina +', tiers: [{ min: 3, max: 6 }, { min: 5, max: 10 }, { min: 8, max: 16 }] },
  { id: 'sharp', name: 'Sharp', stat: 'crit_chance', description: 'Crit chance +%', tiers: [{ min: 1, max: 3 }, { min: 2, max: 5 }, { min: 4, max: 8 }] },
  { id: 'nimble', name: 'Nimble', stat: 'dodge_chance', description: 'Dodge +%', tiers: [{ min: 1, max: 3 }, { min: 2, max: 5 }, { min: 4, max: 8 }] },
  { id: 'brutal', name: 'Brutal', stat: 'flat_atk', description: 'Attack +', tiers: [{ min: 2, max: 5 }, { min: 4, max: 10 }, { min: 8, max: 18 }] },
  { id: 'nourishing', name: 'Nourishing', stat: 'healing_bonus', description: 'Healing efficiency +%', tiers: [{ min: 4, max: 8 }, { min: 6, max: 14 }, { min: 10, max: 20 }] },
  { id: 'resolute', name: 'Resolute', stat: 'status_resistance', description: 'Status resistance +%', tiers: [{ min: 3, max: 8 }, { min: 6, max: 14 }, { min: 10, max: 20 }] },
  { id: 'str_boost', name: 'Mighty', stat: 'flat_str', description: 'STR +', tiers: [{ min: 1, max: 2 }, { min: 2, max: 4 }, { min: 3, max: 6 }] },
  { id: 'def_boost', name: 'Stout', stat: 'flat_def', description: 'DEF +', tiers: [{ min: 1, max: 2 }, { min: 2, max: 4 }, { min: 3, max: 6 }] },
  { id: 'agi_boost', name: 'Swift', stat: 'flat_agi', description: 'AGI +', tiers: [{ min: 1, max: 2 }, { min: 2, max: 4 }, { min: 3, max: 6 }] },
  { id: 'per_boost', name: 'Keen', stat: 'flat_per', description: 'PER +', tiers: [{ min: 1, max: 2 }, { min: 2, max: 4 }, { min: 3, max: 6 }] },
  { id: 'vit_boost', name: 'Vital', stat: 'flat_vit', description: 'VIT +', tiers: [{ min: 1, max: 2 }, { min: 2, max: 4 }, { min: 3, max: 6 }] },
  { id: 'wil_boost', name: 'Willful', stat: 'flat_wil', description: 'WIL +', tiers: [{ min: 1, max: 2 }, { min: 2, max: 4 }, { min: 3, max: 6 }] },
]

export const AFFIX_MAP = Object.fromEntries(AFFIXES.map((a) => [a.id, a])) as Record<string, AffixDef>
