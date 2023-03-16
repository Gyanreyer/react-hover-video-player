import { test, expect } from '@playwright/test';

import { mp4VideoSrcURL } from '../../constants';

test.beforeEach(async ({ page }) => {
  await page.goto('/playback');
});

test('plays correctly when the user focuses the player with their keyboard', async ({
  page,
}) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp"]');
  const video = await hoverVideoPlayer.locator('video');

  await expect(video).toHaveJSProperty('paused', true);

  await hoverVideoPlayer.focus();

  await Promise.all([
    expect(video).toHaveJSProperty('paused', false),
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
    expect(video).toHaveJSProperty('readyState', 4),
    expect(video).not.toHaveJSProperty('currentTime', 0),
  ]);

  // Move the mouse so we're no longer hovering
  await hoverVideoPlayer.blur();

  await expect(video).toHaveJSProperty('paused', true);
});
