import { useEffect, useState, useCallback } from 'react'
import { create } from 'zustand'

type ToastType = 'info' | 'success' | 'error' | 'warning'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastStore {
  toasts: ToastItem[]
  add: (message: string, type?: ToastType) => void
  remove: (id: number) => void
}

let nextId = 0

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'info') => {
    const id = ++nextId
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
  },
  remove: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },
}))

// Convenience helpers
export const toast = {
  info: (msg: string) => useToastStore.getState().add(msg, 'info'),
  success: (msg: string) => useToastStore.getState().add(msg, 'success'),
  error: (msg: string) => useToastStore.getState().add(msg, 'error'),
  warning: (msg: string) => useToastStore.getState().add(msg, 'warning'),
}

const TYPE_STYLES: Record<ToastType, string> = {
  info: 'bg-gray-800 border-gray-600 text-gray-200',
  success: 'bg-success-500/20 border-success-500/30 text-success-400',
  error: 'bg-danger-500/20 border-danger-500/30 text-danger-400',
  warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed top-[env(safe-area-inset-top)] left-0 right-0 z-[100] flex flex-col items-center gap-2 p-4 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}

function ToastItem({ toast: t }: { toast: ToastItem }) {
  const remove = useToastStore((s) => s.remove)
  const [visible, setVisible] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    setTimeout(() => remove(t.id), 200)
  }, [remove, t.id])

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(dismiss, 3000)
    return () => clearTimeout(timer)
  }, [dismiss])

  return (
    <div
      className={`pointer-events-auto max-w-sm w-full px-4 py-3 rounded-xl border text-sm font-medium shadow-lg transition-all duration-200 ${TYPE_STYLES[t.type]} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      onClick={dismiss}
    >
      {t.message}
    </div>
  )
}
