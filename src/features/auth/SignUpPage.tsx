import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

export function SignUpPage({ onToggle }: { onToggle: () => void }) {
  const signUp = useAuthStore((s) => s.signUp)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, displayName)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold text-brand-400 mb-4">Check your email</h1>
          <p className="text-gray-400 mb-6">We sent a confirmation link to {email}</p>
          <button onClick={onToggle} className="text-brand-400 active:text-brand-300">
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-brand-400 text-center mb-2">DUSTBOUND</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500"
            required
          />
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
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500"
            required
          />

          {error && <p className="text-danger-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Already have an account?{' '}
          <button onClick={onToggle} className="text-brand-400 active:text-brand-300">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
