import { useEffect, useRef } from 'react'

interface SheetModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function SheetModal({ open, onClose, title, children }: SheetModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-lg bg-gray-900 rounded-t-2xl border-t border-gray-700 max-h-[85vh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-500 active:text-gray-300 rounded-full"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}
