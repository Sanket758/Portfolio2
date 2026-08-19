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

  test('mobile navigation opens, is visible, and closes after navigation', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Mobile menu is only rendered in the mobile project');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('.mobile-menu-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();

    const menu = page.locator('#mobile-navigation');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: /projects|projekte/i })).toBeVisible();

    await menu.getByRole('link', { name: /projects|projekte/i }).click();
    await expect(menu).toBeHidden();
    await page.waitForTimeout(800);
    await expect(page.locator('#projects')).toBeInViewport();
  });

  test('component graph stays in viewport and preserves document order', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const graph = await page.evaluate(() => {
      const ids = ['hero', 'about', 'experience', 'education', 'projects', 'skills', 'writing', 'contact'];
      const nodes = ids.map((id) => {
        const element = document.getElementById(id);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { id, left: rect.left, right: rect.right, width: rect.width, top: rect.top };
      });
      const viewportWidth = document.documentElement.clientWidth;
      return {
        missing: nodes.filter(Boolean).length !== ids.length,
        overflow: nodes.filter(Boolean).some((node) => node!.left < -1 || node!.right > viewportWidth + 1 || node!.width > viewportWidth + 1),
        ordered: nodes.every((node, index) => index === 0 || !node || !nodes[index - 1] || node.top >= nodes[index - 1]!.top),
      };
    });

    expect(graph.missing).toBe(false);
    expect(graph.overflow).toBe(false);
    expect(graph.ordered).toBe(true);
  });

  test('research and evidence links expose honest destinations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const researchGate = page.locator('a[href*="researchgate.net"]');
    await expect(researchGate).toHaveAttribute('target', '_blank');
    await expect(researchGate).toHaveAttribute('rel', /noreferrer/);

    await expect(page.getByText(/local build/i).first()).toBeVisible();
    await expect(page.locator('a[href="https://github.com/Sanket758/german-career-ops"]')).toHaveCount(0);
  });

  test('resume CTA downloads the supplied PDF', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const resume = page.locator('a[href="/assets/Sanket-Gadge-Resume.pdf"]');
    await expect(resume).toHaveAttribute('download', 'Sanket-Gadge-Resume.pdf');
    await expect(resume).toHaveText(/download resume|lebenslauf herunterladen/i);
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
