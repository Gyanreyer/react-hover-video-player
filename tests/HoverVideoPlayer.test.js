import React from 'react';
import { fireEvent, act, screen, render } from '@testing-library/react';

// This is being mapped in the jest config files so we can alternate between
// running tests off of the development version (../src) of the component or
// the built production version (../es)
// eslint-disable-next-line import/no-unresolved
import HoverVideoPlayer from 'react-hover-video-player';

import {
  renderHoverVideoPlayer,
  getPlayPromise,
  mockConsoleError,
  addMockedFunctionsToVideoElement,
} from './utils';

describe('videoSrc prop', () => {
  describe('Handles valid videoSrc prop values correctly', () => {
    mockConsoleError();

    test('correctly handles receiving a string for the videoSrc prop', () => {
      renderHoverVideoPlayer({
        videoSrc: '/fake/video-file.mp4',
      });

      const videoElement = screen.getByTestId('video-element');

      // Ensure we have one source that has been set up correctly
      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(1);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[0]).not.toHaveAttribute('type');
    });

    test('correctly handles receiving an array of strings for the videoSrc prop', () => {
      renderHoverVideoPlayer({
        videoSrc: ['/fake/video-file.webm', '/fake/video-file.mp4'],
      });

      const videoElement = screen.getByTestId('video-element');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(2);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
      expect(videoSources[0]).not.toHaveAttribute('type');
      expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[1]).not.toHaveAttribute('type');
    });

    test('correctly handles receiving a valid object for the videoSrc prop', () => {
      renderHoverVideoPlayer({
        videoSrc: { src: '/fake/video-file.mp4', type: 'video/mp4' },
      });

      const videoElement = screen.getByTestId('video-element');

      // Ensure we have one source that has been set up correctly
      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(1);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[0]).toHaveAttribute('type', 'video/mp4');
    });

    test('correctly handles receiving an array of objects for the videoSrc prop', () => {
      renderHoverVideoPlayer({
        videoSrc: [
          { src: '/fake/video-file.webm', type: 'video/webm' },
          { src: '/fake/video-file.mp4', type: 'video/mp4' },
        ],
      });

      const videoElement = screen.getByTestId('video-element');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(2);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
      expect(videoSources[0]).toHaveAttribute('type', 'video/webm');
      expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[1]).toHaveAttribute('type', 'video/mp4');
    });

    test('correctly handles receiving an array with a mix of strings and objects for the videoSrc prop', () => {
      renderHoverVideoPlayer({
        videoSrc: [
          '/fake/video-file.webm',
          { src: '/fake/video-file.avi' },
          { src: '/fake/video-file.mp4', type: 'video/mp4' },
        ],
      });

      const videoElement = screen.getByTestId('video-element');

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
    mockConsoleError(true);

    test('correctly handles not receiving a videoSrc prop', () => {
      renderHoverVideoPlayer({});

      const videoElement = screen.getByTestId('video-element');

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(0);

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error: 'videoSrc' prop is required for HoverVideoPlayer component"
      );
    });

    test('correctly handles receiving a single invalid value for the videoSrc prop', () => {
      renderHoverVideoPlayer({
        videoSrc: 100,
      });

      const videoElement = screen.getByTestId('video-element');

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
      renderHoverVideoPlayer({
        videoSrc: [
          'valid-video-file.webm',
          false,
          { src: 'valid-video-file.mp4', type: 'video/mp4' },
        ],
      });

      const videoElement = screen.getByTestId('video-element');

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
    mockConsoleError();

    test('correctly handles receiving a valid object for the videoCaptions prop', () => {
      renderHoverVideoPlayer({
        videoSrc: '/fake/video-file.mp4',
        videoCaptions: {
          src: '/fake/captions-file-en.vtt',
          srcLang: 'en',
          label: 'English',
        },
      });

      const videoElement = screen.getByTestId('video-element');

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
      renderHoverVideoPlayer({
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

      const videoElement = screen.getByTestId('video-element');

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
    mockConsoleError(true);

    test('correctly handles receiving a single invalid value for the videoCaptions prop', () => {
      renderHoverVideoPlayer({
        videoSrc: 'fake/video-file.mp4',
        videoCaptions: false,
      });

      const videoElement = screen.getByTestId('video-element');

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
      renderHoverVideoPlayer({
        videoSrc: 'fake/video-file.mp4',
        videoCaptions: [
          {
            src: '/fake/captions-file-en.vtt',
            srcLang: 'en',
            label: 'English',
          },
          'bad-captions-file.vtt',
          100,
          {
            src: '/fake/captions-file-fr.vtt',
            srcLang: 'fr',
            label: 'French',
          },
        ],
      });

      const videoElement = screen.getByTestId('video-element');

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
        'bad-captions-file.vtt'
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
  mockConsoleError();

  test('muted prop correctly sets muted attribute on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // muted is true by default
    });

    const videoElement = screen.getByTestId('video-element');

    expect(videoElement.muted).toBe(true);

    // Re-render with the video unmuted
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', muted: false });
    expect(videoElement.muted).toBe(false);

    // Re-render with muted explicitly set to true
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', muted: true });
    expect(videoElement.muted).toBe(true);
  });

  test('volume prop correctly sets volume attribute on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // volume is 1 by default
    });

    const videoElement = screen.getByTestId('video-element');

    expect(videoElement.volume).toBe(1);

    // Re-render with a different volume level
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', volume: 0.2 });
    expect(videoElement.volume).toBe(0.2);
  });

  test('loop prop correctly sets loop attribute on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // loop is true by default
    });

    const videoElement = screen.getByTestId('video-element');

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

  test('crossOrigin prop correctly sets crossorigin attribute on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // crossOrigin is 'anonymous' by default
    });

    const videoElement = screen.getByTestId('video-element');

    expect(videoElement).toHaveAttribute('crossorigin', 'anonymous');

    // Re-render with looping disabled on the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      crossOrigin: 'use-credentials',
    });
    expect(videoElement).toHaveAttribute('crossorigin', 'use-credentials');
  });

  test('preload prop correctly sets preload attribute on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    const videoElement = screen.getByTestId('video-element');

    expect(videoElement).not.toHaveAttribute('preload');

    // Re-render with preload set to 'metadata'
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      preload: 'metadata',
    });
    expect(videoElement).toHaveAttribute('preload', 'metadata');
  });

  test('controls prop correctly sets controls attribute on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    const videoElement = screen.getByTestId('video-element');

    // The video's `controls` attribute should not be set by default
    expect(videoElement).not.toHaveAttribute('controls');

    // Re-render with `controls` set to true
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      controls: true,
    });
    // The video should have a `controls` attribute set
    expect(videoElement).toHaveAttribute('controls');
  });

  test('controlsList prop correctly sets controlslist attribute on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    const videoElement = screen.getByTestId('video-element');

    // The video's `controlslist` attribute should not be set by default
    expect(videoElement).not.toHaveAttribute('controlslist');

    // Re-render with `controlsList` set to "nodownload"
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      controlsList: 'nodownload',
    });
    // The video should have a `controls` attribute set
    expect(videoElement).toHaveAttribute('controlslist', 'nodownload');
  });

  test('disableRemotePlayback prop correctly sets disableRemotePlayback property on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    const videoElement = screen.getByTestId('video-element');

    // The video's `disableRemotePlayback` attribute should be set to true by default
    expect(videoElement.disableRemotePlayback).toBe(true);

    // Re-render with `disableRemotePlayback` set to false
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      disableRemotePlayback: false,
    });
    // The video should have `disableRemotePlayback` set to false
    expect(videoElement.disableRemotePlayback).toBe(false);
  });

  test('disablePictureInPicture prop correctly sets disablePictureInPicture property on video', () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    const videoElement = screen.getByTestId('video-element');

    // The video's `disablePictureInPicture` attribute should be set to true by default
    expect(videoElement.disablePictureInPicture).toBe(true);

    // Re-render with `disablePictureInPicture` set to false
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      disablePictureInPicture: false,
    });
    // The video should have `disablePictureInPicture` set to false
    expect(videoElement.disablePictureInPicture).toBe(false);
  });
});

describe('restartOnPaused', () => {
  mockConsoleError();

  test('restartOnPaused prop restarts the video when set to true', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      restartOnPaused: true,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();

    // Simulate the video having been playing for 5 seconds
    videoElement.currentTime = 5;

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    // The video time should have been paused and reset to 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });

  test('restartOnPaused prop does not restart the video when set to false', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // restartOnPaused is false by default
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBeLoading();

    // Wait for the promise returned by play() to resolve
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();

    // Simulate the video having been playing for 5 seconds
    videoElement.currentTime = 5;

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    // The video time should not have been reset to 0
    expect(videoElement.currentTime).toBe(5);
    expect(videoElement).toBePaused();
  });
});

describe('unloadVideoOnPaused', () => {
  mockConsoleError();

  test("unloadVideoOnPaused prop unloads the video's sources while it is paused when set to true", async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      unloadVideoOnPaused: true,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();
    expect(videoElement.currentSrc).toBe('');

    // The video should not have any sources
    expect(videoElement.querySelectorAll('source')).toHaveLength(0);

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBeLoading();
    expect(videoElement.querySelectorAll('source')).toHaveLength(1);
    expect(videoElement.currentSrc).toBe(
      `${window.location.origin}/fake/video-file.mp4`
    );

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();

    // simulate the video having played for 5s
    videoElement.currentTime = 5;

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    // The video should have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();

    // The video's source should have been removed
    expect(videoElement.currentSrc).toBe('');
    expect(videoElement.querySelectorAll('source')).toHaveLength(0);

    // The video time should have been reset to 0 because the source was removed
    expect(videoElement.currentTime).toBe(0);

    // Start playing the video again
    fireEvent.mouseEnter(playerContainer);

    await act(() => getPlayPromise(videoElement, 0));

    // The video time should have been correctly restored to what it was before it was paused
    expect(videoElement.currentTime).toBe(5);
    expect(videoElement).toBePlaying();
  });
});

describe('pausedOverlay and loadingOverlay', () => {
  mockConsoleError();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('pausedOverlay and loadingOverlay are shown and hidden correctly as the video is started and stopped', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
      overlayTransitionDuration: 500,
      loadingStateTimeout: 500,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

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
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    // The loading overlay should still be hidden until the loading state timeout has passed
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Complete the loading state timeout
    act(() => jest.runAllTimers());

    // The paused overlay should still be visible since the video is not playing yet
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    // The loading state timeout has now passed without the video playing so the loading overlay should be visible
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    // Both overlays should be hidden now that we are playing
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Fire a mouseLeave event to stop the video
    fireEvent.mouseLeave(playerContainer);

    // Since we're stopping, the paused overlay should be visible again
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    // The video should still be playing
    expect(videoElement).toBePlaying();

    // Run the pause timeout since we have a pause overlay
    act(() => jest.runAllTimers());

    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });

  test('the loading state overlay is not shown if the video plays before the loading state timeout completes', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      loadingOverlay: <div />,
      loadingStateTimeout: 500,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    // The loading overlay should be hidden initially
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The loading overlay should be hidden until the loading state timeout has completed
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    act(() => jest.advanceTimersByTime(499));

    // We're 1 ms short of the loading state timeout so the loading overlay should still be hidden
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Resolve the play promise
    await act(() => getPlayPromise(videoElement, 0));

    // The loading overlay should stil be hidden
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Advance the timer sufficiently to prove the loading state timeout was cancelled
    act(() => jest.advanceTimersByTime(500));

    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });
});

describe('focused', () => {
  mockConsoleError();

  test('focused prop starts and stops the video correctly', async () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // focused is false by default
    });

    const videoElement = screen.getByTestId('video-element');

    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();

    // Set focused to true to start playing the video
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', focused: true });

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();

    // Set focused back to false to stop playing
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', focused: false });

    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });

  test('other events which would normally stop the video are ignored if focused prop is true', async () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    const playerContainer = screen.getByTestId('hover-video-player-container');
    const videoElement = screen.getByTestId('video-element');

    expect(videoElement).toBePaused();

    // Re-render with focused set to true to start playing
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', focused: true });

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

describe('disableDefaultEventHandling', () => {
  mockConsoleError();

  test('disableDefaultEventHandling prop disables all default event handling', async () => {
    const { rerenderWithProps } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      disableDefaultEventHandling: true,
    });

    const playerContainer = screen.getByTestId('hover-video-player-container');
    const videoElement = screen.getByTestId('video-element');

    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();

    fireEvent.mouseEnter(playerContainer);
    fireEvent.touchStart(playerContainer);

    // Mouse and touch events should not have done anything
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();

    // Set focused to true to start playing the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      disableDefaultEventHandling: true,
      focused: true,
    });

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();

    fireEvent.mouseLeave(playerContainer);
    fireEvent.touchStart(document.body);

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
  });
});

describe('hoverTargetRef', () => {
  mockConsoleError();

  test('hoverTargetRef works correctly for a functional component', async () => {
    function PlayerWithCustomHoverTargetFunctionalComponent() {
      const hoverTargetRef = React.useRef();

      return (
        <div>
          <a href="#test" ref={hoverTargetRef} data-testid="test-hover-target">
            Hovering on me will start the video!
          </a>
          <HoverVideoPlayer
            videoSrc="fake-video.mp4"
            hoverTargetRef={hoverTargetRef}
          />
        </div>
      );
    }

    render(<PlayerWithCustomHoverTargetFunctionalComponent />);

    const playerContainer = screen.getByTestId('hover-video-player-container');
    const customHoverTarget = screen.getByTestId('test-hover-target');

    const videoElement = screen.getByTestId('video-element');
    // Hook up mocked video element behavior so we can test it easier
    addMockedFunctionsToVideoElement(videoElement);

    fireEvent.mouseEnter(playerContainer);
    fireEvent.touchStart(playerContainer);
    // Interactions should be ignored on player's container since a custom hover target is set
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();

    // Interactions with the custom hover target should start and stop the video
    fireEvent.focus(customHoverTarget);
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    fireEvent.blur(customHoverTarget);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });

  test('hoverTargetRef works correctly for a class component', async () => {
    class PlayerWithCustomHoverTargetClassComponent extends React.Component {
      constructor(props) {
        super(props);

        this.hoverTarget = React.createRef();
      }

      render() {
        return (
          <div>
            <a
              href="#test"
              ref={this.hoverTarget}
              data-testid="test-hover-target"
            >
              Hovering on me will start the video!
            </a>
            <HoverVideoPlayer
              videoSrc="fake-video.mp4"
              hoverTargetRef={this.hoverTarget}
            />
          </div>
        );
      }
    }

    render(<PlayerWithCustomHoverTargetClassComponent />);

    const playerContainer = screen.getByTestId('hover-video-player-container');
    const customHoverTarget = screen.getByTestId('test-hover-target');

    const videoElement = screen.getByTestId('video-element');
    // Hook up mocked video element behavior so we can test it easier
    addMockedFunctionsToVideoElement(videoElement);

    fireEvent.mouseEnter(playerContainer);
    fireEvent.touchStart(playerContainer);
    // Interactions should be ignored on player's container since a custom hover target is set
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();

    // Interactions with the custom hover target should start and stop the video
    fireEvent.focus(customHoverTarget);
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    await act(() => getPlayPromise(videoElement, 0));

    fireEvent.blur(customHoverTarget);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });
});

describe('overlayTransitionDuration', () => {
  mockConsoleError();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Stop attempts take the amount of time set by overlayTransitionDuration prop if a pausedOverlay is provided', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      overlayTransitionDuration: 900,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

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
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      overlayTransitionDuration: 900,
    });

    const playerContainer = screen.getByTestId('hover-video-player-container');
    const videoElement = screen.getByTestId('video-element');

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

describe('sizingMode', () => {
  mockConsoleError();

  test('sizingMode "video" sets correct styling on the player', () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      // sizingMode is 'video' by default
    });

    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const videoElement = screen.getByTestId('video-element');

    expect(videoElement).toHaveStyle({
      position: '',
      display: 'block',
    });
    expect(pausedOverlayWrapper).toHaveStyle({ position: 'absolute' });
  });

  test('sizingMode "overlay" sets correct styling on the player', () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      sizingMode: 'overlay',
    });

    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const videoElement = screen.getByTestId('video-element');

    expect(pausedOverlayWrapper).toHaveStyle({ position: 'relative' });
    expect(videoElement).toHaveStyle({ position: 'absolute' });
  });

  test('sizingMode "container" sets correct styling on the player', () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      sizingMode: 'container',
    });

    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const videoElement = screen.getByTestId('video-element');

    expect(videoElement).toHaveStyle({ position: 'absolute' });
    expect(pausedOverlayWrapper).toHaveStyle({ position: 'absolute' });
  });

  test('sizingMode "manual" sets correct styling on the player', () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      sizingMode: 'manual',
    });

    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const videoElement = screen.getByTestId('video-element');

    // Position styles should not be set on the video or paused overlay
    expect(videoElement.style.position).toBe('');
    expect(pausedOverlayWrapper.style.position).toBe('');
  });
});

describe('Handles interaction events correctly', () => {
  mockConsoleError();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('mouseEnter and mouseLeave events take the video through its play and pause flows correctly', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    // The video should initially be paused
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The video should have a play attempt in progress
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Let the loading state timeout run to show the loading overlay
    act(() => jest.runAllTimers());

    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Mouse out of the container to stop playing the video
    fireEvent.mouseLeave(playerContainer);

    // The video should not be paused until the timeout has completed
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Let the pause timeout run
    act(() => jest.runAllTimers());

    // The video should have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });

  test('touch events take the video through its play and pause flows correctly', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    // The video should initially be paused
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Touch the container to start playing the video
    fireEvent.touchStart(playerContainer);

    // The video should have a play attempt in progress
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Let the loading state timeout run
    act(() => jest.runAllTimers());

    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Touching an element inside of the player container should not start a stop attempt
    fireEvent.touchStart(videoElement);

    // Run any outstanding timers to prove a pause timeout was not started
    act(() => jest.runAllTimers());

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Touching outside of the player container should start a stop attempt
    fireEvent.touchStart(document.body);

    // Pause shouldn't have been called yet until the pause timeout completes
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Run the pause timeout
    act(() => jest.runAllTimers());

    // The video should have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });
});

describe('Follows video interaction flows correctly', () => {
  mockConsoleError();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('an attempt to play the video will correctly interrupt any attempts to pause it', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    // THe paused overlay should be hidden
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // We are now in playing state, so mouse out to pause again
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its pause attempt but not completed it
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
    // The paused overlay should be fading back in
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });

    // Mouse back over to cancel the pause attempt and start a play attempt
    fireEvent.mouseEnter(playerContainer);

    // Play should not have been called a second time since we're already playing
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Run any outstanding timers to prove the pause attempt was cancelled
    act(() => jest.runAllTimers());

    // The video shouldn't have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });

  test('the video will be paused immediately when its play attempt completes after we have already stopped', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Fire a mouseLeave event to kick off a stop attempt before the play promise has resolved
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // The player should have been moved into the paused state but technically the video is not paused because we're waiting for the play promise to resolve
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    // We should have immediately paused after the promise resolved
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
  });

  test('an attempt to play the video when it is already playing will be ignored', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The play attempt should have started
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // A second mouseEnter event should effectively be ignored
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement).toBePlaying();

    await act(() => getPlayPromise(videoElement, 0));

    // We should not have run through the play attempt flow again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });

  test('an attempt to play the video when a previous play attempt is still loading will show the loading state again', async () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Stop the video while it's still loading in the background
    fireEvent.mouseLeave(playerContainer);

    // Allow the pause attempt to succeed
    jest.runAllTimers();

    // The video shouldn't have been paused since the initial play attempt is still in progress
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    fireEvent.mouseEnter(playerContainer);
    // We shouldn't have called play a second time but the onStartingVideo callback should've fired again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Let the loading state timeout run
    act(() => jest.runAllTimers());

    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });

    // Wait until the play promise has resolved
    await act(() => getPlayPromise(videoElement, 0));

    // The start attempt should have succeeded
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });

  test('an attempt to pause the video when it is already paused will be ignored', () => {
    renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    // Mouse out of the container even though it was never started properly
    fireEvent.mouseLeave(playerContainer);

    // Run all outstanding timers to prove that a pause attempt was not incorrectly started
    jest.runAllTimers();

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });
});

const originalConsoleError = console.error;

describe('Prevents memory leaks when unmounted', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Mock the console.error function so we can verify that an error was logged correctly
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();

    console.error = originalConsoleError;
  });

  test('cleans everything up correctly if the video is unmounted during a play attempt', async () => {
    const { unmount } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      loadingOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

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
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('cleans everything up correctly if the video is unmounted during a failed play attempt', async () => {
    const { unmount } = renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
        loadingOverlay: <div />,
      },
      {
        shouldPlaybackFail: true,
      }
    );

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

    console.error = jest.fn();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBeLoading();

    // Unmount while the play promise is unresolved and the loading timeout is still in progress
    unmount();

    expect(videoElement).not.toBeInTheDocument();

    // Run any existing timers to prove that the loading timeout was cancelled
    jest.runAllTimers();

    let errorMessage = null;
    try {
      await act(() => getPlayPromise(videoElement, 0));
    } catch (error) {
      errorMessage = error;
    }
    // The promise should've rejected
    expect(errorMessage).toBe('The video broke');

    // Only one error should have been logged
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `HoverVideoPlayer playback failed for src ${videoElement.currentSrc}:`,
      'The video broke'
    );
    // The video should not have been paused because it is unmounted
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
  });

  test('cleans everything up correctly if the video is unmounted during a pause attempt', async () => {
    const { unmount } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
    });

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

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
    expect(console.error).toHaveBeenCalledTimes(0);
    // The pause attempt should not have run
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
  });
});

describe('Supports browsers that do not return a promise from video.play()', () => {
  mockConsoleError();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('handles start flow correctly', async () => {
    renderHoverVideoPlayer(
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

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');
    const pausedOverlayWrapper = screen.getByTestId('paused-overlay-wrapper');
    const loadingOverlayWrapper = screen.getByTestId('loading-overlay-wrapper');

    expect(videoElement).toBePaused();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement.play).toHaveReturnedWith(undefined);
    expect(videoElement).toBeLoading();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    // Advance time sufficiently for the play timeout to complete
    act(() => jest.advanceTimersByTime(400));

    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });
    // The loading overlay should now be visible
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '1',
      pointerEvents: 'auto',
    });

    // Flush out our promise which should have been resolved
    await act(() => new Promise(setImmediate));

    // The video should now be playing
    expect(videoElement).toBePlaying();
    expect(pausedOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
    expect(loadingOverlayWrapper).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });
  });

  test('handles start flow correctly multiple times in a row', async () => {
    renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
      },
      {
        // video.play() should not return a promise to emulate the behavior of some older browsers
        shouldPlayReturnPromise: false,
      }
    );

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

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
});

describe('Video playback errors', () => {
  mockConsoleError(true);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('handles a video playback error correectly', async () => {
    renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
      },
      {
        // The promise returned by video.play() should reject
        shouldPlaybackFail: true,
      }
    );

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

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
  });

  test('handles playback errors correctly for browsers that do not support promises', async () => {
    renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
      },
      {
        // video.play() should not return a promise and should throw an error during its playback attempt
        shouldPlaybackFail: true,
        shouldPlayReturnPromise: false,
      }
    );

    const videoElement = screen.getByTestId('video-element');
    const playerContainer = screen.getByTestId('hover-video-player-container');

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
  });
});
