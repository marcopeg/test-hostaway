import { expect, test } from '@playwright/test'

test('opens the app and validates overview is work in progress', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Overview' }).click()

  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
  await expect(page.getByText('Work in progress')).toBeVisible()
})
