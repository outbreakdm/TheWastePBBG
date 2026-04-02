import type { GearItem, Rarity } from '../../lib/types'
import { ITEM_MAP } from '../../data/items'
import { AFFIX_MAP } from '../../data/affixes'
import { SheetModal } from '../../components/ui/SheetModal'
import { rarityTextClass, rarityBgClass } from '../../components/ui/RarityBorder'
import { useInventoryStore } from '../../stores/inventoryStore'
import { useSurvivorStore } from '../../stores/survivorStore'

interface EquipSheetProps {
  item: GearItem | null
  onClose: () => void
}

const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Common', uncommon: 'Uncommon', rare: 'Rare', epic: 'Epic', relic: 'Relic',
}

export function EquipSheet({ item, onClose }: EquipSheetProps) {
  const { equipItem, unequipItem, transferToLocker, salvageItem } = useInventoryStore()
  const activeSurvivor = useSurvivorStore((s) => s.activeSurvivor)

  if (!item) return null

  const baseDef = ITEM_MAP[item.base_item_id]
  const name = baseDef?.name ?? item.base_item_id

  const handleEquip = async () => {
    if (!activeSurvivor) return
    await equipItem(item.id, activeSurvivor.id)
    onClose()
  }

  const handleUnequip = async () => {
    await unequipItem(item.id)
    onClose()
  }

  const handleToLocker = async () => {
    await transferToLocker(item.id)
    onClose()
  }

  const handleSalvage = async () => {
    await salvageItem(item.id)
    onClose()
  }

  return (
    <SheetModal open={!!item} onClose={onClose} title="Item Details">
      <div className="space-y-4">
        {/* Item header */}
        <div className={`rounded-lg p-3 ${rarityBgClass(item.rarity)}`}>
          <h3 className={`text-lg font-bold ${rarityTextClass(item.rarity)}`}>{name}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span>{RARITY_LABEL[item.rarity]}</span>
            <span>Lv {item.level}</span>
            <span className="capitalize">{item.slot}</span>
          </div>
          {baseDef?.description && (
            <p className="text-xs text-gray-500 mt-2 italic">{baseDef.description}</p>
          )}
        </div>

        {/* Base stats */}
        <div className="space-y-1">
          {baseDef?.baseAtk && (
            <StatRow label="Attack" value={`+${baseDef.baseAtk}`} />
          )}
          {baseDef?.baseArmor && (
            <StatRow label="Armor" value={`+${baseDef.baseArmor}`} />
          )}
          {baseDef?.baseHp && (
            <StatRow label="HP" value={`+${baseDef.baseHp}`} />
          )}
          {baseDef?.baseStamina && (
            <StatRow label="Stamina" value={`+${baseDef.baseStamina}`} />
          )}
        </div>

        {/* Affixes */}
        {item.affixes.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Affixes</p>
            {item.affixes.map((a, i) => {
              const affixDef = AFFIX_MAP[a.type]
              return (
                <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded px-3 py-1.5">
                  <span className="text-xs text-gray-300">{affixDef?.name ?? a.type}</span>
                  <span className="text-xs text-brand-300">+{a.value}{affixDef?.stat.includes('flat') ? '' : '%'}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {item.is_equipped ? (
            <button
              onClick={handleUnequip}
              className="w-full py-2.5 bg-gray-800 text-gray-300 text-sm font-semibold rounded-lg active:bg-gray-700 transition-colors"
            >
              Unequip
            </button>
          ) : activeSurvivor ? (
            <button
              onClick={handleEquip}
              className="w-full py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg active:bg-brand-700 transition-colors"
            >
              Equip to {activeSurvivor.name}
            </button>
          ) : null}

          {item.survivor_id && (
            <button
              onClick={handleToLocker}
              className="w-full py-2.5 bg-gray-800 text-gray-300 text-sm font-semibold rounded-lg active:bg-gray-700 transition-colors"
            >
              Send to Locker
            </button>
          )}

          <button
            onClick={handleSalvage}
            className="w-full py-2.5 bg-danger-600/20 text-danger-400 text-sm font-semibold rounded-lg active:bg-danger-600/30 transition-colors"
          >
            Salvage
          </button>
        </div>
      </div>
    </SheetModal>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200 font-semibold">{value}</span>
    </div>
  )
}
