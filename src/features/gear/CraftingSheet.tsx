import { useState } from 'react'
import { SheetModal } from '../../components/ui/SheetModal'
import { RECIPES } from '../../data/recipes'
import { useInventoryStore } from '../../stores/inventoryStore'
import { rarityTextClass } from '../../components/ui/RarityBorder'

interface CraftingSheetProps {
  open: boolean
  onClose: () => void
  workbenchTier: number
}

const MATERIAL_LABELS: Record<string, string> = {
  scrap: 'Scrap', parts: 'Parts', cloth: 'Cloth', alloy: 'Alloy', relic_fragments: 'Relic Frags',
}

export function CraftingSheet({ open, onClose, workbenchTier }: CraftingSheetProps) {
  const { craftItem, materials } = useInventoryStore()
  const [crafting, setCrafting] = useState<string | null>(null)
  const [error, setError] = useState('')

  const available = RECIPES.filter((r) => r.workbenchTier <= workbenchTier)

  const canAfford = (recipe: typeof RECIPES[0]): boolean => {
    if (!materials) return false
    const c = recipe.materials
    return (
      (c.scrap ?? 0) <= materials.scrap &&
      (c.parts ?? 0) <= materials.parts &&
      (c.cloth ?? 0) <= materials.cloth &&
      (c.alloy ?? 0) <= materials.alloy &&
      (c.relic_fragments ?? 0) <= materials.relic_fragments
    )
  }

  const handleCraft = async (recipeId: string) => {
    setError('')
    setCrafting(recipeId)
    try {
      await craftItem(recipeId)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Crafting failed')
    } finally {
      setCrafting(null)
    }
  }

  return (
    <SheetModal open={open} onClose={onClose} title="Crafting">
      <div className="space-y-3">
        {/* Material display */}
        {materials && (
          <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
            {Object.entries(MATERIAL_LABELS).map(([key, label]) => (
              <div key={key} className="bg-gray-800 rounded p-1.5">
                <div className="text-gray-500">{label}</div>
                <div className="text-gray-300 font-semibold">{materials[key as keyof typeof materials] ?? 0}</div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-danger-400 text-sm">{error}</p>}

        {available.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No recipes available at this workbench tier.</p>
        ) : (
          <div className="space-y-2">
            {available.map((recipe) => {
              const affordable = canAfford(recipe)
              return (
                <div
                  key={recipe.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    affordable ? 'border-gray-700 bg-gray-800/50' : 'border-gray-800 bg-gray-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-sm font-semibold ${rarityTextClass(recipe.output.rarity)}`}>
                        {recipe.name}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">{recipe.description}</p>
                    </div>
                    <button
                      onClick={() => handleCraft(recipe.id)}
                      disabled={!affordable || crafting === recipe.id}
                      className="px-3 py-1.5 bg-brand-500 text-white text-xs font-semibold rounded-lg active:bg-brand-700 disabled:opacity-40 transition-colors shrink-0 ml-2"
                    >
                      {crafting === recipe.id ? '...' : 'Craft'}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {Object.entries(recipe.materials).map(([mat, amount]) => (
                      <span
                        key={mat}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          materials && Number(materials[mat as keyof typeof materials] ?? 0) >= (amount ?? 0)
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-danger-600/20 text-danger-400'
                        }`}
                      >
                        {MATERIAL_LABELS[mat] ?? mat}: {amount}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </SheetModal>
  )
}
