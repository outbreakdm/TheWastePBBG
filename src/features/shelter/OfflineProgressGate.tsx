import { useOfflineProgress } from '../../hooks/useOfflineProgress'
import { WelcomeBackModal } from '../../components/ui/WelcomeBackModal'

export function OfflineProgressGate({ children }: { children: React.ReactNode }) {
  const { result, applyProgress, dismiss } = useOfflineProgress()

  return (
    <>
      {children}
      {result && (
        <WelcomeBackModal
          result={result}
          onApply={applyProgress}
          onDismiss={dismiss}
        />
      )}
    </>
  )
}
