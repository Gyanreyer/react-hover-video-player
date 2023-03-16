import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/sizingMode');
});

test('sizingMode="video" sizes the player relative to the video dimensions', async ({
  page,
}) => {
  const hoverVideoPlayer = page.locator('[data-testid="hvp:sizingMode-video"]');
  const video = hoverVideoPlayer.locator('video');
  const pausedOverlayWrapper = hoverVideoPlayer.locator('.paused-overlay-wrapper');

  const { videoWidth, videoHeight } = await video.evaluate((videoElement: HTMLVideoElement) => ({
    videoWidth: videoElement.videoWidth,
    videoHeight: videoElement.videoHeight,
  }));

  const aspectRatio = videoWidth / videoHeight;

  const expectedWidth = "400px";
  const expectedHeight = `${400 / aspectRatio}px`;

  await Promise.all([
    expect(video).toHaveCSS('width', expectedWidth),
    expect(video).toHaveCSS('height', expectedHeight),
    expect(hoverVideoPlayer).toHaveCSS('width', expectedWidth),
    expect(hoverVideoPlayer).toHaveCSS('height', expectedHeight),
    expect(pausedOverlayWrapper).toHaveCSS('width', expectedWidth),
    expect(pausedOverlayWrapper).toHaveCSS('height', expectedHeight),
  ]);
});

test('sizingMode="overlay" sizes the player relative to the paused overlay dimensions', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="hvp:sizingMode-overlay"]');
  const video = hoverVideoPlayer.locator('video');
  const pausedOverlayWrapper = hoverVideoPlayer.locator('.paused-overlay-wrapper');

  const expectedWidth = "200px";
  const expectedHeight = "200px";

  await Promise.all([
    expect(video).toHaveCSS('width', expectedWidth),
    expect(video).toHaveCSS('height', expectedHeight),
    expect(hoverVideoPlayer).toHaveCSS('width', expectedWidth),
    expect(hoverVideoPlayer).toHaveCSS('height', expectedHeight),
    expect(pausedOverlayWrapper).toHaveCSS('width', expectedWidth),
    expect(pausedOverlayWrapper).toHaveCSS('height', expectedHeight),
  ]);
});

test('sizingMode="container" sizes the player relative to the container dimensions', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="hvp:sizingMode-container"]');
  const video = hoverVideoPlayer.locator('video');
  const pausedOverlayWrapper = hoverVideoPlayer.locator('.paused-overlay-wrapper');

  const expectedWidth = "123px";
  const expectedHeight = "456px";

  await Promise.all([
    expect(video).toHaveCSS('width', expectedWidth),
    expect(video).toHaveCSS('height', expectedHeight),
    expect(hoverVideoPlayer).toHaveCSS('width', expectedWidth),
    expect(hoverVideoPlayer).toHaveCSS('height', expectedHeight),
    expect(pausedOverlayWrapper).toHaveCSS('width', expectedWidth),
    expect(pausedOverlayWrapper).toHaveCSS('height', expectedHeight),
  ]);
});
