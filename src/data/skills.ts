export type SkillType = 'active' | 'passive'

export interface SkillDef {
  id: string
  name: string
  type: SkillType
  description: string
  cooldown?: number // seconds, for active skills
  classes?: string[] // if restricted to certain classes; undefined = all
}

export const SKILLS: SkillDef[] = [
  // Active skills
  { id: 'adrenal_surge', name: 'Adrenal Surge', type: 'active', description: 'Instantly restore 20 stamina.', cooldown: 60 },
  { id: 'field_snack', name: 'Field Snack', type: 'active', description: 'Restore 15 hunger during a run.', cooldown: 90 },
  { id: 'brace', name: 'Brace', type: 'active', description: 'Gain +30 temporary armor for one encounter.', cooldown: 45 },
  { id: 'quick_hands', name: 'Quick Hands', type: 'active', description: 'Next scavenging node costs 50% less stamina.', cooldown: 120 },
  { id: 'deadeye', name: 'Deadeye', type: 'active', description: 'Guaranteed crit on next 3 ranged attacks.', cooldown: 60, classes: ['scavenger', 'runner'] },
  { id: 'scrap_sense', name: 'Scrap Sense', type: 'active', description: 'Guaranteed bonus loot on one node.', cooldown: 180 },
  { id: 'battle_cry', name: 'Battle Cry', type: 'active', description: '+25% melee damage for one encounter.', cooldown: 45, classes: ['bruiser', 'warden'] },
  { id: 'smoke_bomb', name: 'Smoke Bomb', type: 'active', description: 'Flee a combat encounter without penalty.', cooldown: 120 },
  { id: 'patch_up', name: 'Patch Up', type: 'active', description: 'Restore 30% max HP mid-run.', cooldown: 90 },
  { id: 'overclock', name: 'Overclock', type: 'active', description: 'Double crafting speed for 5 minutes.', cooldown: 300, classes: ['tinkerer'] },
  { id: 'second_wind', name: 'Second Wind', type: 'active', description: 'Restore 40 stamina when below 20%.', cooldown: 180 },
  { id: 'fortify', name: 'Fortify', type: 'active', description: 'Shelter barricade effect doubled for 1 hour.', cooldown: 600, classes: ['warden'] },
  { id: 'sprint', name: 'Sprint', type: 'active', description: 'Travel to next node costs 0 stamina.', cooldown: 90, classes: ['runner'] },

  // Passive skills
  { id: 'thick_hide', name: 'Thick Hide', type: 'passive', description: '+5% damage reduction at all times.' },
  { id: 'keen_eye', name: 'Keen Eye', type: 'passive', description: '+3% crit chance.' },
  { id: 'efficient_rest', name: 'Efficient Rest', type: 'passive', description: 'Stamina regen +15% while in shelter.' },
  { id: 'pack_rat', name: 'Pack Rat', type: 'passive', description: '+8 carry capacity.' },
  { id: 'iron_stomach', name: 'Iron Stomach', type: 'passive', description: 'Hunger drains 8% slower.' },
  { id: 'scavenger_eye', name: "Scavenger's Eye", type: 'passive', description: '+10% salvage bonus.' },
  { id: 'nimble', name: 'Nimble', type: 'passive', description: '+4% dodge chance.' },
  { id: 'steady_aim', name: 'Steady Aim', type: 'passive', description: '+12% ranged power.' },
  { id: 'brute_force', name: 'Brute Force', type: 'passive', description: '+12% melee power.' },
  { id: 'survival_instinct', name: 'Survival Instinct', type: 'passive', description: 'Auto-heal 5% HP after each encounter.' },
  { id: 'treasure_hunter', name: 'Treasure Hunter', type: 'passive', description: '+5% rare gear drop chance.' },
  { id: 'metabolic_control', name: 'Metabolic Control', type: 'passive', description: 'Hunger penalties are 25% weaker.' },
]

export const SKILL_MAP = Object.fromEntries(SKILLS.map((s) => [s.id, s])) as Record<string, SkillDef>
