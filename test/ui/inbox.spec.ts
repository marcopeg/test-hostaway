import { expect, test } from '@playwright/test'

test('opens the inbox, selects a thread, and verifies the first message is from a guest', async ({
  page,
}) => {
  await page.goto('/inbox')

  await expect(page.getByRole('heading', { exact: true, name: 'Inbox' })).toBeVisible()
  await expect(page.getByText(/\d+ threads/)).toBeVisible()

  const threads = page.getByTestId('inbox-thread-link')
  await expect(threads.first()).toBeVisible()

  await threads.first().click()

  const messages = page.getByTestId('inbox-message')
  await expect(messages.first()).toBeVisible()
  await expect(messages.first()).toHaveAttribute('data-sender-kind', 'guest')
})
