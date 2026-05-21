import { Link, Outlet } from '@tanstack/react-router'
import { UserInfo } from 'containers'

const navItems = [
  { icon: 'OV', label: 'Overview', path: '/overview' },
  { icon: 'CA', label: 'Calendar', path: '/calendar' },
  { icon: 'RS', label: 'Reservations', path: '/reservations' },
  { icon: 'SL', label: 'Smart locks', path: '/smart-locks' },
  { icon: 'IN', label: 'Inbox', path: '/inbox' },
  { icon: 'TA', label: 'Tasks', path: '/tasks' },
  { icon: 'RV', label: 'Reviews', path: '/reviews' },
  { icon: '$', label: 'Guest payments', path: '/guest-payments' },
  { icon: 'FR', label: 'Financial reporting', path: '/financial-reporting' },
  { icon: 'OS', label: 'Owner statements', path: '/owner-statements' },
  { icon: 'LI', label: 'Listings', path: '/listings' },
  { icon: 'CM', label: 'Channel manager', path: '/channel-manager' },
  { icon: 'SE', label: 'Settings', path: '/settings' },
] as const

export const BaseLayout = () => {
  return (
    <main className="min-h-svh bg-hw-app text-sm leading-[1.45] text-hw-ink antialiased">
      <div className="flex min-h-svh">
        <aside className="hidden w-64 shrink-0 border-r border-hw-border bg-hw-surface lg:block">
          <div className="flex h-16 items-center border-b border-hw-border px-6">
            <div className="font-serif text-3xl font-semibold italic text-hw-orange">
              Hostaway
            </div>
          </div>
          <nav className="space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                activeOptions={{ exact: item.path !== '/inbox' }}
                className="flex h-10 items-center gap-3 rounded-hw-control px-3 text-sm font-medium text-hw-muted transition-colors hover:bg-hw-surface-muted hover:text-hw-ink [&.active]:bg-hw-active-soft [&.active]:text-hw-teal-dark"
                to={item.path}
              >
                <span className="flex w-5 justify-center text-[10px] font-bold tracking-tight text-current">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <UserInfo />
          <div className="min-h-0 min-w-0 flex-1">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}
