export interface TraitDef {
  id: string
  name: string
  description: string
  effect: string
}

export const TRAITS: TraitDef[] = [
  { id: 'iron_gut', name: 'Iron Gut', description: 'A stomach that can handle anything.', effect: 'Hunger drains 12% slower' },
  { id: 'night_eyes', name: 'Night Eyes', description: 'See what others miss in the dark.', effect: 'Better loot in dark zones' },
  { id: 'steady_hands', name: 'Steady Hands', description: 'Rock-solid aim under pressure.', effect: 'Ranged crit +8%' },
  { id: 'pack_mule', name: 'Pack Mule', description: 'Carries twice what anyone expects.', effect: '+20 carry capacity' },
  { id: 'last_breath', name: 'Last Breath', description: 'Refuses to go down easily.', effect: 'Once per run, avoid fatal damage' },
  { id: 'hard_sleeper', name: 'Hard Sleeper', description: 'Recovers deeply when resting.', effect: 'Rest recovers more stamina offline' },
  { id: 'scrap_nose', name: 'Scrap Nose', description: 'Can smell valuable salvage a mile away.', effect: '+15% salvage drops' },
  { id: 'quick_feet', name: 'Quick Feet', description: 'Always the first to react.', effect: '+10% dodge chance' },
  { id: 'thick_skin', name: 'Thick Skin', description: 'Scars upon scars.', effect: '+8% damage reduction' },
  { id: 'lucky_find', name: 'Lucky Find', description: 'Luck favors the desperate.', effect: '+5% rare loot chance' },
  { id: 'field_medic', name: 'Field Medic', description: 'Knows how to patch up in a pinch.', effect: '+20% healing efficiency' },
  { id: 'adrenaline_junkie', name: 'Adrenaline Junkie', description: 'Thrives under danger.', effect: '+10% damage when below 40% HP' },
  { id: 'silent_step', name: 'Silent Step', description: 'Moves without a sound.', effect: 'Reduced encounter rate in hazard zones' },
  { id: 'born_leader', name: 'Born Leader', description: 'Inspires confidence.', effect: '+5% XP gain' },
  { id: 'resourceful', name: 'Resourceful', description: 'Makes something from nothing.', effect: '+10% crafting material yield' },
  { id: 'cold_blooded', name: 'Cold Blooded', description: 'Unshaken by the horrors of the waste.', effect: '+15% status resistance' },
  { id: 'scavenger_instinct', name: "Scavenger's Instinct", description: 'Knows where the good stuff hides.', effect: '+1 loot roll per node' },
  { id: 'tough_bones', name: 'Tough Bones', description: 'Hard to break.', effect: '+15 max HP' },
  { id: 'light_packer', name: 'Light Packer', description: 'Travels lean, moves fast.', effect: '-8% stamina cost for travel' },
  { id: 'radiation_resistant', name: 'Radiation Resistant', description: 'Built different.', effect: 'Reduced hazard damage in toxic zones' },
  { id: 'bargain_hunter', name: 'Bargain Hunter', description: 'Always finds a deal.', effect: '-10% upgrade costs' },
  { id: 'sharp_eyes', name: 'Sharp Eyes', description: 'Nothing escapes notice.', effect: '+5% crit chance' },
  { id: 'endurance_runner', name: 'Endurance Runner', description: 'Can go all day.', effect: '+10 max stamina' },
  { id: 'combat_veteran', name: 'Combat Veteran', description: 'Seen it all before.', effect: '+8% melee damage' },
  { id: 'hoarder', name: 'Hoarder', description: 'Never throws anything away.', effect: '+10 carry capacity' },
  { id: 'dusk_walker', name: 'Dusk Walker', description: 'Comfortable in the twilight.', effect: '+5% dodge in dark zones' },
  { id: 'iron_will', name: 'Iron Will', description: 'Mind over matter.', effect: '+10% debuff resistance' },
  { id: 'quick_draw', name: 'Quick Draw', description: 'Fastest hands in the wastes.', effect: '+10% attack speed' },
  { id: 'deep_pockets', name: 'Deep Pockets', description: 'Always has something useful stashed.', effect: 'Start runs with 1 random consumable' },
  { id: 'wasteland_born', name: 'Wasteland Born', description: 'The waste is home.', effect: '+3 to all base stats' },
]

export const TRAIT_MAP = Object.fromEntries(TRAITS.map((t) => [t.id, t])) as Record<string, TraitDef>
