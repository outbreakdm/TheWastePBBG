import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useSurvivorStore } from './stores/survivorStore'
import { useShelterStore } from './stores/shelterStore'
import { useRadioStore } from './stores/radioStore'
import { AuthGuard } from './features/auth/AuthGuard'
import { AppShell } from './components/layout/AppShell'
import { OfflineProgressGate } from './features/shelter/OfflineProgressGate'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastContainer } from './components/ui/Toast'
import { TabSkeleton } from './components/ui/Skeleton'

// Lazy-loaded route components for code splitting
const RunTab = lazy(() => import('./features/run/RunTab').then((m) => ({ default: m.RunTab })))
const ShelterTab = lazy(() => import('./features/shelter/ShelterTab').then((m) => ({ default: m.ShelterTab })))
const GearTab = lazy(() => import('./features/gear/GearTab').then((m) => ({ default: m.GearTab })))
const SurvivorsTab = lazy(() => import('./features/survivors/SurvivorsTab').then((m) => ({ default: m.SurvivorsTab })))
const RadioTab = lazy(() => import('./features/radio/RadioTab').then((m) => ({ default: m.RadioTab })))

function AppContent() {
  const profile = useAuthStore((s) => s.profile)
  const fetchSurvivors = useSurvivorStore((s) => s.fetchSurvivors)
  const fetchModules = useShelterStore((s) => s.fetchModules)
  const fetchEvents = useRadioStore((s) => s.fetchEvents)

  useEffect(() => {
    if (profile) {
      fetchSurvivors()
      fetchModules()
      fetchEvents()
    }
  }, [profile, fetchSurvivors, fetchModules, fetchEvents])

  return (
    <OfflineProgressGate>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={
            <ErrorBoundary>
              <Suspense fallback={<TabSkeleton />}>
                <RunTab />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/shelter" element={
            <ErrorBoundary>
              <Suspense fallback={<TabSkeleton />}>
                <ShelterTab />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/gear" element={
            <ErrorBoundary>
              <Suspense fallback={<TabSkeleton />}>
                <GearTab />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/survivors" element={
            <ErrorBoundary>
              <Suspense fallback={<TabSkeleton />}>
                <SurvivorsTab />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/radio" element={
            <ErrorBoundary>
              <Suspense fallback={<TabSkeleton />}>
                <RadioTab />
              </Suspense>
            </ErrorBoundary>
          } />
        </Route>
      </Routes>
    </OfflineProgressGate>
  )
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ToastContainer />
        <AuthGuard>
          <AppContent />
        </AuthGuard>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
