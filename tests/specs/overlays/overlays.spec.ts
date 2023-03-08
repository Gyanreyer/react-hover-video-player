import { test, expect, Locator } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/overlays');
});

async function expectOverlayToBeVisible(
  overlayLocator: Locator,
  {
    message = 'the overlay should be visible',
    shouldPoll = false,
    transitionDelay = '0s',
  } = {}
) {
  const evaluateOverlayTransitionStyles = () => {
    return overlayLocator.evaluate((element) => {
      if (!element.parentElement) {
        throw new Error('No parent element');
      }
      return getComputedStyle(element.parentElement).transition;
    });
  };

  return Promise.all([
    expect(
      overlayLocator,
      `${message}; the overlay should have visibility: visible`
    ).toBeVisible(),
    (shouldPoll
      ? expect.poll(
        evaluateOverlayTransitionStyles,
        `${message}; timed out waiting for the parent element to get the correct visible transition styles`
      ) : expect(
        await evaluateOverlayTransitionStyles(),
        `${message}; the parent element does not have the correct visible transition styles`
      )
    ).toBe(`opacity 0.4s ease ${transitionDelay}`),
  ]);
}

async function expectOverlayToBeHidden(
  overlayLocator: Locator,
  {
    message = 'the overlay should be hidden',
    shouldPoll = false,
  } = {},
) {
  const evaluateOverlayTransitionStyles = () => {
    return overlayLocator.evaluate((element) => {
      if (!element.parentElement) {
        throw new Error('No parent element');
      }
      return getComputedStyle(element.parentElement).transition;
    });
  };

  return Promise.all([
    expect(
      overlayLocator,
      `${message}; the overlay should have visibility: hidden`
    ).toBeHidden(),
    (shouldPoll
      ? expect.poll(
        evaluateOverlayTransitionStyles,
        `${message}; timed out waiting for the parent element to get the correct hidden transition styles`
      ) : expect(
        await evaluateOverlayTransitionStyles(),
        `${message}; the parent element does not have the correct hidden transition styles`
      )
    )
      .toBe('opacity 0.4s ease 0s, visibility 0s ease 0.4s'),
  ]);
}

test('pausedOverlay works as expected', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="paused-overlay-only"]');
  const video = hoverVideoPlayer.locator('video');
  const pausedOverlay = hoverVideoPlayer.locator(
    '[data-testid="paused-overlay"]'
  );

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expectOverlayToBeVisible(pausedOverlay),
  ]);

  await hoverVideoPlayer.hover();

  await Promise.all([
    expect(video).toHaveJSProperty('paused', false),
    expectOverlayToBeHidden(pausedOverlay),
  ]);

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expectOverlayToBeVisible(pausedOverlay),
  ]);
});

test('loadingOverlay works as expected', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="loading-overlay-only"]');
  const video = hoverVideoPlayer.locator('video');
  const loadingOverlay = hoverVideoPlayer.locator(
    '[data-testid="loading-overlay"]'
  );

  await Promise.all([
    // The video should be paused
    expect(video).toHaveJSProperty('paused', true),
    expect(
      await video.evaluate((element: HTMLVideoElement) => element.readyState),
      'the video should be loading'
    ).toBeLessThan(4),
    // The loading overlay should be hidden initially
    expectOverlayToBeHidden(loadingOverlay),
  ]);

  await hoverVideoPlayer.hover();

  await Promise.all([
    // The video is loading
    expect(video).toHaveJSProperty('paused', false),
    expect(
      await video.evaluate((element: HTMLVideoElement) => element.readyState),
      'the video should be loading'
    ).toBeLessThan(4),
    // The loading overlay should be visible
    expectOverlayToBeVisible(loadingOverlay, {
      transitionDelay: '0.2s',
      shouldPoll: true,
    }),
  ]);

  await Promise.all([
    // The video is now playing
    expect(video).toHaveJSProperty('paused', false),
    expect(video).toHaveJSProperty('readyState', 4),
  ]);

  // The loading overlay should be hidden again
  await expectOverlayToBeHidden(loadingOverlay);

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expectOverlayToBeHidden(loadingOverlay),
  ]);
});

test('hoverOverlay works as expected', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="hover-overlay-only"]');
  const hoverOverlay = hoverVideoPlayer.locator(
    '[data-testid="hover-overlay"]'
  );

  await expectOverlayToBeHidden(hoverOverlay);

  await hoverVideoPlayer.hover();

  await expectOverlayToBeVisible(hoverOverlay);

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await expectOverlayToBeHidden(hoverOverlay);
});

test('all overlays work together as expected', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="all-overlays"]');
  const pausedOverlay = hoverVideoPlayer.locator(
    '[data-testid="paused-overlay"]'
  );
  const loadingOverlay = hoverVideoPlayer.locator(
    '[data-testid="loading-overlay"]'
  );
  const hoverOverlay = hoverVideoPlayer.locator(
    '[data-testid="hover-overlay"]'
  );

  await Promise.all([
    expectOverlayToBeVisible(pausedOverlay, {
      message: "the paused overlay should be visible initially"
    }),
    expectOverlayToBeHidden(loadingOverlay, {
      message: "the loading overlay should be hidden initially"
    }),
    expectOverlayToBeHidden(hoverOverlay, {
      message: "the hover overlay should be hidden initially"
    }),
  ]);

  await hoverVideoPlayer.hover();

  await Promise.all([
    expectOverlayToBeVisible(pausedOverlay, {
      message: "the paused overlay should stay visible while the video is loading"
    }),
    expectOverlayToBeVisible(loadingOverlay, {
      message: "the loading overlay should be visible while the video is loading",
      transitionDelay: '0.2s',
      shouldPoll: true,
    }),
    expectOverlayToBeVisible(hoverOverlay, {
      message: "the hover overlay should be visible while the video is loading"
    }),
  ]);

  await Promise.all([
    expectOverlayToBeHidden(pausedOverlay, {
      message: "the paused overlay should be hidden once the video is playing",
      shouldPoll: true,
    }),
    expectOverlayToBeHidden(loadingOverlay, {
      message: "the loading overlay should be hidden once the video is playing",
      shouldPoll: true,
    }),
    expectOverlayToBeVisible(hoverOverlay, {
      message: "the hover overlay should stay visible once the video is playing"
    }),
  ]);

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await Promise.all([
    expectOverlayToBeVisible(pausedOverlay),
    expectOverlayToBeHidden(loadingOverlay),
    expectOverlayToBeHidden(hoverOverlay),
  ]);
});
