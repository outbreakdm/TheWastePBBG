import { NODE_TYPES, type NodeType } from '../../data/nodes'

interface SectorNodeProps {
  nodeType: NodeType
  cleared: boolean
  staminaCost: number
  onTap: () => void
}

const NODE_COLORS: Record<NodeType, string> = {
  combat: 'bg-red-500/20 border-red-500/40 text-red-400',
  scavenge: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  rest: 'bg-green-500/20 border-green-500/40 text-green-400',
  event: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  hazard: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  boss: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
}

export function SectorNode({ nodeType, cleared, staminaCost, onTap }: SectorNodeProps) {
  const nodeDef = NODE_TYPES[nodeType]
  const colorClass = NODE_COLORS[nodeType]

  return (
    <button
      onClick={onTap}
      className={`shrink-0 w-16 h-16 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
        cleared ? 'opacity-40 border-gray-700 bg-gray-800/50' : colorClass
      }`}
    >
      <span className="text-sm font-bold">{nodeDef.icon}</span>
      <span className="text-[9px] leading-tight">{nodeDef.label}</span>
      {!cleared && (
        <span className="text-[8px] text-gray-500">{staminaCost} STA</span>
      )}
      {cleared && (
        <span className="text-[8px] text-success-400">Done</span>
      )}
    </button>
  )
}
