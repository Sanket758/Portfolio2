import { test, expect, type Page } from '@playwright/test';

async function waitForFonts(page: Page) {
  await page.evaluate(() => document.fonts.ready);
}

async function waitForAnimations(page: Page) {
  await page.addStyleTag({
    content: '*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}',
  });
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForFunction(
    () => typeof (window as any).__freezeFourierCanvas === 'function',
    { timeout: 10000 }
  );
  await page.evaluate(() => {
    (window as any).__freezeFourierCanvas();
  });
  await page.waitForTimeout(1000);
}

test.describe('Portfolio Visual Regression', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForFonts(page);
    await waitForAnimations(page);
  });

  test('hero section', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toHaveScreenshot('hero.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('about section', async ({ page }) => {
    const about = page.locator('#about');
    await about.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(about).toHaveScreenshot('about.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('education section', async ({ page }) => {
    const education = page.locator('#education');
    await education.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(education).toHaveScreenshot('education.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('projects section', async ({ page }) => {
    const projects = page.locator('#projects');
    await projects.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(projects).toHaveScreenshot('projects.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('skills section', async ({ page }) => {
    const skills = page.locator('#skills');
    await skills.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(skills).toHaveScreenshot('skills.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('experience section', async ({ page }) => {
    const experience = page.locator('#experience');
    await experience.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(experience).toHaveScreenshot('experience.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('writing section', async ({ page }) => {
    const writing = page.locator('#writing');
    await writing.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(writing).toHaveScreenshot('writing.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('contact section', async ({ page }) => {
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(contact).toHaveScreenshot('contact.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });

  test('footer section', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(footer).toHaveScreenshot('footer.png', {
      animations: 'disabled',
      timeout: 30000,
    });
  });
});
