import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('Handles interactions correctly', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('mouseEnter and mouseLeave events take the video through its play and pause flows correctly', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    // The video should initially be paused
    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // Advance time enough that the loading state timeout should have run but the video hasn't finished loading
    advanceVideoTime(200);

    // The loading overlay should now be visible
    expect(loadingOverlayWrapper).toBeVisible();

    // Advance time enough for the video to finish loading and play
    advanceVideoTime(200);
    expect(videoElement.play).toHaveBeenCalledTimes(1);

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Mouse out of the container to stop playing the video
    fireEvent.mouseLeave(playerContainer);

    // The video should not be paused until the timeout has completed
    expect(videoElement.pause).not.toHaveBeenCalled();

    // The paused overlay should be getting faded back in
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Advance time enough for the pause state transition to complete
    advanceVideoTime(400);

    expect(videoElement.pause).toHaveBeenCalledTimes(1);

    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Mouse over one last time to start playing again
    fireEvent.mouseEnter(playerContainer);

    // The video should be playing right away since it's already loaded
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();
  });

  test('touch events take the video through its play and pause flows correctly', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    // The video should initially be paused
    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Touch the container to start playing the video
    fireEvent.touchStart(playerContainer);

    // Advance time enough that the loading state timeout should have run but the video hasn't finished loading
    advanceVideoTime(200);

    // The loading overlay should now be visible
    expect(loadingOverlayWrapper).toBeVisible();

    // Advance time enough for the video to finish loading and play
    advanceVideoTime(200);

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Touch somewhere outside of the element to stop "hovering"
    fireEvent.touchStart(document.body);

    // The video should not be paused until the timeout has completed
    expect(videoElement.pause).not.toHaveBeenCalled();

    // The paused overlay should be getting faded back in
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Advance time enough for the pause state transition to complete
    advanceVideoTime(400);

    expect(videoElement.pause).toHaveBeenCalledTimes(1);

    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Touch the container one last time to start playing again
    fireEvent.touchStart(playerContainer);

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();
  });

  test('an attempt to play the video will correctly interrupt any attempts to pause it', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // Tick forward so the video loads
    advanceVideoTime(300);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();

    // THe paused overlay should be hidden
    expect(pausedOverlayWrapper).not.toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // We are now in playing state, so mouse out to pause again
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its pause attempt but not completed it
    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBePlaying();
    // The paused overlay should be fading back in
    expect(pausedOverlayWrapper).toBeVisible();

    // Mouse back over to cancel the pause attempt and start a play attempt
    fireEvent.mouseEnter(playerContainer);

    // The paused overlay should be hidden again
    expect(pausedOverlayWrapper).not.toBeVisible();

    // Advance time enough that the pause state transition timeout should have completed if it wasn't cancelled
    advanceVideoTime(300);

    // The video shouldn't have been paused
    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();
  });

  test('an attempt to play the video when it is already loading will be handled correctly', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
      loadingStateTimeout: 50,
    });

    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // Tick forward so the video is still loading
    advanceVideoTime(100);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    // THe paused overlay should be hidden
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).toBeVisible();

    // We are now in playing state, so mouse out to pause again
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its pause attempt but not completed it
    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBeLoading();
    // The paused overlay should be fading back in and the loading overlay should be hidden again
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Mouse back over to cancel the pause attempt and start a play attempt
    fireEvent.mouseEnter(playerContainer);

    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Tick forward so the loading overlay is shown again but the video still isn't done loading
    advanceVideoTime(100);

    expect(videoElement).toBeLoading();
    // The loading overlay should be visible
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).toBeVisible();

    // Allow the video to finish loading
    advanceVideoTime(100);

    expect(videoElement).toBePlaying();

    // The video shouldn't have been paused
    expect(videoElement.pause).not.toHaveBeenCalled();
    // Play should have only been called once
    expect(videoElement.play).toHaveBeenCalledTimes(1);
  });

  test('an attempt to play the video when it is already playing will be ignored', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // Tick forward so the video loads
    advanceVideoTime(300);

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // A second mouseEnter event should effectively be ignored
    fireEvent.mouseEnter(playerContainer);

    advanceVideoTime(300);

    // We should not have run through the play attempt flow again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).not.toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();
  });

  test('an attempt to pause the video when it is already paused will be ignored', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    // Mouse out of the container even though it was never started properly
    fireEvent.mouseLeave(playerContainer);

    // Advance time enough to prove that a pause attempt was not incorrectly started
    advanceVideoTime(300);

    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();
  });

  test('pausing the video will correctly interrupt an active attempt to play the video', () => {
    const {
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
      // Make the overlay transition duration fast enough that it won't disrupt
      overlayTransitionDuration: 50,
      loadingStateTimeout: 50,
    });

    expect(videoElement).toBePaused();

    // Start attempting to play the video
    fireEvent.mouseEnter(playerContainer);

    // Only allow the video to partially load
    advanceVideoTime(50);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).toBeVisible();

    // Mouse away from the video to cancel the play attempt
    fireEvent.mouseLeave(playerContainer);

    // The video is still in a loading state in the background, but the overlay state should have reverted to
    // only showing the paused overlay
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();

    // Advance time enough so that the timeout to pause the video should run and not do anything since the play
    // promise still hasn't resolved
    advanceVideoTime(50);
    expect(videoElement).toBeLoading();

    // Advance time to allow the video's play attempt to resolve so the video can actually be paused
    advanceVideoTime(200);

    // The video should be paused
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toBeVisible();
    expect(loadingOverlayWrapper).not.toBeVisible();
  });
});
