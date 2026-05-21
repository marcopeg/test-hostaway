import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import { BaseLayout } from 'components/layout/BaseLayout'
import { InboxView } from './views/inbox'
import { WorkInProgressView } from './views/work-in-progress'

const rootRoute = createRootRoute({
  component: BaseLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/inbox' })
  },
})

const inboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inbox',
  component: () => <InboxView />,
})

const inboxThreadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inbox/$threadId',
  component: () => {
    const { threadId } = inboxThreadRoute.useParams()

    return <InboxView threadId={threadId} />
  },
})

const workInProgressRoutes = [
  ['/overview', 'Overview'],
  ['/calendar', 'Calendar'],
  ['/reservations', 'Reservations'],
  ['/smart-locks', 'Smart locks'],
  ['/tasks', 'Tasks'],
  ['/reviews', 'Reviews'],
  ['/guest-payments', 'Guest payments'],
  ['/financial-reporting', 'Financial reporting'],
  ['/owner-statements', 'Owner statements'],
  ['/listings', 'Listings'],
  ['/channel-manager', 'Channel manager'],
  ['/settings', 'Settings'],
] as const

const wipRoutes = workInProgressRoutes.map(([path, title]) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => <WorkInProgressView title={title} />,
  }),
)

const routeTree = rootRoute.addChildren([
  indexRoute,
  inboxRoute,
  inboxThreadRoute,
  ...wipRoutes,
])

const router = createRouter({ routeTree })

export const App = () => {
  return <RouterProvider router={router} />
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
