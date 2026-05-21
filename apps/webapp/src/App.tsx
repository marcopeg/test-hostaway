import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { BaseLayout } from 'components/layout/BaseLayout'
import { TodoDetails, TodosList } from 'containers'

const rootRoute = createRootRoute({
  component: BaseLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TodosList,
})

const todoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$todoId',
  component: TodoDetails,
})

const routeTree = rootRoute.addChildren([indexRoute, todoRoute])

const router = createRouter({ routeTree })

export const App = () => {
  return <RouterProvider router={router} />
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
