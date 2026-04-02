import { useState } from 'react'
import type { Survivor } from '../../lib/types'
import { SKILLS, SKILL_MAP } from '../../data/skills'
import { SheetModal } from '../../components/ui/SheetModal'
import { useSurvivorStore } from '../../stores/survivorStore'

export function SkillSlots({ survivor }: { survivor: Survivor }) {
  const equipSkill = useSurvivorStore((s) => s.equipSkill)
  const [pickingSlot, setPickingSlot] = useState<number | null>(null)

  const slots = survivor.skill_slots.length >= 3
    ? survivor.skill_slots
    : [...survivor.skill_slots, '', '', ''].slice(0, 3)

  const availableSkills = SKILLS.filter((s) => {
    if (s.classes && !s.classes.includes(survivor.class)) return false
    return true
  })

  const handlePick = async (skillId: string | null) => {
    if (pickingSlot === null) return
    await equipSkill(survivor.id, pickingSlot, skillId)
    setPickingSlot(null)
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Skills (3 slots)</p>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((skillId, idx) => {
            const skill = skillId ? SKILL_MAP[skillId] : null
            return (
              <button
                key={idx}
                onClick={() => setPickingSlot(idx)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 min-h-[72px] flex flex-col items-center justify-center active:bg-gray-700 transition-colors"
              >
                {skill ? (
                  <>
                    <span className="text-xs font-semibold text-gray-200 text-center leading-tight">{skill.name}</span>
                    <span className={`text-[10px] mt-0.5 ${skill.type === 'active' ? 'text-stamina' : 'text-success-400'}`}>
                      {skill.type}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-600">Empty</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <SheetModal
        open={pickingSlot !== null}
        onClose={() => setPickingSlot(null)}
        title={`Slot ${(pickingSlot ?? 0) + 1} — Pick Skill`}
      >
        <div className="space-y-2">
          <button
            onClick={() => handlePick(null)}
            className="w-full text-left p-3 rounded-lg border border-gray-800 bg-gray-800/50 active:bg-gray-700 transition-colors"
          >
            <span className="text-sm text-gray-500">Clear slot</span>
          </button>
          {availableSkills.map((skill) => {
            const equipped = slots.includes(skill.id)
            return (
              <button
                key={skill.id}
                onClick={() => handlePick(skill.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors active:bg-gray-700 ${
                  equipped ? 'border-brand-500/50 bg-brand-500/5' : 'border-gray-800 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-200">{skill.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    skill.type === 'active' ? 'bg-stamina/20 text-stamina' : 'bg-success-500/20 text-success-400'
                  }`}>
                    {skill.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{skill.description}</p>
                {skill.cooldown && (
                  <p className="text-[10px] text-gray-600 mt-0.5">{skill.cooldown}s cooldown</p>
                )}
                {equipped && <p className="text-[10px] text-brand-400 mt-1">Currently equipped</p>}
              </button>
            )
          })}
        </div>
      </SheetModal>
    </>
  )
}
