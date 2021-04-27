import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('overlayTransitionDuration', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('Stop attempts take the amount of time set by overlayTransitionDuration prop if a pausedOverlay is provided', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      overlayTransitionDuration: 900,
    });

    expect(videoElement).toBePaused();
    // Paused overlay should be visible and have correct initial styles
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: 1,
      pointerEvents: 'auto',
      // Transition duration should match the overlayTransitionDuration prop value
      transition: 'opacity 900ms',
    });

    // Hover to start playing the video
    fireEvent.mouseEnter(playerContainer);

    //  Advance time for the video to load and start playing
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();

    // Mouse out to stop the video
    fireEvent.mouseLeave(playerContainer);

    // The pause overlay should be visible/fading back in
    expect(pausedOverlayWrapper).toBeVisible();

    // We don't want to pause the video until the pause overlay's 900ms CSS transition has completed
    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBePlaying();

    // Advance timer just up to before the pause timeout should complete
    advanceVideoTime(899);

    // The pause timeout should still be in progress since we're just 1ms short of the transition duration
    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBePlaying();

    // Advance time by 1ms so the pause timeout can run
    advanceVideoTime(300);

    // The stop attempt should be completed now that the full fade duration is complete
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });

  test('Stop attempts stop immediately if a pausedOverlay is not provided', () => {
    const { videoElement, playerContainer } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      overlayTransitionDuration: 900,
    });

    // Get the video playing
    expect(videoElement).toBePaused();
    fireEvent.mouseEnter(playerContainer);
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    // The video should have been paused immediately since we don't have a pause overlay
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });
});
