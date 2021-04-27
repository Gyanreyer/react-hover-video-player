import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('pausedOverlay and loadingOverlay', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('pausedOverlay and loadingOverlay are shown and hidden correctly as the video is started and stopped', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
      overlayTransitionDuration: 500,
      loadingStateTimeout: 100,
    });

    // The paused overlay should be visible since we're in the initial idle paused state
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
      transition: 'opacity 500ms',
    });
    // The loading overlay should be hidden
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 500ms',
    });

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The paused overlay should still be visible while we wait for the video to play
    expect(pausedOverlayWrapper).toBeVisible();
    // The loading overlay should still be hidden until the loading state timeout has passed
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Advance time just 1ms short of when the loading state timeout should kick in
    advanceVideoTime(99);
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Advance 1 more ms and the loading overlay should now be visible
    advanceVideoTime(1);
    expect(loadingOverlayWrapper).toBeVisible();

    // Advance time for the video to finish loading
    advanceVideoTime(300);

    // The video should now be playing and the overlays should be hidden
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Fire a mouseLeave event to stop the video
    fireEvent.mouseLeave(playerContainer);

    // Since we're stopping, the paused overlay should be visible again
    expect(pausedOverlayWrapper).toBeVisible();
    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper).not.toBeVisible();

    // The video should still be playing until the overlay transition timeout has completed
    expect(videoElement).toBePlaying();

    // Advance time 1ms short of when the transition timeout should run
    advanceVideoTime(499);
    expect(videoElement).toBePlaying();

    // Advance 1 more ms and the video should now be paused
    advanceVideoTime(1);
    expect(videoElement).toBePaused();

    // The paused overlay should still be visible and the loading overlay should be hidden
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();
  });

  test('the loading state overlay is not shown if the video plays before the loading state timeout completes', () => {
    const {
      videoElement,
      playerContainer,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      loadingOverlay: <div />,
      loadingStateTimeout: 1000,
    });

    // The loading overlay should be hidden initially
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // Advance time to 1ms short of when the video will finish loading
    advanceVideoTime(399);
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Advance 1ms so the video finishes loading
    advanceVideoTime(1);
    expect(videoElement).toBePlaying();
    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Advance the timer sufficiently to prove the loading state timeout was cancelled
    advanceVideoTime(1000);

    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper).not.toBeVisible();
  });
});
