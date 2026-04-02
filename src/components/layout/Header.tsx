import { useAuthStore } from '../../stores/authStore'

export function Header() {
  const profile = useAuthStore((s) => s.profile)

  return (
    <header className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 px-4 py-2">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <span className="text-brand-400 font-bold text-sm tracking-wider">DUSTBOUND</span>

        <div className="flex items-center gap-3 text-xs">
          <ResourcePill icon="S" value={profile?.scrap_tokens ?? 0} color="text-gray-300" />
          <ResourcePill icon="F" value={profile?.food_packs ?? 0} color="text-hunger" />
          <ResourcePill icon="E" value={profile?.echo_shards ?? 0} color="text-xp" />
        </div>
      </div>
    </header>
  )
}

function ResourcePill({ icon, value, color }: { icon: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`font-bold ${color}`}>{icon}</span>
      <span className="text-gray-400">{value}</span>
    </div>
  )
}
