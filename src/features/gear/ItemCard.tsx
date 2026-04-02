import type { GearItem, Rarity } from '../../lib/types'
import { ITEM_MAP } from '../../data/items'
import { rarityBorderClass, rarityTextClass } from '../../components/ui/RarityBorder'

interface ItemCardProps {
  item: GearItem
  onTap: () => void
  compact?: boolean
}

const SLOT_ICONS: Record<string, string> = {
  weapon: 'W', head: 'H', chest: 'C', legs: 'L', boots: 'B', backpack: 'P', trinket: 'T',
}

const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Common', uncommon: 'Uncommon', rare: 'Rare', epic: 'Epic', relic: 'Relic',
}

export function ItemCard({ item, onTap, compact }: ItemCardProps) {
  const baseDef = ITEM_MAP[item.base_item_id]
  const name = baseDef?.name ?? item.base_item_id

  if (compact) {
    return (
      <button
        onClick={onTap}
        className={`p-2 rounded-lg border bg-gray-900 active:bg-gray-800 transition-colors ${rarityBorderClass(item.rarity)}`}
      >
        <div className="text-[10px] text-gray-500">{SLOT_ICONS[item.slot]}</div>
        <div className={`text-xs font-semibold truncate ${rarityTextClass(item.rarity)}`}>{name}</div>
        <div className="text-[10px] text-gray-600">Lv {item.level}</div>
      </button>
    )
  }

  return (
    <button
      onClick={onTap}
      className={`w-full text-left p-3 rounded-xl border bg-gray-900 active:bg-gray-800 transition-colors ${rarityBorderClass(item.rarity)}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold truncate ${rarityTextClass(item.rarity)}`}>{name}</div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>{RARITY_LABEL[item.rarity]}</span>
            <span>Lv {item.level}</span>
            <span className="capitalize">{item.slot}</span>
          </div>
        </div>
        {item.is_equipped && (
          <span className="text-[10px] bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded shrink-0">Equipped</span>
        )}
      </div>
      {item.affixes.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {item.affixes.map((a, i) => (
            <span key={i} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
              {a.type} +{a.value}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
