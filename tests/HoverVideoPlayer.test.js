import React from 'react';
import { fireEvent, act } from '@testing-library/react';

import { renderHoverVideoPlayer, getPlayPromise } from './utils';

describe('videoSrc prop', () => {
  describe('Handles valid videoSrc prop values correctly', () => {
    test('correctly handles receiving a string for the videoSrc prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: '/fake/video-file.mp4',
      });

      const videoElement = container.querySelector('video');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(1);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[0]).not.toHaveAttribute('type');
    });

    test('correctly handles receiving an array of strings for the videoSrc prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: ['/fake/video-file.webm', '/fake/video-file.mp4'],
      });

      const videoElement = container.querySelector('video');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(2);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
      expect(videoSources[0]).not.toHaveAttribute('type');
      expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[1]).not.toHaveAttribute('type');
    });

    test('correctly handles receiving a valid object for the videoSrc prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: { src: '/fake/video-file.mp4', type: 'video/mp4' },
      });

      const videoElement = container.querySelector('video');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(1);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[0]).toHaveAttribute('type', 'video/mp4');
    });

    test('correctly handles receiving an array of objects for the videoSrc prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: [
          { src: '/fake/video-file.webm', type: 'video/webm' },
          { src: '/fake/video-file.mp4', type: 'video/mp4' },
        ],
      });

      const videoElement = container.querySelector('video');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(2);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
      expect(videoSources[0]).toHaveAttribute('type', 'video/webm');
      expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[1]).toHaveAttribute('type', 'video/mp4');
    });

    test('correctly handles receiving an array with a mix of strings and objects for the videoSrc prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: [
          '/fake/video-file.webm',
          { src: '/fake/video-file.avi' },
          { src: '/fake/video-file.mp4', type: 'video/mp4' },
        ],
      });

      const videoElement = container.querySelector('video');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(3);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
      expect(videoSources[0]).not.toHaveAttribute('type');
      expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.avi');
      expect(videoSources[1]).not.toHaveAttribute('type');
      expect(videoSources[2]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[2]).toHaveAttribute('type', 'video/mp4');
    });
  });

  describe('Handles invalid videoSrc prop values correctly', () => {
    let originalConsoleError;

    beforeEach(() => {
      // Mock the console.error function so we can verify that an error was logged correctly
      originalConsoleError = console.error;
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    test('correctly handles not receiving a videoSrc prop', () => {
      const { container } = renderHoverVideoPlayer({});

      const videoElement = container.querySelector('video');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(0);

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error: 'videoSrc' prop is required for HoverVideoPlayer component"
      );
    });

    test('correctly handles receiving a single invalid value for the videoSrc prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: 100,
      });

      const videoElement = container.querySelector('video');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(0);

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error: invalid value provided to HoverVideoPlayer prop 'videoSrc':",
        100
      );
    });

    test('correctly handles receiving an invalid value in an array for the videoSrc prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: [
          'valid-video-file.webm',
          false,
          { src: 'valid-video-file.mp4', type: 'video/mp4' },
        ],
      });

      const videoElement = container.querySelector('video');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(2);
      expect(videoSources[0]).toHaveAttribute('src', 'valid-video-file.webm');
      expect(videoSources[0]).not.toHaveAttribute('type');
      expect(videoSources[1]).toHaveAttribute('src', 'valid-video-file.mp4');
      expect(videoSources[1]).toHaveAttribute('type', 'video/mp4');

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error: invalid value provided to HoverVideoPlayer prop 'videoSrc':",
        false
      );
    });
  });
});

describe('videoCaptions prop', () => {
  describe('Handles valid videoCaptions prop values correctly', () => {
    test('correctly handles receiving a string for the videoCaptions prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: '/fake/video-file.mp4',
        videoCaptions: '/fake/captions-file.vtt',
      });

      const videoElement = container.querySelector('video');

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(1);
      expect(videoTracks[0]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[0]).toHaveAttribute('src', '/fake/captions-file.vtt');
    });

    test('correctly handles receiving a valid object for the videoCaptions prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: '/fake/video-file.mp4',
        videoCaptions: {
          src: '/fake/captions-file-en.vtt',
          srcLang: 'en',
          label: 'English',
        },
      });

      const videoElement = container.querySelector('video');

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(1);
      expect(videoTracks[0]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[0]).toHaveAttribute(
        'src',
        '/fake/captions-file-en.vtt'
      );
      expect(videoTracks[0]).toHaveAttribute('srclang', 'en');
      expect(videoTracks[0]).toHaveAttribute('label', 'English');
    });

    test('correctly handles receiving an array of objects for the videoCaptions prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: '/fake/video-file.mp4',
        videoCaptions: [
          {
            src: '/fake/captions-file-en.vtt',
            srcLang: 'en',
            label: 'English',
          },
          {
            src: '/fake/captions-file-fr.vtt',
            srcLang: 'fr',
            label: 'French',
          },
          {
            src: '/fake/captions-file-de.vtt',
            srcLang: 'de',
            label: 'German',
          },
        ],
      });

      const videoElement = container.querySelector('video');

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(3);
      expect(videoTracks[0]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[0]).toHaveAttribute(
        'src',
        '/fake/captions-file-en.vtt'
      );
      expect(videoTracks[0]).toHaveAttribute('srclang', 'en');
      expect(videoTracks[0]).toHaveAttribute('label', 'English');

      expect(videoTracks[1]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[1]).toHaveAttribute(
        'src',
        '/fake/captions-file-fr.vtt'
      );
      expect(videoTracks[1]).toHaveAttribute('srclang', 'fr');
      expect(videoTracks[1]).toHaveAttribute('label', 'French');

      expect(videoTracks[2]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[2]).toHaveAttribute(
        'src',
        '/fake/captions-file-de.vtt'
      );
      expect(videoTracks[2]).toHaveAttribute('srclang', 'de');
      expect(videoTracks[2]).toHaveAttribute('label', 'German');
    });
  });

  describe('Handles invalid videoCaptions prop values correctly', () => {
    let originalConsoleError;

    beforeEach(() => {
      // Mock the console.error function so we can verify that an error was logged correctly
      originalConsoleError = console.error;
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    test('correctly handles receiving a single invalid value for the videoCaptions prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: 'fake/video-file.mp4',
        videoCaptions: false,
      });

      const videoElement = container.querySelector('video');

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(0);

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
        false
      );
    });

    test('correctly handles receiving an invalid value in an array for the videoCaptions prop', () => {
      const { container } = renderHoverVideoPlayer({
        videoSrc: 'fake/video-file.mp4',
        videoCaptions: [
          {
            src: '/fake/captions-file-en.vtt',
            srcLang: 'en',
            label: 'English',
          },
          false,
          100,
          {
            src: '/fake/captions-file-fr.vtt',
            srcLang: 'fr',
            label: 'French',
          },
        ],
      });

      const videoElement = container.querySelector('video');

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(2);
      expect(videoTracks[0]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[0]).toHaveAttribute(
        'src',
        '/fake/captions-file-en.vtt'
      );
      expect(videoTracks[0]).toHaveAttribute('srclang', 'en');
      expect(videoTracks[0]).toHaveAttribute('label', 'English');

      expect(videoTracks[1]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[1]).toHaveAttribute(
        'src',
        '/fake/captions-file-fr.vtt'
      );
      expect(videoTracks[1]).toHaveAttribute('srclang', 'fr');
      expect(videoTracks[1]).toHaveAttribute('label', 'French');

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenNthCalledWith(
        1,
        "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
        false
      );
      expect(console.error).toHaveBeenNthCalledWith(
        2,
        "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
        100
      );
    });
  });
});

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

    // Complete the loading state timeout
    act(() => jest.runAllTimers());

    // The loading state timeout has now passed without the video playing so the loading overlay should be visible
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    // Both overlays should be hidden now that we are playing
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Fire a mouseLeave event to stop the video
    fireEvent.mouseLeave(playerContainer);

    // Since we're stopping, the paused overlay should be visible again
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
    // The video should still be playing
    expect(videoElement).toBePlaying();

    // Run the pause timeout since we have a pause overlay
    act(() => jest.runAllTimers());

    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
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

    // The video still shouldn't have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();

    fireEvent.touchStart(document.body);

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

    // The video should have been paused immediately
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });
});

describe('shouldUseOverlayDimensions', () => {
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

    // Let the loading state timeout run to show the loading overlay
    act(() => jest.runAllTimers());

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

    // Let the pause timeout run
    act(() => jest.runAllTimers());

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

    // Let the loading state timeout run
    act(() => jest.runAllTimers());

    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Touching an element inside of the player container should not start a stop attempt
    fireEvent.touchStart(videoElement);

    // Run any outstanding timers to prove a pause timeout was not started
    act(() => jest.runAllTimers());

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Touching outside of the player container should start a stop attempt
    fireEvent.touchStart(document.body);

    // Pause shouldn't have been called yet until the pause timeout completes
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Run the pause timeout
    act(() => jest.runAllTimers());

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

    // We are now in playing state, so mouse out to pause again
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its pause attempt but not completed it
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
    // The paused overlay should be fading back in
    expect(pausedOverlayWrapper.style.opacity).toBe('1');

    // Mouse back over to cancel the pause attempt and start a play attempt
    fireEvent.mouseEnter(playerContainer);

    // Play should not have been called a second time since we're already playing
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');

    // Run any outstanding timers to prove the pause attempt was cancelled
    act(() => jest.runAllTimers());

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

    // Fire a mouseLeave event to kick off a stop attempt before the play promise has resolved
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // The player should have been moved into the paused state but technically the video is not paused because we're waiting for the play promise to resolve
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

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

    // Allow the pause attempt to succeed
    jest.runAllTimers();

    // The video shouldn't have been paused since the initial play attempt is still in progress
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    fireEvent.mouseEnter(playerContainer);
    // We shouldn't have called play a second time but the onStartingVideo callback should've fired again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Let the loading state timeout run
    act(() => jest.runAllTimers());

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

    // Run all outstanding timers to prove that a pause attempt was not incorrectly started
    jest.runAllTimers();

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

describe('Prevents memory leaks when unmounted', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('cleans everything up correctly if the video is unmounted during a play attempt', async () => {
    const { container, getByTestId, unmount } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      loadingOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');

    // Spy on console.error so we can fail if any errors are logged
    const consoleErrorSpy = jest.spyOn(console, 'error');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    // Unmount while the play promise is unresolved and the loading timeout is still in progress
    unmount();

    expect(videoElement).not.toBeInTheDocument();

    // Run any existing timers to prove that the loading timeout was cancelled
    jest.runAllTimers();

    // Wait for the play promise to resolve to prove that the play attempt was cancelled
    await getPlayPromise(videoElement, 0);

    // No errors should have been logged
    expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
  });

  test('cleans everything up correctly if the video is unmounted during a pause attempt', async () => {
    const { container, getByTestId, unmount } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
    });

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');

    // Spy on console.error so we can fail if any errors are logged
    const consoleErrorSpy = jest.spyOn(console, 'error');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();

    // Mouse out to start a pause attempt
    fireEvent.mouseLeave(playerContainer);

    // Unmount while the play promise is unresolved and the loading timeout is still in progress
    unmount();

    expect(videoElement).not.toBeInTheDocument();

    // Run any existing timeouts to prove that the pause timeout was cancelled
    jest.runAllTimers();

    // No errors should have been logged
    expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
    // The pause attempt should not have run
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
  });
});

describe('Supports browsers that do not return a promise from video.play()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('handles start flow correctly', async () => {
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
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('handles start flow correctly multiple times in a row', async () => {
    const { container, getByTestId } = renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
      },
      {
        // video.play() should not return a promise to emulate the behavior of some older browsers
        shouldPlayReturnPromise: false,
      }
    );

    const videoElement = container.querySelector('video');
    const playerContainer = getByTestId('hover-video-player-container');

    expect(videoElement).toBePaused();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement.play).toHaveLastReturnedWith(undefined);
    expect(videoElement).toBeLoading();

    await act(() => {
      // Advance time sufficiently for the play timeout to complete
      jest.advanceTimersByTime(400);
      // Flush out our promise which should have been resolved
      return new Promise(setImmediate);
    });

    // The video should now be playing
    expect(videoElement).toBePlaying();

    // Mouse out to pause the video
    fireEvent.mouseLeave(playerContainer);

    expect(videoElement).toBePaused();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(2);
    expect(videoElement.play).toHaveLastReturnedWith(undefined);

    await act(() => {
      // Advance time sufficiently for the play timeout to complete
      jest.advanceTimersByTime(400);
      // Flush out our promise which should have been resolved
      return new Promise(setImmediate);
    });

    expect(videoElement).toBePlaying();
  });

  test('handles playback errors correctly', async () => {
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
