import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test.setTimeout(60000);
  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    expect(overflow).toBe(false);
  });

  test('all sections are visible on scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sectionIds = ['hero', 'about', 'experience', 'education', 'projects', 'skills', 'writing', 'contact'];

    for (const id of sectionIds) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
  });

  test('header navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const projectsLink = page.getByRole('link', { name: /projects/i }).or(
      page.locator('nav').getByText(/projects/i)
    );

    if (await projectsLink.count() > 0) {
      await projectsLink.first().click();
      await page.waitForTimeout(1000);
      await expect(page.locator('#projects')).toBeInViewport();
    }
  });

  test('no broken images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src);
    });

    expect(brokenImages).toEqual([]);
  });

  test('no failed network requests', async ({ page }) => {
    const failures: string[] = [];

    page.on('response', (response) => {
      if (response.status() >= 400) {
        failures.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failures).toEqual([]);
  });
});
