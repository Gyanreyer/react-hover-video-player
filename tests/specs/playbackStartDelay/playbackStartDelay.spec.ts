import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/playbackStartDelay');
});

test('playbackStartDelay adds a delay before the video starts loading and playing', async ({
  page,
}) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp"]');
  const video = await hoverVideoPlayer.locator('video');
  const loadingOverlayWrapper = await hoverVideoPlayer.locator('.loading-overlay-wrapper');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('readyState', 0),
    expect(loadingOverlayWrapper).not.toBeVisible(),
  ]);

  await hoverVideoPlayer.hover();

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('readyState', 0),
    expect(loadingOverlayWrapper).toBeVisible(),
  ]);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', false),
    expect(video).not.toHaveJSProperty('readyState', 0),
    expect(loadingOverlayWrapper).not.toBeVisible(),
  ]);

  await page.mouse.move(0, 0);

  await expect(video).toHaveJSProperty('paused', true);
});
