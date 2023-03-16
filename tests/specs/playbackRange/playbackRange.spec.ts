import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/playbackRange');
});

test('starts from playbackRangeStart time and loops back to that time from the end', async ({
  page,
}) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:startOnly-loop"]');
  const video = await hoverVideoPlayer.locator('video');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 9.5),
  ]);

  await hoverVideoPlayer.hover();

  await expect(video).toHaveJSProperty('paused', false);

  // Wait for the video to get to the end
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime), {
    // We're waiting for the video to play for ~0.5s, so we'll wait 300ms for the firt poll and then
    // poll every 20ms to make sure we don't miss it
    intervals: [300, 20],
  }).toBeCloseTo(10);

  // The video should loop back to the start
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime), {
    intervals: [20],
  }).toBeCloseTo(9.5);

  await page.mouse.move(0, 0);

  await expect(video).toHaveJSProperty('paused', true);
});

test('starts from playbackRangeStart time and returns to that time if restartOnPaused is set', async ({ page }) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:startOnly-restart"]');
  const video = await hoverVideoPlayer.locator('video');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 9.5),
  ]);

  await hoverVideoPlayer.hover();

  // Allow the video to play through to the end
  await Promise.all([
    expect(video).toHaveJSProperty('ended', true),
    expect(video).toHaveJSProperty('paused', false),
  ]);

  await expect(await video.evaluate((videoElement: HTMLVideoElement) => videoElement.currentTime)).toBeGreaterThanOrEqual(10);

  await page.mouse.move(0, 0);

  // The video is reset to the correct time
  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 9.5),
  ]);
});

test('stops at playbackRangeEnd time and loops back to the start', async ({ page }) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:endOnly-loop"]');
  const video = await hoverVideoPlayer.locator('video');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 0),
  ]);

  await hoverVideoPlayer.hover();

  await expect(video).toHaveJSProperty('paused', false);

  // Wait for the video to get to the end
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime), {
    // We're waiting for the video to play for ~0.5s, so we'll wait 300ms for the firt poll and then
    // poll every 20ms to make sure we don't miss it
    intervals: [300, 20],
  }).toBeCloseTo(0.5);

  // The video should loop back to the start
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime), {
    intervals: [20],
  }).toBeCloseTo(0);

  await page.mouse.move(0, 0);

  await expect(video).toHaveJSProperty('paused', true);
});

test('stops at playbackRangeEnd time if loop is false', async ({ page }) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:endOnly-restart"]');
  const video = await hoverVideoPlayer.locator('video');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 0),
  ]);

  await hoverVideoPlayer.hover();

  await expect(video).toHaveJSProperty('paused', false);

  // Wait for the video to reach the end of the playback range and pause
  await expect(video).toHaveJSProperty('paused', true);
  await expect(video).toHaveJSProperty('currentTime', 0.5);

  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 0),
  ]);
});

test('loops between playbackRangeStart time and playbackRangeEnd time', async ({ page }) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:startAndEnd-loop"]');
  const video = await hoverVideoPlayer.locator('video');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 1),
  ]);

  await hoverVideoPlayer.hover();

  await expect(video).toHaveJSProperty('paused', false);

  // Wait for the video to get to the end
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime), {
    // We're waiting for the video to play for ~0.5s, so we'll wait 300ms for the first poll and then
    // poll every 20ms to make sure we don't miss it
    intervals: [300, 20],
  }).toBeCloseTo(1.5);

  // The video should loop back to the start
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime), {
    intervals: [20],
  }).toBeCloseTo(1);

  await page.mouse.move(0, 0);

  await expect(video).toHaveJSProperty('paused', true);
});

test('stops at playbackRangeEnd and restarts at playbackRangeStart', async ({ page }) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp:startAndEnd-restart"]');
  const video = await hoverVideoPlayer.locator('video');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 1),
  ]);

  await hoverVideoPlayer.hover();

  await expect(video).toHaveJSProperty('paused', false);

  // Wait for the video to reach the end of th playback range and pause
  await expect(video).toHaveJSProperty('paused', true);
  expect(await video.evaluate((videoElement: HTMLVideoElement) => videoElement.currentTime)).toBe(1.5);

  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(video).toHaveJSProperty('currentTime', 1),
  ]);
});
