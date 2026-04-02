import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { supabase } from '../../lib/supabase'
import { SheetModal } from '../../components/ui/SheetModal'

export function AccountSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, user, signOut, fetchProfile } = useAuthStore()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSaveName = async () => {
    if (!profile || !displayName.trim()) return
    setSaving(true)
    await supabase.from('profiles').update({ display_name: displayName.trim() }).eq('id', profile.id)
    await fetchProfile()
    setMessage('Display name updated!')
    setSaving(false)
    setTimeout(() => setMessage(''), 2000)
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <SheetModal open={open} onClose={onClose} title="Account Settings">
      <div className="space-y-6">
        {/* Account info */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
          <div className="bg-gray-800 rounded-lg p-3 space-y-1">
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm text-gray-300">{user?.email ?? '—'}</p>
          </div>
        </div>

        {/* Display name */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Display Name</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={24}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handleSaveName}
              disabled={saving || displayName.trim() === profile?.display_name}
              className="px-4 py-2 bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {saving ? '...' : 'Save'}
            </button>
          </div>
          {message && <p className="text-xs text-success-400">{message}</p>}
        </div>

        {/* Currencies */}
        {profile && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Currencies</p>
            <div className="grid grid-cols-3 gap-2">
              <CurrencyPill label="Scrap Tokens" value={profile.scrap_tokens} color="text-yellow-400" />
              <CurrencyPill label="Food Packs" value={profile.food_packs} color="text-green-400" />
              <CurrencyPill label="Echo Shards" value={profile.echo_shards} color="text-purple-400" />
            </div>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-danger-500/20 border border-danger-500/30 text-danger-400 font-semibold rounded-xl transition-colors active:bg-danger-500/30"
        >
          Sign Out
        </button>
      </div>
    </SheetModal>
  )
}

function CurrencyPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-2 text-center">
      <div className="text-[10px] text-gray-500">{label}</div>
      <div className={`text-sm font-semibold ${color}`}>{value}</div>
    </div>
  )
}
