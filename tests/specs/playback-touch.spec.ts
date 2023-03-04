import { test, expect } from '@playwright/test';

import { mp4VideoSrcURL } from '../constants';

test.use({
  hasTouch: true,
});

test.beforeEach(async ({ page }) => {
  await page.goto('/playback');
});

test('plays correctly when the user hovers with a touchscreen tap', async ({
  page,
}) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp"]');
  const video = await hoverVideoPlayer.locator('video');

  await expect(video).toHaveJSProperty('paused', true);

  // Tap on the player to start playing
  await hoverVideoPlayer.tap();

  await Promise.all([
    expect(video).toHaveJSProperty('paused', false),
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
    expect(video).toHaveJSProperty('readyState', 4),
    expect(video).not.toHaveJSProperty('currentTime', 0),
  ]);

  // Tap on another element outside of the player to stop playing
  await page.tap('h1');

  await expect(video).toHaveJSProperty('paused', true);
});
