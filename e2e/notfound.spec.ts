import { test, expect } from '@playwright/test'

test('shows 404 page with attempted path and Go home link', async ({ page }) => {
  await page.goto('/daw/404')

  await expect(page.locator('#not-found-title')).toHaveText('Page not found')

  await expect(page.locator('.path')).toHaveText('/daw/404')

  await page.locator('a').filter({ hasText: 'Go home' }).click()
  await expect(page.locator('h1.title')).toHaveText('Horse Race Simulator')
})
