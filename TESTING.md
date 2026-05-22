# Testing Strategy

This project currently has no automated tests. The recommended setup is:

- Vitest for Hasura GraphQL API tests that validate permissions, happy paths, and tenant isolation.
- Playwright for browser-level happy path and visual end-to-end checks around the inbox.

The examples below assume the default local stack:

- Hasura GraphQL: `http://localhost:8080/v1/graphql`
- Hasura admin secret: `hasura`
- Frontend: `http://localhost:5173`
- Seed tenants: `gre`, `blu`, `sun`
- Seed users: `amy`, `ben`, `cia`

## Local Test Lifecycle

Start Hasura and apply the current migrations, metadata, and seed data:

```bash
make down
make start
make init
```

Start the frontend when running Playwright:

```bash
make app.start
```

For a clean test run, reset the backend state before the suite:

```bash
make down
make start
make init
```

## Install Test Dependencies

Install Vitest and Playwright inside the webapp package, because this is where the frontend build and TypeScript config live:

```bash
cd apps/webapp
npm install -D vitest @playwright/test
npx playwright install
```

Add scripts to `apps/webapp/package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

Suggested file layout:

```text
apps/webapp/
  playwright.config.ts
  tests/
    hasura/
      graphql.ts
      tenancy.test.ts
    e2e/
      inbox.spec.ts
```

## Vitest: Hasura Tenancy Tests

These tests should call Hasura directly with normal application headers, not with admin-only queries. The goal is to prove that the `user` role can only see and mutate rows scoped to `x-hasura-tenant-id`.

Create `apps/webapp/tests/hasura/graphql.ts`:

```ts
type GraphQLHeaders = {
  role?: string
  tenantId: string
  userId: string
}

type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

const endpoint =
  process.env.HASURA_GRAPHQL_URL ?? 'http://localhost:8080/v1/graphql'
const adminSecret = process.env.HASURA_ADMIN_SECRET ?? 'hasura'

export const graphql = async <T>(
  query: string,
  variables: Record<string, unknown>,
  headers: GraphQLHeaders,
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': adminSecret,
      'x-hasura-role': headers.role ?? 'user',
      'x-hasura-tenant-id': headers.tenantId,
      'x-hasura-user-id': headers.userId,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`Hasura request failed: ${response.status}`)
  }

  return (await response.json()) as GraphQLResponse<T>
}
```

Create `apps/webapp/tests/hasura/tenancy.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { graphql } from './graphql'

const GET_THREADS = `
  query GetThreads {
    data_threads(order_by: { updated_at: asc }) {
      id
      tenant_id
      title
      messages {
        id
        tenant_id
        message
      }
      pending_messages {
        id
        tenant_id
        message
      }
    }
  }
`

const SEND_PENDING = `
  mutation SendPending($threadId: uuid!, $message: String!, $sentAt: timestamptz!) {
    insert_data_messages_pending_one(
      object: { thread_id: $threadId, message: $message, sent_at: $sentAt }
    ) {
      id
      tenant_id
      operator_id
      thread_id
      message
    }
  }
`

type ThreadsResult = {
  data_threads: Array<{
    id: string
    tenant_id: string
    title: string
    messages: Array<{ id: string; tenant_id: string; message: string }>
    pending_messages: Array<{ id: string; tenant_id: string; message: string }>
  }>
}

type SendPendingResult = {
  insert_data_messages_pending_one: {
    id: string
    tenant_id: string
    operator_id: string
    thread_id: string
    message: string
  } | null
}

describe('Hasura tenancy isolation', () => {
  it('returns only rows for the requested tenant', async () => {
    const result = await graphql<ThreadsResult>(GET_THREADS, {}, {
      tenantId: 'gre',
      userId: 'amy',
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.data_threads.length).toBeGreaterThan(0)
    expect(result.data?.data_threads.every((thread) => thread.tenant_id === 'gre')).toBe(true)
    expect(result.data?.data_threads.some((thread) => thread.title === 'Arrival time and door code')).toBe(true)
    expect(result.data?.data_threads.some((thread) => thread.title === 'Air conditioning stopped cooling')).toBe(false)
  })

  it('scopes nested messages and pending messages to the same tenant', async () => {
    const result = await graphql<ThreadsResult>(GET_THREADS, {}, {
      tenantId: 'blu',
      userId: 'cia',
    })

    expect(result.errors).toBeUndefined()
    const rows = result.data?.data_threads ?? []

    expect(rows.every((thread) => thread.tenant_id === 'blu')).toBe(true)
    expect(rows.flatMap((thread) => thread.messages).every((message) => message.tenant_id === 'blu')).toBe(true)
    expect(rows.flatMap((thread) => thread.pending_messages).every((message) => message.tenant_id === 'blu')).toBe(true)
  })

  it('allows a tenant user to reply to a thread in the same tenant', async () => {
    const result = await graphql<SendPendingResult>(SEND_PENDING, {
      threadId: '00000000-0000-4000-8000-000000002001',
      message: `Vitest pending reply ${Date.now()}`,
      sentAt: new Date().toISOString(),
    }, {
      tenantId: 'gre',
      userId: 'amy',
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.insert_data_messages_pending_one).toMatchObject({
      tenant_id: 'gre',
      operator_id: 'amy',
      thread_id: '00000000-0000-4000-8000-000000002001',
    })
  })

  it('rejects inserting a pending message into another tenant thread', async () => {
    const result = await graphql<SendPendingResult>(SEND_PENDING, {
      threadId: '00000000-0000-4000-8000-000000002003',
      message: `Cross-tenant reply ${Date.now()}`,
      sentAt: new Date().toISOString(),
    }, {
      tenantId: 'gre',
      userId: 'amy',
    })

    expect(result.data?.insert_data_messages_pending_one).toBeNull()
    expect(result.errors?.[0]?.message).toContain('check constraint')
  })

  it('treats an unknown tenant as an empty scope', async () => {
    const result = await graphql<ThreadsResult>(GET_THREADS, {}, {
      tenantId: 'xxx',
      userId: 'amy',
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.data_threads).toEqual([])
  })
})
```

Run the suite:

```bash
cd apps/webapp
npm run test -- tests/hasura
```

### Hasura Cases To Cover

Happy paths:

- `gre` user can list only `gre` threads.
- `blu` user can list only `blu` threads.
- Nested relationships on threads, messages, listings, bookings, guests, and pending messages are tenant-filtered.
- A user can insert a pending message for a thread in their tenant.
- Inserted pending messages get `tenant_id` and `operator_id` from Hasura session headers.

Edge cases:

- A `gre` user cannot insert a pending message for a `blu` thread.
- A `gre` user cannot query a `blu` thread by primary key.
- Unknown tenant headers return an empty result, not cross-tenant data.
- Missing `x-hasura-tenant-id` fails closed.
- Missing `x-hasura-user-id` should fail for inserts that depend on `operator_id`.
- Aggregates return counts for the current tenant only.
- User relationship permissions do not expose unrelated operators except through tenant-visible messages.

## Playwright: Browser E2E And Visual Checks

Playwright should validate that the product workflow works through the browser:

1. Open the app.
2. Land on the inbox.
3. Navigate to a seeded thread.
4. Open the reply composer.
5. Submit a reply.
6. See the reply appear as a pending operator response.
7. Capture screenshots for visual regression.

Create `apps/webapp/playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

Create `apps/webapp/tests/e2e/inbox.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test.describe('inbox', () => {
  test('opens a thread and submits a pending reply', async ({ page }) => {
    await page.goto('/inbox')

    await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible()
    await expect(page.getByText('Arrival time and door code')).toBeVisible()
    await expect(page).toHaveScreenshot('inbox-list.png', {
      fullPage: true,
      animations: 'disabled',
    })

    await page.getByText('Arrival time and door code').click()

    await expect(page.getByRole('heading', { name: 'Arrival time and door code' })).toBeVisible()
    await expect(page.getByText('That works. Could you also resend the door code?')).toBeVisible()
    await expect(page).toHaveScreenshot('inbox-thread.png', {
      fullPage: true,
      animations: 'disabled',
    })

    const reply = `Playwright pending reply ${Date.now()}`

    await page.getByRole('button', { name: /reply/i }).click()
    await page.getByPlaceholder(/reply about|reply to this conversation/i).fill(reply)
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText(reply)).toBeVisible()
    await expect(page.getByText('Pending send')).toBeVisible()
  })
})
```

Run the suite:

```bash
cd apps/webapp
npm run test:e2e
```

Update visual snapshots intentionally:

```bash
cd apps/webapp
npm run test:e2e -- --update-snapshots
```

### Selector Hardening

The current UI can be tested with visible text and accessible roles. For long-term stability, add `data-testid` attributes to the main workflow targets:

- `inbox-thread-link-${thread.id}`
- `reply-open-button`
- `reply-textarea`
- `reply-submit-button`
- `pending-message-${message.id}`

Prefer role and label selectors when the interaction is user-facing. Use `data-testid` only where the visual label is dynamic or duplicated.

## CI Shape

A minimal CI job should run:

```bash
make down
make start
make init
cd apps/webapp
npm ci
npm run lint
npm run build
npm run test
npm run test:e2e
```

For reliable CI, split API tests and browser tests into separate jobs:

- API job: backend only, runs `npm run test -- tests/hasura`.
- E2E job: backend plus Vite dev server, runs `npm run test:e2e`.

If test runtime becomes a problem, move the backend lifecycle into Testcontainers so each Vitest worker gets an isolated Hasura/Postgres instance. Until then, keep Hasura tests serial or reset the backend before each suite to avoid pending-message inserts leaking between tests.
