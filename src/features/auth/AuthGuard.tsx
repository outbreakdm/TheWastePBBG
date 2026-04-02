import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { LoginPage } from './LoginPage'
import { SignUpPage } from './SignUpPage'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthStore()
  const [showSignUp, setShowSignUp] = useState(false)

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-brand-400 text-lg animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return showSignUp
      ? <SignUpPage onToggle={() => setShowSignUp(false)} />
      : <LoginPage onToggle={() => setShowSignUp(true)} />
  }

  return <>{children}</>
}
