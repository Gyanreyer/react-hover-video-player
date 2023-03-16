import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/hoverTarget');
});

test('the player container div is used as the default hover target if no hoverTarget prop is set', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="hvp:no-hover-target"]');
  const video = hoverVideoPlayer.locator('video');

  const currentHoveringTestID = page.locator('[data-testid="current-hovering-testid"]');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(currentHoveringTestID).toBeEmpty(),
  ]);

  await hoverVideoPlayer.hover();

  await Promise.all([
    expect(video).toHaveJSProperty('paused', false),
    expect(currentHoveringTestID).toHaveText('hvp:no-hover-target'),
  ]);

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(currentHoveringTestID).toBeEmpty(),
  ]);
});

test('setting an external hover target via ref works as expected', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="hvp:hover-target-ref"]');
  const video = hoverVideoPlayer.locator('video');

  const hoverTarget = page.locator('[data-testid="hover-target-ref"]');

  const currentHoveringTestID = page.locator('[data-testid="current-hovering-testid"]');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(currentHoveringTestID).toBeEmpty(),
  ]);

  // Nothing should happen when we hover on the player container
  await hoverVideoPlayer.hover();
  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(currentHoveringTestID).toBeEmpty(),
  ]);

  // Hovering on the hoverTarget should trigger playback
  await hoverTarget.hover();

  await Promise.all([
    expect(video).toHaveJSProperty('paused', false),
    expect(currentHoveringTestID).toHaveText('hvp:hover-target-ref'),
  ]);

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(currentHoveringTestID).toBeEmpty(),
  ]);
});

test('setting an external hover target via callback works as expected', async ({ page }) => {
  const hoverVideoPlayer = page.locator('[data-testid="hvp:hover-target-fn"]');
  const video = hoverVideoPlayer.locator('video');

  const hoverTarget = page.locator('[data-testid="hover-target-fn"]');

  const currentHoveringTestID = page.locator('[data-testid="current-hovering-testid"]');

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(currentHoveringTestID).toBeEmpty(),
  ]);

  // Nothing should happen when we hover on the player container
  await hoverVideoPlayer.hover();
  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(currentHoveringTestID).toBeEmpty(),
  ]);

  // Hovering on the hoverTarget should trigger playback
  await hoverTarget.hover();

  await Promise.all([
    expect(video).toHaveJSProperty('paused', false),
    expect(currentHoveringTestID).toHaveText('hvp:hover-target-fn'),
  ]);

  // Move the mouse so we're no longer hovering
  await page.mouse.move(0, 0);

  await Promise.all([
    expect(video).toHaveJSProperty('paused', true),
    expect(currentHoveringTestID).toBeEmpty(),
  ]);
});
