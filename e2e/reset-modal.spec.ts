import { test, expect } from '@playwright/test'

test('reset modal opens and reset action triggers', async ({ page }) => {
  await page.goto('/')

  await page.locator('button', { hasText: 'Start Racing' }).click()

  const startBtn = page.locator('button', { hasText: 'Start Racing' })
  await expect(startBtn).toBeDisabled()

  await page.locator('button', { hasText: 'Reset' }).click()
  await expect(page.locator('.modal-overlay')).toBeVisible()

  await page.locator('.modal-overlay button', { hasText: 'Reset' }).click()

  await expect(page.locator('.modal-overlay')).toHaveCount(0)
  await expect(startBtn).toBeEnabled()
})
