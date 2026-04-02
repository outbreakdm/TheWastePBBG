import type { Survivor } from '../../lib/types'
import { computeDerivedStats } from '../../lib/formulas'
import { useSurvivorStore } from '../../stores/survivorStore'

const STAT_LABELS = {
  str: { name: 'STR', desc: 'Melee, carry, obstacles' },
  def: { name: 'DEF', desc: 'Damage reduction, block' },
  agi: { name: 'AGI', desc: 'Speed, dodge, efficiency' },
  per: { name: 'PER', desc: 'Crit, loot quality' },
  vit: { name: 'VIT', desc: 'HP, stamina, hunger res' },
  wil: { name: 'WIL', desc: 'Debuff res, recovery' },
} as const

type StatKey = keyof typeof STAT_LABELS

export function StatBlock({ survivor }: { survivor: Survivor }) {
  const allocateStat = useSurvivorStore((s) => s.allocateStat)
  const canAllocate = survivor.stat_points > 0

  const base = { str: survivor.str, def: survivor.def, agi: survivor.agi, per: survivor.per, vit: survivor.vit, wil: survivor.wil }
  const derived = computeDerivedStats(base)

  return (
    <div className="space-y-4">
      {canAllocate && (
        <div className="bg-xp/10 border border-xp/30 rounded-lg px-3 py-2 text-xs text-xp text-center">
          {survivor.stat_points} stat point{survivor.stat_points > 1 ? 's' : ''} available
        </div>
      )}

      <div className="space-y-1.5">
        {(Object.keys(STAT_LABELS) as StatKey[]).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-10 text-xs font-bold text-brand-400">{STAT_LABELS[key].name}</div>
            <div className="flex-1">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500/60 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (survivor[key] / 30) * 100)}%` }}
                />
              </div>
            </div>
            <span className="w-6 text-right text-xs font-semibold text-gray-200">{survivor[key]}</span>
            {canAllocate && (
              <button
                onClick={() => allocateStat(survivor.id, key)}
                className="w-6 h-6 flex items-center justify-center bg-xp/20 text-xp rounded text-xs font-bold active:bg-xp/40"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Derived</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <DerivedRow label="Max HP" value={Math.floor(derived.maxHp)} />
          <DerivedRow label="Max Stamina" value={Math.floor(derived.maxStamina)} />
          <DerivedRow label="Stam Regen/s" value={derived.staminaRegen.toFixed(2)} />
          <DerivedRow label="Hunger Drain" value={`${(derived.hungerDrainMultiplier * 100).toFixed(0)}%`} />
          <DerivedRow label="Melee Power" value={Math.floor(derived.meleePower)} />
          <DerivedRow label="Ranged Power" value={Math.floor(derived.rangedPower)} />
          <DerivedRow label="Crit Chance" value={`${(derived.critChance * 100).toFixed(1)}%`} />
          <DerivedRow label="Dodge" value={`${(derived.dodgeChance * 100).toFixed(1)}%`} />
          <DerivedRow label="Armor" value={Math.floor(derived.armor)} />
          <DerivedRow label="Carry Cap" value={Math.floor(derived.carryCapacity)} />
        </div>
      </div>
    </div>
  )
}

function DerivedRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-300 font-medium">{value}</span>
    </div>
  )
}
