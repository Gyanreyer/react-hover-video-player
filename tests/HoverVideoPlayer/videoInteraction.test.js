import React from 'react';
import { fireEvent, act } from '@testing-library/react';

import { renderHoverVideoPlayer, getPlayPromise } from '../utils';

describe('Handles interaction events correctly', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('mouseEnter and mouseLeave events take the video through its play and pause flows correctly', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // The video should initially be paused
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The video should have a play attempt in progress
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance timer sufficiently for the loading state to start showing
    act(() => jest.advanceTimersByTime(500));

    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Mouse out of the container to stop playing the video
    fireEvent.mouseLeave(playerContainer);

    // The video should not be paused until the timeout has completed
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance a sufficient amount of time for the pause timeout to have completed
    act(() => jest.advanceTimersByTime(500));

    // The video should have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('touch events take the video through its play and pause flows correctly', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // The video should initially be paused
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Touch the container to start playing the video
    fireEvent.touchStart(playerContainer);

    // The video should have a play attempt in progress
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance timer sufficiently for the loading state to start showing
    act(() => jest.advanceTimersByTime(500));

    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Touching an element inside of the player container should not start a stop attempt
    fireEvent.touchStart(videoElement);

    // Wait to sufficiently prove a pause timeout was not started
    jest.advanceTimersByTime(500);

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Touching outside of the player container should start a stop attempt
    fireEvent.touchStart(document.body);

    // Pause shouldn't have been called yet until the pause timeout completes
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(500);

    // The video should have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });
});

describe('Follows video interaction flows correctly', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('an attempt to play the video will correctly interrupt any attempts to pause it', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    // THe paused overlay should be hidden
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // We are now in playing state, so mouse out to stop again
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
    // The paused overlay should be fading back in
    expect(pausedOverlayWrapper.style.opacity).toBe('1');

    // Mouse back over to cancel the stop attempt and start a play attempt
    fireEvent.mouseEnter(playerContainer);

    // Play should not have been called a second time since we're already playing
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');

    // Wait sufficiently to prove the stop attempt was cancelled
    act(() => jest.advanceTimersByTime(500));

    // The video shouldn't have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
  });

  test('the video will be paused immediately when its play attempt completes after we have already stopped', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance timers so the loading state should be visible
    act(() => jest.advanceTimersByTime(500));

    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Fire a mouseLeave event to kick off a stop attempt before the play promise has resolved
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance the timers by a sufficient amount of time for the pause timeout to complete
    act(() => jest.advanceTimersByTime(500));

    // The player should have been moved into the paused state but technically the video is not paused because we're waiting for the play promise to resolve
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    // We should have immediately paused after the promise resolved
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
  });

  test('an attempt to play the video when it is already playing will be ignored', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The play attempt should have started
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // A second mouseEnter event should effectively be ignored
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement).toBePlaying();

    await act(() => getPlayPromise(videoElement, 0));

    // We should not have run through the play attempt flow again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('an attempt to play the video when a previous play attempt is still loading will show the loading state again', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Stop the video while it's still loading in the background
    fireEvent.mouseLeave(playerContainer);

    // Allow the stop attempt to succeed
    jest.advanceTimersByTime(500);

    // The video shouldn't have been paused since the initial play attempt is still in progress
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    fireEvent.mouseEnter(playerContainer);
    // We shouldn't havec called play a second time but the onStartingVideo callback should've fired again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    act(() => jest.advanceTimersByTime(500));

    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    // The start attempt should have succeeded
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('an attempt to pause the video when it is already paused will be ignored', () => {
    const { container, getByTestId } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    // Mouse out of the container even though it was never started properly
    fireEvent.mouseLeave(playerContainer);

    // Advance timers sufficiently so that a stop attempt could complete if it was incorrectly started
    jest.advanceTimersByTime(500);

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('handles a video playback error correectly', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
      },
      {
        // The promise returned by video.play() should reject
        shouldPlaybackFail: true,
      }
    );

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');

    // Mock the console.error function so we can verify that an error was logged correctly
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    let errorMessage = null;
    try {
      await act(() => getPlayPromise(videoElement, 0));
    } catch (error) {
      errorMessage = error;
    }
    // The promise should've rejected
    expect(errorMessage).toBe('The video broke');

    // The video should have been paused after the play attempt failed
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();

    // The error should have been logged correctly
    expect(console.error).toHaveBeenCalledWith(
      `HoverVideoPlayer playback failed for src ${videoElement.currentSrc}:`,
      'The video broke'
    );

    // Restore the console.error function
    console.error = originalConsoleError;
  });
});

describe('Supports browsers that do not return a promise from video.play()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("handles start flow correctly for browsers that don't return a Promise from video.play()", async () => {
    const { container, getByTestId } = renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
        pausedOverlay: <div />,
        loadingOverlay: <div />,
      },
      {
        // video.play() should not return a promise to emulate the behavior of some older browsers
        shouldPlayReturnPromise: false,
      }
    );

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement.play).toHaveReturnedWith(undefined);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance time sufficiently for the play timeout to complete
    act(() => jest.advanceTimersByTime(400));

    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    // The loading overlay should now be visible
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Flush out our promise which should have been resolved
    await act(() => new Promise(setImmediate));

    // The video should now be playing
    expect(videoElement).toBePlaying();
  });

  test("handles playback errors correctly for browsers that don't return a Promise from video.play()", async () => {
    const { container, getByTestId } = renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
      },
      {
        // video.play() should not return a promise and should throw an error during its playback attempt
        shouldPlaybackFail: true,
        shouldPlayReturnPromise: false,
      }
    );

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');

    // Mock the console.error function so we can verify that an error was logged correctly
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(videoElement).toBePaused();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement.play).toHaveReturnedWith(undefined);
    expect(videoElement).toBeLoading();

    jest.advanceTimersByTime(400);
    // Flush out the promise since it should have been rejected after the timeout completed
    await act(() => new Promise(setImmediate));

    // The video should be paused again
    expect(videoElement).toBePaused();

    // The error should have been logged correctly
    expect(console.error).toHaveBeenCalledWith(
      `HoverVideoPlayer playback failed for src ${videoElement.currentSrc}:`,
      'the onError event was fired'
    );

    console.error = originalConsoleError;
  });
});
