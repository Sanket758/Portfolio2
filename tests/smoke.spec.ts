import { test, expect } from '@playwright/test'

/** every section the pipeline nav points at — `#lab` wraps the hero and the bench */
const SECTIONS = ['lab', 'ingest', 'perceive', 'track', 'work', 'stack', 'evidence', 'writing', 'contact']

test.describe('Ground Truth smoke', () => {
  test.setTimeout(90000)

  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(errors).toEqual([])
  })

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(overflow).toBe(false)
  })

  test('all pipeline sections exist, are visible and stay in document order', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    for (const id of SECTIONS) {
      const section = page.locator(`#${id}`)
      await section.scrollIntoViewIfNeeded()
      await expect(section, `#${id} should be visible`).toBeVisible()
    }

    const ordered = await page.evaluate((ids) => {
      const tops = ids.map((id) => document.getElementById(id)!.getBoundingClientRect().top + window.scrollY)
      return tops.every((top, i) => i === 0 || top >= tops[i - 1])
    }, SECTIONS)
    expect(ordered).toBe(true)
  })

  test('stage navigation scrolls to the matching section', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // the stage map collapses below 1100px — desktop project only
    test.skip(testInfo.project.name.includes('mobile'), 'stage map is desktop-only')

    const workLink = page.locator('#pipe a[href="#work"]')
    await expect(workLink).toBeVisible()
    await workLink.click()
    await page.waitForTimeout(900)
    await expect(page.locator('#work')).toBeInViewport()

    // active state follows the section in view
    await expect(workLink).toHaveAttribute('aria-current', 'true')
  })

  test('language toggle swaps the whole page and persists', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const heroSub = page.locator('#ingest .sub')
    const english = await heroSub.innerText()
    expect(english.length).toBeGreaterThan(10)

    await page.locator('button[aria-label="Switch language"]').click()
    await expect(heroSub).not.toHaveText(english)
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')

    // back to English so later tests start from the default
    await page.locator('button[aria-label="Sprache wechseln"]').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('skill cross-filter lights the evidence that proves it', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const chip = page.locator('#stack-grid [data-skill]').first()
    const slug = (await chip.getAttribute('data-skill'))!
    await chip.scrollIntoViewIfNeeded()
    await chip.click()

    // selected chip reports itself active…
    await expect(page.locator(`#stack-grid [data-skill="${slug}"]`)).toHaveAttribute('aria-pressed', 'true')
    // …and the filter reaches the evidence table: some rows lit, some dimmed
    const lit = await page.locator('#ev-body tr.lit').count()
    const dim = await page.locator('#ev-body tr.dim').count()
    expect(lit + dim).toBeGreaterThan(0)

    // clear button releases the filter again
    await page.locator('.gt-clear').click()
    await expect(page.locator('#ev-body tr.lit')).toHaveCount(0)
  })

  test('inference bench controls actually drive the scene', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const conf = page.locator('#conf')
    await conf.scrollIntoViewIfNeeded()
    const before = await page.locator('#conf-val').innerText()
    await conf.fill('0.45')
    await expect(page.locator('#conf-val')).not.toHaveText(before)

    const teleBefore = await page.locator('#tele-p').innerText()
    await conf.fill('0.95')
    await expect(page.locator('#tele-f1')).not.toHaveText(teleBefore === '' ? '0.00' : teleBefore)
  })

  test('CV is downloadable from the nav and the hero', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const resume = page.locator('a[download][href="/assets/Sanket-Gadge-Resume.pdf"]')
    expect(await resume.count()).toBeGreaterThanOrEqual(2)
    await expect(resume.first()).toBeVisible()
  })

  test('hiring facts a recruiter screens for are on the page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const body = (await page.locator('body').innerText()).toLowerCase()
    expect(body).toContain('40')
    expect(body).toMatch(/b1/)
    expect(body).toMatch(/18[- ]month|18 monate/)
    expect(body).toContain('immediately')
  })

  test('research links expose honest destinations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const researchGate = page.locator('a[href*="researchgate.net"]')
    if ((await researchGate.count()) > 0) {
      await expect(researchGate.first()).toHaveAttribute('target', '_blank')
      await expect(researchGate.first()).toHaveAttribute('rel', /noopener|noreferrer/)
    }
  })

  test('no broken images', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // the ID-card headshot is lazy — bring it into view and wait for the decode
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.waitForFunction(
      () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
      null,
      { timeout: 20000 }
    )

    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.getAttribute('src'))
    )
    expect(broken).toEqual([])
  })

  test('no failed network requests', async ({ page }) => {
    const failures: string[] = []
    page.on('response', (res) => {
      if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(failures).toEqual([])
  })

  test('every nav control sits inside the viewport', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const outside = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const items = Array.from(document.querySelectorAll('#topnav a, #topnav button'))
      return items
        .filter((el) => {
          const r = el.getBoundingClientRect()
          if (r.width === 0 && r.height === 0) return false // hidden on purpose
          return r.left < -1 || r.right > vw + 1
        })
        .map((el) => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim())
    })
    expect(outside).toEqual([])
  })
})
