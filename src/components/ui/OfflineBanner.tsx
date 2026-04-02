import { useEffect, useState } from 'react'

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!offline) return null

  return (
    <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-2 text-center">
      <span className="text-yellow-400 text-xs font-medium">
        You're offline — some features may be limited
      </span>
    </div>
  )
}
