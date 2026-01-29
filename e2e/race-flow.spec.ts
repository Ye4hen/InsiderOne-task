import { test, expect } from '@playwright/test'

test('start → pause → resume: racing indicator + horse position changes accordingly', async ({
  page,
}) => {
  await page.goto('/')

  const startBtn = page.getByRole('button', { name: /Start Racing/i })
  await expect(startBtn).toBeVisible()
  await expect(startBtn).toBeEnabled()

  // Start
  await startBtn.click()
  await expect(startBtn).toBeDisabled()

  await expect(page.locator('.racing-indicator')).toBeVisible()
  const marker = page.locator('.horse-marker').first()
  await expect(marker).toBeVisible()

  const getLeft = async () =>
    marker.evaluate((el) => {
      const v = getComputedStyle(el).left || '0'
      return Number.parseFloat(v.replace('%', '')) || 0
    })

  const before = await getLeft()
  await page.waitForTimeout(1500)
  const afterRun = await getLeft()
  expect(afterRun).toBeGreaterThan(before)
  const runDelta = afterRun - before

  // Pause
  const pauseBtn = page.getByRole('button', { name: /Pause/i })
  await expect(pauseBtn).toBeVisible()
  await pauseBtn.click()
  await expect(page.locator('.paused-indicator')).toBeVisible()

  await page.waitForTimeout(150)

  const pausedSnapshot = await getLeft()
  await page.waitForTimeout(700)
  const pausedLater = await getLeft()
  const pausedDelta = Math.abs(pausedLater - pausedSnapshot)

  const RELATIVE_ALLOWED = 0.35
  const ABSOLUTE_ALLOWED = 1.5

  const allowed = Math.max(ABSOLUTE_ALLOWED, runDelta * RELATIVE_ALLOWED)

  expect(pausedDelta).toBeLessThanOrEqual(allowed)

  // Resume
  const resumeBtn = page.getByRole('button', { name: /Resume/i })
  await expect(resumeBtn).toBeVisible()
  await resumeBtn.click()
  await expect(page.locator('.racing-indicator')).toBeVisible()

  const beforeResume = pausedLater
  await page.waitForTimeout(700)
  const afterResume = await getLeft()
  expect(afterResume).toBeGreaterThan(beforeResume + 0.05)

  await expect(startBtn).toBeDisabled()
})
