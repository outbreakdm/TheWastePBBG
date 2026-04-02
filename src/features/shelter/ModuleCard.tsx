import { useState, useEffect } from 'react'
import type { ShelterModule } from '../../lib/types'
import { MODULE_MAP, getModuleBonus } from '../../data/modules'

interface ModuleCardProps {
  module: ShelterModule
  onTap: () => void
}

export function ModuleCard({ module, onTap }: ModuleCardProps) {
  const def = MODULE_MAP[module.module_type]
  const bonus = getModuleBonus(module.module_type, module.tier)
  const hasTask = !!module.task_started_at

  return (
    <button
      onClick={onTap}
      className="w-full text-left bg-gray-900 rounded-xl border border-gray-800 p-4 active:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
          {def.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-100">{def.name}</span>
            <span className="text-[10px] text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">
              Tier {module.tier}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{def.tierDescriptions[module.tier - 1]}</p>
        </div>
      </div>

      {hasTask && <TaskTimer startedAt={module.task_started_at!} />}

      {/* Bonus display */}
      <div className="mt-2 text-[10px] text-gray-600">
        Effect: {formatBonus(module.module_type, bonus)}
      </div>
    </button>
  )
}

function formatBonus(type: string, value: number): string {
  switch (type) {
    case 'bedroll': return `${((value - 1) * 100).toFixed(0)}% stamina regen bonus`
    case 'cookfire': return `${((1 - value) * 100).toFixed(0)}% hunger drain reduction`
    case 'workbench': return `Tier ${value} recipes`
    case 'locker': return `${value} storage slots`
    case 'barricade': return `${(value * 100).toFixed(0)}% loot loss reduction`
    case 'radio': return `Tier ${value} events`
    default: return String(value)
  }
}

function TaskTimer({ startedAt }: { startedAt: string }) {
  const [remaining, setRemaining] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const taskDuration = 5 * 60 * 1000
    const update = () => {
      const elapsed = Date.now() - new Date(startedAt).getTime()
      const left = taskDuration - elapsed
      if (left <= 0) {
        setDone(true)
        setRemaining('Ready!')
      } else {
        const mins = Math.floor(left / 60000)
        const secs = Math.floor((left % 60000) / 1000)
        setRemaining(`${mins}:${secs.toString().padStart(2, '0')}`)
      }
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  return (
    <div className={`mt-2 text-xs px-2 py-1 rounded ${done ? 'bg-success-500/20 text-success-400' : 'bg-stamina/10 text-stamina'}`}>
      {done ? 'Task complete! Tap to collect.' : `Task in progress: ${remaining}`}
    </div>
  )
}
