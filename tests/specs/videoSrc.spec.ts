import { test, expect } from '@playwright/test';

import {
  mp4VideoSrc,
  mp4VideoSrcURL,
  webmVideoSrc,
  webmVideoSrcURL,
} from '../constants';

test.beforeEach(async ({ page }) => {
  await page.goto('/videoSrc');
});

test('loads string URL videoSrc', async ({ page }) => {
  const hoverVideoPlayer = await page.locator(
    '[data-testid="mp4-string-only"]'
  );
  const video = await hoverVideoPlayer.locator('video');
  const videoSource = await video.locator('source');

  await Promise.all([
    // The video should not have any <source> elements.
    expect(videoSource).toHaveCount(0),
    // The source should be set on the video's src attribute.
    expect(video).toHaveAttribute('src', mp4VideoSrc),
    // The source should be loaded on the video as expected.
    expect(video).toHaveJSProperty('currentSrc', mp4VideoSrcURL),
  ]);
});

test('loads single source element videoSrc', async ({ page }) => {
  const hoverVideoPlayer = await page.locator(
    '[data-testid="webm-source-element-only"]'
  );
  const video = await hoverVideoPlayer.locator('video');
  const videoSource = await video.locator('source');

  await Promise.all([
    // The video should not have a src attribute set.
    expect(video).not.toHaveAttribute('src', webmVideoSrc),
    // The video should have one <source> element with the expected src attribute.
    expect(videoSource).toHaveCount(1),
    expect(videoSource).toHaveAttribute('src', webmVideoSrc),
    // The source should be loaded on the video as expected.
    expect(video).toHaveJSProperty('currentSrc', webmVideoSrcURL),
  ]);
});

test('loads multiple source element videoSrc', async ({ page }) => {
  const hoverVideoPlayer = await page.locator(
    '[data-testid="2-source-elements"]'
  );
  const video = await hoverVideoPlayer.locator('video');
  const videoSource = await video.locator('source');

  await Promise.all([
    // The video should not have a src attribute set.
    expect(video).not.toHaveAttribute('src', webmVideoSrc),
    // The video should have two <source> elements with the expected src attributes.
    expect(videoSource).toHaveCount(2),
    expect(videoSource.nth(0)).toHaveAttribute('src', webmVideoSrc),
    expect(videoSource.nth(1)).toHaveAttribute('src', mp4VideoSrc),
    // The first source should be loaded on the video as expected.
    expect(video).toHaveJSProperty('currentSrc', webmVideoSrcURL),
  ]);
});
