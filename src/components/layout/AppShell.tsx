import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { OfflineBanner } from '../ui/OfflineBanner'

export function AppShell() {
  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      <Header />
      <OfflineBanner />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
