import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Link, Outlet } from '@tanstack/react-router'

const GET_HEADER_IDENTITY = gql`
  query GetHeaderIdentity($tenantId: String!, $userId: String!) {
    tenant: auth_tenants(where: { id: { _eq: $tenantId } }, limit: 1) {
      id
      name
    }
    me: auth_users(where: { id: { _eq: $userId } }, limit: 1) {
      icon
      id
      name
    }
  }
`

type HeaderIdentityQuery = {
  tenant: Array<{
    id: string
    name: string
  }>
  me: Array<{
    icon: string
    id: string
    name: string
  }>
}

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

const TopBar = () => {
  const tenantId = __GRAPHQL_CONFIG__.headers['tenant-id'] ?? 'Unknown tenant'
  const userId = __GRAPHQL_CONFIG__.headers['user-id'] ?? 'Unknown user id'
  const { data: identityData, loading: isLoadingIdentity } =
    useQuery<HeaderIdentityQuery>(GET_HEADER_IDENTITY, {
      variables: { tenantId, userId },
    })

  const tenant = identityData?.tenant.at(0)
  const user = identityData?.me.at(0)
  const tenantName = tenant?.name ?? tenantId
  const username = user?.name ?? userId

  return (
    <header className="flex min-h-16 items-center justify-between border-b border-hw-border bg-hw-surface px-4 sm:px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-hw-control border border-hw-border bg-hw-surface text-lg font-semibold text-hw-muted shadow-hw-panel lg:hidden"
          type="button"
          aria-label="Open navigation"
        >
          =
        </button>
        <div className="min-w-0">
          <p className="m-0 text-[11px] font-semibold tracking-[0.08em] text-hw-faint uppercase">
            Guest operations
          </p>
          <h1 className="m-0 truncate text-xl font-semibold text-hw-ink sm:text-2xl">
            Unified Inbox
          </h1>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="m-0 text-sm font-semibold text-hw-ink">
            {isLoadingIdentity ? 'Loading tenant' : tenantName}
          </p>
          <p className="m-0 text-sm text-hw-muted">
            {isLoadingIdentity ? 'Loading user' : username}
          </p>
        </div>

        {user?.icon ? (
          <img
            alt=""
            className="h-10 w-10 rounded-full bg-hw-orange object-cover shadow-hw-panel"
            src={user.icon}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hw-orange text-lg font-semibold italic text-white shadow-hw-panel">
            H
          </div>
        )}
      </div>
    </header>
  )
}

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
          <TopBar />
          <div className="min-h-0 min-w-0 flex-1">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}
