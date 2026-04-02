import { useEffect, useState } from 'react'
import type { GearItem, GearSlot } from '../../lib/types'
import { useAuthStore } from '../../stores/authStore'
import { useInventoryStore } from '../../stores/inventoryStore'
import { useShelterStore } from '../../stores/shelterStore'
import { ItemCard } from './ItemCard'
import { EquipSheet } from './EquipSheet'
import { CraftingSheet } from './CraftingSheet'

const SLOT_FILTERS: { label: string; value: GearSlot | 'all' | 'locker' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Locker', value: 'locker' },
  { label: 'Weapon', value: 'weapon' },
  { label: 'Head', value: 'head' },
  { label: 'Chest', value: 'chest' },
  { label: 'Legs', value: 'legs' },
  { label: 'Boots', value: 'boots' },
  { label: 'Pack', value: 'backpack' },
  { label: 'Trinket', value: 'trinket' },
]

export function GearTab() {
  const profile = useAuthStore((s) => s.profile)
  const { gear, materials, loading, fetchGear, fetchMaterials } = useInventoryStore()
  const workbenchModule = useShelterStore((s) => s.getModule('workbench'))
  const workbenchTier = workbenchModule?.tier ?? 1
  const [filter, setFilter] = useState<GearSlot | 'all' | 'locker'>('all')
  const [selectedItem, setSelectedItem] = useState<GearItem | null>(null)
  const [showCrafting, setShowCrafting] = useState(false)

  useEffect(() => {
    if (profile) {
      fetchGear()
      fetchMaterials()
    }
  }, [profile, fetchGear, fetchMaterials])

  const filteredGear = gear.filter((item) => {
    if (filter === 'locker') return item.survivor_id === null
    if (filter === 'all') return true
    return item.slot === filter
  })

  // Sort: equipped first, then by rarity weight, then level
  const rarityWeight: Record<string, number> = { relic: 5, epic: 4, rare: 3, uncommon: 2, common: 1 }
  const sorted = [...filteredGear].sort((a, b) => {
    if (a.is_equipped !== b.is_equipped) return a.is_equipped ? -1 : 1
    const rw = (rarityWeight[b.rarity] ?? 0) - (rarityWeight[a.rarity] ?? 0)
    if (rw !== 0) return rw
    return b.level - a.level
  })

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Gear</h2>
        <button
          onClick={() => setShowCrafting(true)}
          className="px-3 py-1.5 bg-brand-500 active:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Craft
        </button>
      </div>

      {/* Materials bar */}
      {materials && (
        <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
          <MatPill label="Scrap" value={materials.scrap} />
          <MatPill label="Parts" value={materials.parts} />
          <MatPill label="Cloth" value={materials.cloth} />
          <MatPill label="Alloy" value={materials.alloy} />
          <MatPill label="Relic" value={materials.relic_fragments} />
        </div>
      )}

      {/* Slot filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {SLOT_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
              filter === f.value
                ? 'bg-brand-500 text-white'
                : 'bg-gray-800 text-gray-400 active:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gear list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="text-gray-500 animate-pulse">Loading gear...</span>
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <p className="text-gray-500 text-sm">
            {filter === 'locker' ? 'Shared locker is empty' : 'No gear found'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((item) => (
            <ItemCard key={item.id} item={item} onTap={() => setSelectedItem(item)} />
          ))}
        </div>
      )}

      <EquipSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
      <CraftingSheet
        open={showCrafting}
        onClose={() => { setShowCrafting(false); fetchMaterials() }}
        workbenchTier={workbenchTier}
      />
    </div>
  )
}

function MatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded p-1.5">
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-300 font-semibold">{value}</div>
    </div>
  )
}
