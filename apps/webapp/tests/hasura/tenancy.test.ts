import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { graphql } from './graphql'

const GET_THREADS = `
  query GetThreads {
    data_threads(order_by: { updated_at: asc }) {
      id
      tenant_id
      title
      messages(order_by: { sent_at: asc }) {
        id
        tenant_id
        message
      }
    }
  }
`

type Thread = {
  id: string
  tenant_id: string
  title: string
  messages: Array<{
    id: string
    tenant_id: string
    message: string
  }>
}

type ThreadsResult = {
  data_threads: Thread[]
}

const repoRoot = resolve(process.cwd(), '../..')
const makeEnv = {
  ...process.env,
  TERM: 'xterm',
}

const resetBackendState = () => {
  execFileSync('make', ['migrate.rebuild'], {
    cwd: repoRoot,
    env: makeEnv,
    stdio: 'inherit',
  })
  execFileSync('make', ['seed'], {
    cwd: repoRoot,
    env: makeEnv,
    stdio: 'inherit',
  })
}

const getThreads = async (tenantId: string, userId: string) => {
  const result = await graphql<ThreadsResult>(GET_THREADS, {}, {
    tenantId,
    userId,
  })

  expect(result.errors).toBeUndefined()
  return result.data?.data_threads ?? []
}

const messagesFor = (threads: Thread[]) =>
  threads.flatMap((thread) => thread.messages.map((message) => message.message))

const expectTenantRows = (threads: Thread[], tenantId: string) => {
  expect(threads.length).toBeGreaterThan(0)

  for (const thread of threads) {
    expect(thread.tenant_id).toBe(tenantId)
    expect(thread.messages.length).toBeGreaterThan(0)
    expect(thread.messages.every((message) => message.tenant_id === tenantId))
      .toBe(true)
  }
}

describe('Hasura thread message tenancy', () => {
  beforeEach(() => {
    resetBackendState()
  })

  it('returns different persisted messages for existing tenants and no messages for unknown tenants', async () => {
    const greThreads = await getThreads('gre', 'amy')
    const bluThreads = await getThreads('blu', 'cia')
    const unknownThreads = await getThreads('missing-tenant', 'amy')

    expectTenantRows(greThreads, 'gre')
    expectTenantRows(bluThreads, 'blu')

    const greMessages = messagesFor(greThreads)
    const bluMessages = messagesFor(bluThreads)
    const unknownMessages = messagesFor(unknownThreads)

    expect(greMessages.length).toBeGreaterThan(0)
    expect(bluMessages.length).toBeGreaterThan(0)
    expect(greMessages).not.toEqual(bluMessages)
    expect(greMessages).toContain(
      'Hi, we land earlier than expected. Can we check in around noon?',
    )
    expect(bluMessages).toContain(
      'The air conditioner stopped cooling overnight and the bedroom is very warm.',
    )
    expect(unknownThreads).toEqual([])
    expect(unknownMessages).toEqual([])
  })
})
