import { test, expect } from '@playwright/test';

import { mp4VideoSrc, mp4VideoSrcURL } from '../../constants';

test.beforeEach(async ({ page }) => {
  await page.goto('/unloadVideoOnPause');
});

test("unloads the video's string src on pause", async ({
  page,
}) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:stringSrc"]');
  const video = await hoverVideoPlayer.locator('video');

  await Promise.all([
    expect(await video.getAttribute("src")).toBeNull(),
    expect(video).toHaveJSProperty("currentSrc", ""),
    expect(video).toHaveJSProperty("readyState", 0),
  ]);

  await hoverVideoPlayer.hover();

  await Promise.all([
    expect(video).toHaveAttribute("src", mp4VideoSrc),
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).not.toHaveJSProperty("currentTime", 0),
    expect(video).not.toHaveJSProperty("readyState", 0)
  ]);

  // Mouse out to stop playing and unload the video
  await page.mouse.move(0, 0);

  // The video should be unloaded
  await Promise.all([
    expect(await video.getAttribute("src")).toBeNull(),
    // currentSrc doesn't get cleared when a video src is unloaded
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).toHaveJSProperty("currentTime", 0),
    expect(video).toHaveJSProperty("readyState", 0),
  ]);

  // Mouse back in to start playing the video from the point it was at before
  await hoverVideoPlayer.hover();

  await Promise.all([
    // The video should be at a time > 0 right away
    expect(await video.evaluate((videoElement: HTMLVideoElement) => videoElement.currentTime)).toBeGreaterThan(0),
    expect(video).toHaveAttribute("src", mp4VideoSrc),
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).not.toHaveJSProperty("readyState", 0)
  ]);

  // Mouse out to stop playing and unload the video
  await page.mouse.move(0, 0);

  // The video should be unloaded again
  await Promise.all([
    expect(await video.getAttribute("src")).toBeNull(),
    // currentSrc doesn't get cleared when a video src is unloaded
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).toHaveJSProperty("currentTime", 0),
    expect(video).toHaveJSProperty("readyState", 0),
  ]);
});

test("unloads the video's source element src on pause", async ({ page }) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:sourceElement"]');
  const video = await hoverVideoPlayer.locator('video');
  const source = await hoverVideoPlayer.locator('source');

  await Promise.all([
    expect(source).toHaveCount(0),
    expect(video).toHaveJSProperty("currentSrc", ""),
    expect(video).toHaveJSProperty("readyState", 0),
  ]);

  await hoverVideoPlayer.hover();

  await Promise.all([
    expect(source).toHaveCount(1),
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).not.toHaveJSProperty("currentTime", 0),
    expect(video).not.toHaveJSProperty("readyState", 0)
  ]);

  // Mouse out to stop playing and unload the video
  await page.mouse.move(0, 0);

  // The video should be unloaded
  await Promise.all([
    expect(source).toHaveCount(0),
    // currentSrc doesn't get cleared when a video src is unloaded
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).toHaveJSProperty("currentTime", 0),
    expect(video).toHaveJSProperty("readyState", 0),
  ]);

  // Mouse back in to start playing the video from the point it was at before
  await hoverVideoPlayer.hover();

  await Promise.all([
    // The video should be at a time > 0 right away
    expect(await video.evaluate((videoElement: HTMLVideoElement) => videoElement.currentTime)).toBeGreaterThan(0),
    expect(source).toHaveCount(1),
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).not.toHaveJSProperty("readyState", 0)
  ]);

  // Mouse out to stop playing and unload the video
  await page.mouse.move(0, 0);

  // The video should be unloaded again
  await Promise.all([
    expect(await video.getAttribute("src")).toBeNull(),
    // currentSrc doesn't get cleared when a video src is unloaded
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).toHaveJSProperty("currentTime", 0),
    expect(video).toHaveJSProperty("readyState", 0),
  ]);
});

test("delays unloading if there is a pausedOverlay", async ({ page }) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:pausedOverlay"]');
  const video = await hoverVideoPlayer.locator('video');
  const pausedOverlayWrapper = await hoverVideoPlayer.locator(".paused-overlay-wrapper");

  await Promise.all([
    expect(await video.getAttribute("src")).toBeNull(),
    expect(video).toHaveJSProperty("currentSrc", ""),
    expect(video).toHaveJSProperty("readyState", 0),
    expect(pausedOverlayWrapper).toHaveCSS("opacity", "1"),
  ]);

  await hoverVideoPlayer.hover();

  await Promise.all([
    expect(video).toHaveAttribute("src", mp4VideoSrc),
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).toHaveJSProperty("readyState", 4),
    expect(video).not.toHaveJSProperty("currentTime", 0),
  ]);

  // Wait for the paused overlay to fade out all the way
  await expect(pausedOverlayWrapper).toHaveCSS("opacity", "0");

  // Mouse out to stop playing and unload the video
  await page.mouse.move(0, 0);

  await Promise.all([
    // The paused overlay should not be fully faded in yet, so the video should not be unloaded yet
    expect(pausedOverlayWrapper).not.toHaveCSS("opacity", "1"),
    // expect(await pausedOverlayWrapper.evaluate((overlay) => Number(getComputedStyle(overlay.parentElement as HTMLElement).opacity))).toBeLessThan(1),
    expect(video).toHaveAttribute("src", mp4VideoSrc),
    expect(video).not.toHaveJSProperty("readyState", 0),
  ]);

  // Wait for the paused overlay to fade all the way back in
  // await expect.poll(() => pausedOverlayWrapper.evaluate((overlay) => Number(getComputedStyle(overlay.parentElement as HTMLElement).opacity))).toBe(1);
  await expect(pausedOverlayWrapper).toHaveCSS("opacity", "1");

  // The video should be unloaded now
  await Promise.all([
    expect(await video.getAttribute("src")).toBeNull(),
    // currentSrc doesn't get cleared when a video src is unloaded
    expect(video).toHaveJSProperty("currentSrc", mp4VideoSrcURL),
    expect(video).toHaveJSProperty("currentTime", 0),
    expect(video).toHaveJSProperty("readyState", 0),
  ]);
});
