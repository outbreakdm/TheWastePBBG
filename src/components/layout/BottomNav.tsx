import { NavLink } from 'react-router-dom'
import { useRadioStore } from '../../stores/radioStore'

const tabs = [
  { to: '/', label: 'Run', icon: RunIcon },
  { to: '/shelter', label: 'Shelter', icon: ShelterIcon },
  { to: '/gear', label: 'Gear', icon: GearIcon },
  { to: '/survivors', label: 'Crew', icon: SurvivorsIcon },
  { to: '/radio', label: 'Radio', icon: RadioIcon },
] as const

export function BottomNav() {
  const unreadCount = useRadioStore((s) => s.unreadCount)

  return (
    <nav className="sticky bottom-0 z-40 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors active:bg-gray-800/50 ${
                isActive ? 'text-brand-400' : 'text-gray-500'
              }`
            }
          >
            <div className="relative">
              <tab.icon />
              {tab.to === '/radio' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

// Simple SVG icons — 20x20
function RunIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 16l4-12 4 8 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShelterIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 10l7-6 7 6v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3h8l2 4-6 10-6-10 2-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SurvivorsIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="7" r="3" />
      <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
    </svg>
  )
}

function RadioIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="8" width="14" height="9" rx="1" />
      <path d="M7 8l4-5 2 3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="13" cy="13" r="2" />
    </svg>
  )
}
