import { test, expect, type Page } from '@playwright/test'

async function prepare(page: Page) {
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'dark'))
  // reduced motion freezes the canvases (bench, track, telemetry) at a
  // deterministic frame, otherwise the screenshots race the animation loop
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
}

async function shoot(page: Page, selector: string, file: string) {
  const target = page.locator(selector)
  await target.scrollIntoViewIfNeeded()
  await page.waitForTimeout(250)
  await expect(target).toHaveScreenshot(file, { animations: 'disabled', timeout: 30000 })
}

test.describe('Ground Truth visual regression', () => {
  test.setTimeout(90000)

  test.beforeEach(async ({ page }) => {
    await prepare(page)
  })

  test('hero', async ({ page }) => {
    await shoot(page, '#ingest', 'hero.png')
  })

  test('inference bench', async ({ page }) => {
    await shoot(page, '#perceive', 'bench.png')
  })

  test('career timeline', async ({ page }) => {
    await shoot(page, '#track', 'track.png')
  })

  test('flagship cases', async ({ page }) => {
    await shoot(page, '#work', 'work.png')
  })

  test('skills cross-filter', async ({ page }) => {
    await shoot(page, '#stack', 'stack.png')
  })

  test('evidence table', async ({ page }) => {
    await shoot(page, '#evidence', 'evidence.png')
  })

  test('contact', async ({ page }) => {
    await shoot(page, '#contact', 'contact.png')
  })

  test('footer', async ({ page }) => {
    await shoot(page, 'footer.gt-foot', 'footer.png')
  })
})
