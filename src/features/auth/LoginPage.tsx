import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

export function LoginPage({ onToggle }: { onToggle: () => void }) {
  const signIn = useAuthStore((s) => s.signIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-brand-400 text-center mb-2">DUSTBOUND</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Survive the wasteland</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500"
            required
          />

          {error && <p className="text-danger-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          No account?{' '}
          <button onClick={onToggle} className="text-brand-400 active:text-brand-300">
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
