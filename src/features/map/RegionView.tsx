import type { Region } from '../../lib/types'
import { REGION_MAP } from '../../data/regions'
import { generateSectorNodes, NODE_TYPES } from '../../data/nodes'
import { useMapStore } from '../../stores/mapStore'
import { SectorNode } from './SectorNode'
import type { NodeType } from '../../data/nodes'

interface RegionViewProps {
  region: Region
  onBack: () => void
  onSelectNode: (sector: number, nodeIndex: number, nodeType: NodeType, staminaCost: number) => void
}

export function RegionView({ region, onBack, onSelectNode }: RegionViewProps) {
  const regionDef = REGION_MAP[region]
  const { getHighestSector, isSectorCleared, isNodeCleared } = useMapStore()
  const highestSector = getHighestSector(region)

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-sm text-gray-500 active:text-gray-300 flex items-center gap-1"
      >
        &larr; World Map
      </button>

      <div className={`rounded-xl p-3 border border-gray-800 ${regionDef.bgColor}`}>
        <h3 className={`font-bold text-lg ${regionDef.color}`}>{regionDef.name}</h3>
        <p className="text-xs text-gray-500 mt-1">Lv {regionDef.levelRange[0]}–{regionDef.levelRange[1]}</p>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((sector) => {
          const nodes = generateSectorNodes(sector)
          const locked = sector > highestSector
          const cleared = isSectorCleared(region, sector, nodes.length)

          return (
            <div key={sector} className={`rounded-xl border p-3 ${
              locked ? 'border-gray-800/50 opacity-40' : cleared ? 'border-success-500/30 bg-success-500/5' : 'border-gray-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-300">
                  Sector {sector}
                  {sector === 10 && <span className="text-danger-400 ml-1">(Boss)</span>}
                </h4>
                {cleared && <span className="text-[10px] text-success-400">Cleared</span>}
                {locked && <span className="text-[10px] text-gray-600">Locked</span>}
              </div>

              {!locked && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {nodes.map((nodeType, nodeIdx) => {
                    const nodeDef = NODE_TYPES[nodeType]
                    const nodeCleared = isNodeCleared(region, sector, nodeIdx)
                    const cost = Math.ceil(regionDef.staminaCost * nodeDef.staminaMultiplier)
                    return (
                      <SectorNode
                        key={nodeIdx}
                        nodeType={nodeType}
                        cleared={nodeCleared}
                        staminaCost={cost}
                        onTap={() => onSelectNode(sector, nodeIdx, nodeType, cost)}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
