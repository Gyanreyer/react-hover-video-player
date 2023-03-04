import { test, expect } from '@playwright/test';

import {
  mp4VideoSrc,
  mp4VideoSrcURL,
  webmVideoSrc,
  webmVideoSrcURL,
} from '../constants';

test.beforeEach(async ({ page }) => {
  await page.goto('/videoSrcChange');
});

test('reloads when videoSrc changes from string to string', async ({
  page,
}) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp"]');
  const video = await hoverVideoPlayer.locator('video');
  const source = await video.locator('source');

  expect(await page.getByLabel('mp4String').isChecked()).toBeTruthy();

  await Promise.all([
    expect(video).toHaveAttribute('src', mp4VideoSrc),
    expect(source).toHaveCount(0),
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
  ]);

  // Switch to a webm string url
  await page.getByLabel('webmString').check();

  await Promise.all([
    expect(video).toHaveAttribute('src', webmVideoSrc),
    expect(source).toHaveCount(0),
    expect(video).toHaveJSProperty('currentSrc', webmVideoSrcURL),
  ]);
});

test('reloads when videoSrc changes from string to source element', async ({
  page,
}) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp"]');
  const video = await hoverVideoPlayer.locator('video');
  const source = await video.locator('source');

  expect(await page.getByLabel('mp4String').isChecked()).toBeTruthy();

  await Promise.all([
    expect(video).toHaveAttribute('src', mp4VideoSrc),
    expect(source).toHaveCount(0),
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
  ]);

  // Switch to a webm source element
  await page.getByLabel('webmSourceElement').check();

  await Promise.all([
    expect(video).not.toHaveAttribute('src', webmVideoSrc),
    expect(source).toHaveCount(1),
    expect(source).toHaveAttribute('src', webmVideoSrc),
    expect(video).toHaveJSProperty('currentSrc', webmVideoSrcURL),
  ]);

  // Return to the mp4 string
  await page.getByLabel('mp4String').check();

  await Promise.all([
    expect(video).toHaveAttribute('src', mp4VideoSrc),
    expect(source).toHaveCount(0),
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
  ]);
});

test('reloads when videoSrc changes from source element to source element', async ({
  page,
}) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp"]');
  const video = await hoverVideoPlayer.locator('video');
  const source = await video.locator('source');

  await page.getByLabel('mp4SourceElement').check();

  await Promise.all([
    expect(video).not.toHaveAttribute('src', mp4VideoSrc),
    expect(source).toHaveCount(1),
    expect(source).toHaveAttribute('src', mp4VideoSrc),
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
  ]);

  // Switch to a webm source element
  await page.getByLabel('webmSourceElement').check();

  await Promise.all([
    expect(video).not.toHaveAttribute('src', webmVideoSrc),
    expect(source).toHaveCount(1),
    expect(source).toHaveAttribute('src', webmVideoSrc),
    expect(video).toHaveJSProperty('currentSrc', webmVideoSrcURL),
  ]);
});

test('waits to reload videoSrc if the video is playing', async ({ page }) => {
  const hoverVideoPlayer = await page.locator('[data-testid="hvp"]');
  const video = await hoverVideoPlayer.locator('video');
  const source = await video.locator('source');

  expect(await page.getByLabel('mp4String').isChecked()).toBeTruthy();

  await Promise.all([
    expect(video).toHaveAttribute('src', mp4VideoSrc),
    expect(source).toHaveCount(0),
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
  ]);

  // Play the video
  await hoverVideoPlayer.hover();
  await expect(video).toHaveJSProperty('paused', false);

  // Select a different option without moving the mouse since that will result
  // in the player no longer being hovered
  await page
    .getByLabel('webmString')
    .evaluate((webmStringOption: HTMLInputElement) => webmStringOption.click());

  await Promise.all([
    expect(video).toHaveAttribute('src', mp4VideoSrc),
    expect(source).toHaveCount(0),
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
  ]);

  // Mousing out of the hover target should pause the video
  await page.mouse.move(0, 0);
  await expect(video).toHaveJSProperty('paused', true);

  await Promise.all([
    expect(video).toHaveAttribute('src', webmVideoSrc),
    expect(source).toHaveCount(0),
    expect(video).toHaveJSProperty('currentSrc', webmVideoSrcURL),
  ]);
});
