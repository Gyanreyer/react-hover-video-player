import React from 'react';
import { fireEvent, act } from '@testing-library/react';

import { renderHoverVideoPlayer, getPlayPromise } from '../utils';

describe('Video props', () => {
  test('isVideoMuted prop correctly sets muted attribute on video', () => {
    const { container, rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    const videoElement = container.querySelector('video');

    // muted should be true by default
    expect(videoElement.muted).toBe(true);

    // Re-render with the video unmuted
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', muted: false });
    expect(videoElement.muted).toBe(false);

    // Re-render with muted explicitly set to true
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', muted: true });
    expect(videoElement.muted).toBe(true);
  });

  test('shouldVideoLoop prop correctly sets loop attribute on video', () => {
    const { container, rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    const videoElement = container.querySelector('video');

    // Loop should be true by default
    expect(videoElement).toHaveAttribute('loop');

    // Re-render with looping disabled on the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      loop: false,
    });
    expect(videoElement).not.toHaveAttribute('loop');

    // Re-render with loop explicitly set to true on the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      loop: true,
    });
    expect(videoElement).toHaveAttribute('loop');
  });
});

describe('shouldRestartOnVideoStopped', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shouldRestartOnVideoStopped prop restarts the video when set to true', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // shouldRestartOnVideoStopped is true by default
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    // The video's time should now be greater than 0 because it's playing
    expect(videoElement.currentTime).toBeGreaterThan(0);
    expect(videoElement).toBePlaying();

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    expect(videoElement.currentTime).toBeGreaterThan(0);

    // Advance a sufficient amount of time for the stop attempt to complete
    act(() => jest.advanceTimersByTime(500));

    // The video time should have been paused and reset
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });

  test('shouldRestartOnVideoStopped prop does not restart the video when set to false', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      shouldRestartOnVideoStopped: false,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBeLoading();

    // Wait for the promise returned by play() to resolve
    await act(() => getPlayPromise(videoElement, 0));

    // The video's time should now be greater than 0 because it's playing
    expect(videoElement.currentTime).toBeGreaterThan(0);
    expect(videoElement).toBePlaying();

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    // Advance a sufficient amount of time for the stop attempt to complete
    act(() => jest.advanceTimersByTime(500));

    // The video time should not have been reset to 0
    expect(videoElement.currentTime).toBeGreaterThan(0);
    expect(videoElement).toBePaused();
  });
});

describe('pausedOverlay and loadingOverlay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('pausedOverlay and loadingOverlay are shown and hidden correctly as the video is started and stopped', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
      overlayFadeTransitionDuration: 500,
      loadingStateTimeoutDuration: 500,
    });

    const videoElement = container.querySelector('video');

    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // The paused overlay should be visible since we're in the initial idle paused state
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(pausedOverlayWrapper.style.transition).toBe('opacity 500ms');
    // The loading overlay should be hidden
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.transition).toBe('opacity 500ms');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The paused overlay should still be visible while we wait for the video to play
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    // The loading overlay should still be hidden until the loading state timeout has passed
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    act(() => jest.advanceTimersByTime(500));

    // The loading state timeout has now passed without the video playing so the loading overlay should be visible
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    // Both overlays should be hidden now that we are playing
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Fire a mouseLeave event to stop the video
    fireEvent.mouseLeave(playerContainer);

    // Advance 500ms to let the paused overlay fade back in
    act(() => jest.advanceTimersByTime(500));

    // Since we're stopping, the paused overlay should be visible again
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('the loading state overlay is not shown if the video plays before the loading state timeout completes', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      loadingOverlay: <div />,
      loadingStateTimeoutDuration: 500,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // The loading overlay should be hidden initially
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The loading overlay should be hidden until the loading state timeout has completed
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    act(() => jest.advanceTimersByTime(499));

    // We're 1 ms short of the loading state timeout so the loading overlay should still be hidden
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Resolve the play promise
    await act(() => getPlayPromise(videoElement, 0));

    // The loading overlay should stil be hidden
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance the timer sufficiently to prove the loading state timeout was cancelled
    act(() => jest.advanceTimersByTime(500));

    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });
});

describe('isFocused', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('isFocused prop starts and stops the video correctly', async () => {
    const { container, rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // isFocused is false by default
    });

    const videoElement = container.querySelector('video');

    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();

    // Set isFocused to true to start playing the video
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', isFocused: true });

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();

    // Set isFocused back to false to stop playing
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', isFocused: false });

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();

    // Advance timers by sufficient amount of time to complete the stop attempt
    act(() => jest.advanceTimersByTime(500));

    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });

  test('other events which would normally stop the video are ignored if isFocused prop is true', async () => {
    const {
      container,
      getByTestId,
      rerenderWithProps,
    } = renderHoverVideoPlayer({ videoSrc: 'fake/video-file.mp4' });

    const playerContainer = getByTestId('hover-video-player-container');
    const videoElement = container.querySelector('video');

    expect(videoElement).toBePaused();

    // Re-render with isFocused set to true to start playing
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', isFocused: true });

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();

    fireEvent.mouseEnter(playerContainer);

    // Play shouldn't have been called again since we're already playing
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();

    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Fire some events that would normally pause the video
    fireEvent.mouseLeave(playerContainer);
    act(() => jest.advanceTimersByTime(500));

    // The video still shouldn't have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();

    fireEvent.touchStart(document.body);
    act(() => jest.advanceTimersByTime(500));

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
  });
});

describe('overlayFadeTransitionDuration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Stop attempts take the amount of time set by overlayFadeTransitionDuration prop if a pausedOverlay is provided', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      overlayFadeTransitionDuration: 900,
    });

    const videoElement = container.querySelector('video');

    const playerContainer = getByTestId('hover-video-player-container');

    expect(videoElement).toBePaused();

    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    fireEvent.mouseLeave(playerContainer);

    // A stop attempt should be in progress but not completed yet
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();

    // Advance timer just up to before the pause timeout should complete
    jest.advanceTimersByTime(899);

    // The pause timeout should still be in progress since we're just 1ms short of the transition duration
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();

    act(() => jest.advanceTimersByTime(1));

    // The stop attempt should be completed now that the full fade duration is complete
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });

  test('Stop attempts stop immediately if a pausedOverlay is not provided', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      overlayFadeTransitionDuration: 900,
    });

    const playerContainer = getByTestId('hover-video-player-container');
    const videoElement = container.querySelector('video');

    expect(videoElement).toBePaused();
    fireEvent.mouseEnter(playerContainer);
    expect(videoElement).toBeLoading();
    await act(() => getPlayPromise(videoElement, 0));
    expect(videoElement).toBePlaying();

    fireEvent.mouseLeave(playerContainer);

    // A stop attempt should be in progress but not completed yet
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();

    // Just update the timers - the pause timeout should have a timeout of 0ms and will fire
    act(() => jest.advanceTimersByTime(0));

    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });
});

describe('shouldUseOverlayDimensions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shouldUseOverlayDimensions prop applies the correct styling when set to true alongside a paused overlay', () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      // shouldUseOverlayDimensions is true by default
    });

    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const videoElement = container.querySelector('video');

    expect(videoElement).toHaveAttribute('preload', 'none');
    expect(pausedOverlayWrapper).toHaveStyleRule('position', 'relative');
    expect(videoElement).toHaveStyleRule('position', 'absolute');
  });

  test('shouldUseOverlayDimensions prop applies the correct styling when set to false alongside a paused overlay', () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      shouldUseOverlayDimensions: false,
    });

    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const videoElement = container.querySelector('video');

    expect(videoElement).toHaveAttribute('preload', 'metadata');
    expect(pausedOverlayWrapper).toHaveStyleRule('position', 'absolute');
    // The video element shouldn't have a position style rule set
    expect(videoElement).not.toHaveStyleRule('position', 'absolute');
  });

  test('shouldUseOverlayDimensions should be ignored and applies the correct styling when no paused overlay is provided', () => {
    const { container, queryByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      shouldUseOverlayDimensions: true,
    });

    const pausedOverlayWrapper = queryByTestId('paused-overlay-wrapper');
    const videoElement = container.querySelector('video');

    expect(videoElement).toHaveAttribute('preload', 'metadata');
    expect(pausedOverlayWrapper).not.toBeInTheDocument();
    // The video element shouldn't have a position style rule set
    expect(videoElement).not.toHaveStyleRule('position');
  });
});
