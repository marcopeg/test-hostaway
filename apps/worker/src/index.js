import pg from 'pg'

const { Pool } = pg

const databaseUrl =
  process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/postgres'
const hasuraHealthUrl = process.env.HASURA_HEALTH_URL ?? 'http://localhost:8080/healthz'
const pollIntervalMs = Number.parseInt(process.env.POLL_INTERVAL_MS ?? '5000', 10)
const healthPollIntervalMs = Number.parseInt(
  process.env.HEALTH_POLL_INTERVAL_MS ?? '1000',
  10,
)

if (!Number.isFinite(pollIntervalMs) || pollIntervalMs <= 0) {
  throw new Error('POLL_INTERVAL_MS must be a positive integer')
}

if (!Number.isFinite(healthPollIntervalMs) || healthPollIntervalMs <= 0) {
  throw new Error('HEALTH_POLL_INTERVAL_MS must be a positive integer')
}

const pool = new Pool({ connectionString: databaseUrl })
let isStopping = false

const log = (message, details = undefined) => {
  if (details) {
    console.log(`[worker] ${message}`, details)
    return
  }

  console.log(`[worker] ${message}`)
}

const sleep = (durationMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, durationMs)
  })

const waitForHasura = async () => {
  log(`waiting for Hasura health at ${hasuraHealthUrl}`)

  while (!isStopping) {
    try {
      const response = await fetch(hasuraHealthUrl)

      if (response.ok) {
        log('Hasura is healthy')
        return
      }

      log(`Hasura health returned ${response.status}`)
    } catch (error) {
      log('Hasura health is not ready', { error: error.message })
    }

    await sleep(healthPollIntervalMs)
  }
}

const getPendingMessage = async (client) => {
  const result = await client.query(`
    SELECT id, thread_id, tenant_id, operator_id, message, sent_at
    FROM data.messages_pending
    ORDER BY sent_at ASC, id ASC
    LIMIT 1
  `)

  return result.rows[0] ?? null
}

const deliverPendingMessage = async (client, pendingMessage) => {
  const insertResult = await client.query(
    `
      INSERT INTO data.messages (
        thread_id,
        tenant_id,
        operator_id,
        guest_id,
        message,
        sent_at
      )
      VALUES ($1, $2, $3, NULL, $4, $5)
      RETURNING id
    `,
    [
      pendingMessage.thread_id,
      pendingMessage.tenant_id,
      pendingMessage.operator_id,
      pendingMessage.message,
      pendingMessage.sent_at,
    ],
  )

  await client.query('DELETE FROM data.messages_pending WHERE id = $1', [
    pendingMessage.id,
  ])

  return insertResult.rows[0].id
}

const processNextPendingMessage = async () => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const pendingMessage = await getPendingMessage(client)

    if (!pendingMessage) {
      await client.query('COMMIT')
      return false
    }

    const messageId = await deliverPendingMessage(client, pendingMessage)
    await client.query('COMMIT')

    log('delivered pending message', {
      messageId,
      pendingMessageId: pendingMessage.id,
      threadId: pendingMessage.thread_id,
    })

    return true
  } catch (error) {
    await client.query('ROLLBACK')
    log('failed to deliver pending message', { error: error.message })
    return false
  } finally {
    client.release()
  }
}

const processPendingMessages = async () => {
  let deliveredCount = 0

  while (!isStopping) {
    const didDeliver = await processNextPendingMessage()

    if (!didDeliver) {
      break
    }

    deliveredCount += 1
  }

  if (deliveredCount > 0) {
    log(`poll delivered ${deliveredCount} message(s)`)
  }
}

const shutdown = async (signal) => {
  if (isStopping) {
    return
  }

  isStopping = true
  log(`received ${signal}, shutting down`)
  await pool.end()
}

process.on('SIGINT', () => {
  void shutdown('SIGINT')
})

process.on('SIGTERM', () => {
  void shutdown('SIGTERM')
})

await waitForHasura()

while (!isStopping) {
  await processPendingMessages()
  await sleep(pollIntervalMs)
}
