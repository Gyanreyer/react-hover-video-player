import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Apply an artificial delay to all video requests
  // to make sure the loading timeout has time to
  // kick in
  await page.route("**/*.{mp4,webm}", (route) => {
    setTimeout(() => {
      route.continue();
    }, 300);
  });

  await page.goto('/loadingStateTimeout');
});

test('a loadingStateTimeout of 0 will cause the loading overlay to start fading in immediately', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="hvp:lst-0"]');
  const loadingOverlayWrapper = hoverVideoPlayer.locator(".loading-overlay-wrapper");
  const video = hoverVideoPlayer.locator('video');

  await expect(loadingOverlayWrapper).not.toBeVisible();
  await expect(loadingOverlayWrapper).toHaveCSS("transition", "opacity 0.4s ease 0s, visibility 0s ease 0.4s");

  await hoverVideoPlayer.hover();

  // Wait for a frame to allow our state to update to start fading the loading overlay in
  await page.waitForTimeout(20);

  // The loading overlay should be visible and fading in immediately
  const loadingOverlayComputedStyle = await loadingOverlayWrapper.evaluate((el) => getComputedStyle(el));
  expect(loadingOverlayComputedStyle.visibility).toBe("visible");
  expect(Number(loadingOverlayComputedStyle.opacity)).toBeGreaterThan(0);
  expect(loadingOverlayComputedStyle.transition).toBe("opacity 0.4s ease 0s");

  await expect(video).toHaveJSProperty('readyState', 4);

  await expect(loadingOverlayWrapper).not.toBeVisible();

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(loadingOverlayWrapper).not.toBeVisible(),
  ]);
});

test("a loadingStateTimeout of 300 will cause the loading overlay to start fading in after .3 seconds", async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="hvp:lst-200"]');
  const loadingOverlayWrapper = hoverVideoPlayer.locator(".loading-overlay-wrapper");
  const video = hoverVideoPlayer.locator('video');

  await expect(loadingOverlayWrapper).not.toBeVisible();
  await expect(loadingOverlayWrapper).toHaveCSS("transition", "opacity 0.4s ease 0s, visibility 0s ease 0.4s");

  await hoverVideoPlayer.hover();

  // The loading overlay should have visibility: visible set, but shouldn't fade in immediately
  const loadingOverlayComputedStyle = await loadingOverlayWrapper.evaluate((el) => getComputedStyle(el));
  expect(loadingOverlayComputedStyle.visibility).toBe("visible");
  expect(loadingOverlayComputedStyle.opacity).toBe("0");
  expect(loadingOverlayComputedStyle.transition).toBe("opacity 0.4s ease 0.2s");

  await page.waitForTimeout(200);

  expect(await loadingOverlayWrapper.evaluate((el) => getComputedStyle(el).opacity)).not.toBe("0");

  await expect(video).toHaveJSProperty('readyState', 4);

  await expect(loadingOverlayWrapper).not.toBeVisible();

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(loadingOverlayWrapper).not.toBeVisible(),
  ]);
});
