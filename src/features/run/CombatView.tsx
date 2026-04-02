import { useEffect, useRef } from 'react'
import { useCombatStore } from '../../stores/combatStore'

export function CombatView() {
  const { enemy, turns, currentTurnIndex, advanceTurn, skipToEnd, phase } = useCombatStore()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  // Auto-advance turns
  useEffect(() => {
    if (phase !== 'fighting') return
    timerRef.current = setInterval(() => {
      advanceTurn()
    }, 600)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, advanceTurn])

  // Auto-scroll combat log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [currentTurnIndex])

  if (!enemy) return null

  const visibleTurns = turns.slice(0, currentTurnIndex + 1)
  const currentTurn = visibleTurns[visibleTurns.length - 1]

  return (
    <div className="space-y-4">
      {/* HP bars */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
        {/* Player HP */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-300 font-semibold">You</span>
            <span className="text-hp">{currentTurn?.playerHp ?? '—'} HP</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-hp rounded-full transition-all duration-300"
              style={{ width: `${currentTurn ? (currentTurn.playerHp / (turns[0]?.playerHp ?? 1)) * 100 : 100}%` }}
            />
          </div>
        </div>

        {/* Enemy HP */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-danger-400 font-semibold">{enemy.name}</span>
            <span className="text-danger-400">{currentTurn?.enemyHp ?? enemy.hp} HP</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-danger-500 rounded-full transition-all duration-300"
              style={{ width: `${currentTurn ? (currentTurn.enemyHp / enemy.hp) * 100 : 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Combat log */}
      <div
        ref={logRef}
        className="bg-gray-900 rounded-xl border border-gray-800 p-3 h-48 overflow-y-auto space-y-1"
      >
        {visibleTurns.map((turn, i) => (
          <div
            key={i}
            className={`text-xs py-1 px-2 rounded ${
              turn.actor === 'player'
                ? 'bg-blue-500/10 text-blue-300'
                : 'bg-red-500/10 text-red-300'
            } ${turn.isCrit ? 'font-bold' : ''}`}
          >
            <span className="font-medium">{turn.actor === 'player' ? 'You' : enemy.name}</span>
            {' '}{turn.action}
            {turn.damage > 0 && (
              <span className="ml-1 font-semibold">
                -{turn.damage}
                {turn.isCrit && ' CRIT!'}
              </span>
            )}
            {turn.isDodge && <span className="ml-1 text-green-400">Dodged!</span>}
          </div>
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={skipToEnd}
        className="w-full py-2 bg-gray-800 text-gray-400 text-sm font-medium rounded-lg active:bg-gray-700 transition-colors"
      >
        Skip to Result
      </button>
    </div>
  )
}
