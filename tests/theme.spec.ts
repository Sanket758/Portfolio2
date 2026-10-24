import { test, expect } from '@playwright/test'

test.describe('Ground Truth theme + language', () => {
  test('theme toggle switches the palette and persists', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.setItem('portfolio-theme', 'dark'))
    await page.reload()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('html')).not.toHaveClass(/light/)

    const toggle = page.locator('.nav-act button.tool').last()
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme')
    await toggle.click()

    await expect(page.locator('html')).toHaveClass(/light/)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme')

    await page.reload()
    await expect(page.locator('html')).toHaveClass(/light/)

    // toggling back restores dark and the stored preference
    await toggle.click()
    await expect(page.locator('html')).not.toHaveClass(/light/)
    await page.reload()
    await expect(page.locator('html')).not.toHaveClass(/light/)
  })

  test('language choice survives a reload', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.locator('button[aria-label="Switch language"]').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    await expect(page.locator('button[aria-label="Sprache wechseln"]')).toBeVisible()
  })
})
