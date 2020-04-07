import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import HoverVideoPlayer from '../src';

const expectVideoHasCorrectAttributes = (
  videoElement,
  { muted = true, loop = true, controls = false, preload = 'metadata' } = {}
) => {
  expect(videoElement).not.toBeNull();

  if (muted) {
    expect(videoElement.muted).toBeTruthy();
  } else {
    expect(videoElement.muted).not.toBeTruthy();
  }

  if (loop) {
    expect(videoElement).toHaveAttribute('loop');
  } else {
    expect(videoElement).not.toHaveAttribute('loop');
  }

  if (controls) {
    expect(videoElement).toHaveAttribute('controls');
  } else {
    expect(videoElement).not.toHaveAttribute('controls');
  }

  expect(videoElement).toHaveAttribute('preload', preload);

  expect(videoElement).toHaveAttribute('playsInline');
};

describe('HoverVideoPlayer', () => {
  describe('Handles valid videoSrc prop values correctly', () => {
    test('correctly handles receiving a string for the videoSrc prop', () => {
      const { container } = render(
        <HoverVideoPlayer videoSrc="/fake/video-file.mp4" />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(1);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[0]).not.toHaveAttribute('type');
    });

    test('correctly handles receiving an array of strings for the videoSrc prop', () => {
      const { container } = render(
        <HoverVideoPlayer
          videoSrc={['/fake/video-file.webm', '/fake/video-file.mp4']}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(2);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
      expect(videoSources[0]).not.toHaveAttribute('type');
      expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[1]).not.toHaveAttribute('type');
    });

    test('correctly handles receiving a valid object for the videoSrc prop', () => {
      const { container } = render(
        <HoverVideoPlayer
          videoSrc={{ src: '/fake/video-file.mp4', type: 'video/mp4' }}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(1);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[0]).toHaveAttribute('type', 'video/mp4');
    });

    test('correctly handles receiving an array of objects for the videoSrc prop', () => {
      const { container } = render(
        <HoverVideoPlayer
          videoSrc={[
            { src: '/fake/video-file.webm', type: 'video/webm' },
            { src: '/fake/video-file.mp4', type: 'video/mp4' },
          ]}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(2);
      expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
      expect(videoSources[0]).toHaveAttribute('type', 'video/webm');
      expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.mp4');
      expect(videoSources[1]).toHaveAttribute('type', 'video/mp4');
    });

    test('correctly handles receiving an array with a mix of strings and objects for the videoSrc prop', () => {
      const { container } = render(
        <HoverVideoPlayer
          videoSrc={[
            '/fake/video-file.webm',
            { src: '/fake/video-file.avi' },
            { src: '/fake/video-file.mp4', type: 'video/mp4' },
          ]}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

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
      const { container } = render(<HoverVideoPlayer />);

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const videoSources = videoElement.querySelectorAll('source');
      expect(videoSources).toHaveLength(0);

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error: 'videoSrc' prop is required for HoverVideoPlayer component"
      );
    });

    test('correctly handles receiving a single invalid value for the videoSrc prop', () => {
      const { container } = render(<HoverVideoPlayer videoSrc={100} />);

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

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
      const { container } = render(
        <HoverVideoPlayer
          videoSrc={[
            'valid-video-file.webm',
            false,
            { src: 'valid-video-file.mp4', type: 'video/mp4' },
          ]}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

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

  describe('Handles valid videoCaptions prop values correctly', () => {
    test('correctly handles receiving a string for the videoCaptions prop', () => {
      const { container } = render(
        <HoverVideoPlayer
          videoSrc="/fake/video-file.mp4"
          videoCaptions="/fake/captions-file.vtt"
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(1);
      expect(videoTracks[0]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[0]).toHaveAttribute('src', '/fake/captions-file.vtt');
    });

    test('correctly handles receiving a valid object for the videoCaptions prop', () => {
      const { container } = render(
        <HoverVideoPlayer
          videoSrc="/fake/video-file.mp4"
          videoCaptions={{
            src: '/fake/captions-file-en.vtt',
            srcLang: 'en',
            label: 'English',
          }}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

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
      const { container } = render(
        <HoverVideoPlayer
          videoSrc="/fake/video-file.mp4"
          videoCaptions={[
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
          ]}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

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
      const { container } = render(
        <HoverVideoPlayer
          videoSrc="fake/video-file.mp4"
          videoCaptions={false}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

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
      const { container } = render(
        <HoverVideoPlayer
          videoSrc="fake/video-file.mp4"
          videoCaptions={[
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
          ]}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

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

  describe('Handles video props correctly', () => {
    test('isVideoMuted prop correctly sets muted attribute on video', () => {
      const { container, rerender } = render(
        <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement, { muted: true });

      // Re-render with the video unmuted
      rerender(
        <HoverVideoPlayer
          videoSrc="fake/video-file.mp4"
          isVideoMuted={false}
        />
      );
      expectVideoHasCorrectAttributes(videoElement, { muted: false });
    });

    test('shouldShowVideoControls prop correctly sets controls attribute on video', () => {
      const { container, rerender } = render(
        <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement, { controls: false });

      // Re-render with controls enabled on the video
      rerender(
        <HoverVideoPlayer
          videoSrc="fake/video-file.mp4"
          shouldShowVideoControls
        />
      );
      expectVideoHasCorrectAttributes(videoElement, { controls: true });
    });

    test('shouldVideoLoop prop correctly sets loop attribute on video', () => {
      const { container, rerender } = render(
        <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement, { loop: true });

      // Re-render with looping disabled on the video
      rerender(
        <HoverVideoPlayer
          videoSrc="fake/video-file.mp4"
          shouldVideoLoop={false}
        />
      );
      expectVideoHasCorrectAttributes(videoElement, { loop: false });
    });

    test('videoPreload prop correctly sets preload attribute on video', () => {
      const { container, rerender } = render(
        <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement, { preload: 'metadata' });

      // Re-render with an updated video preload value
      rerender(
        <HoverVideoPlayer videoSrc="fake/video-file.mp4" videoPreload="auto" />
      );
      expectVideoHasCorrectAttributes(videoElement, { preload: 'auto' });
    });
  });

  describe('Goes through flow of starting and stopping the video correctly', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('mouseEnter event takes the video through its start flow correctly', async () => {
      const onStartingVideo = jest.fn();
      const onStartedVideo = jest.fn();

      const { container, getByTestId } = render(
        <HoverVideoPlayer
          videoSrc="fake/video-file.mp4"
          onStartingVideo={onStartingVideo}
          onStartedVideo={onStartedVideo}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const playPromise = Promise.resolve();

      videoElement.play = jest.fn(() => playPromise);

      // Mouse over the container to start playing the video
      fireEvent.mouseEnter(getByTestId('hover-video-player-container'));

      // The onStartingVideo callback should have been called
      expect(onStartingVideo).toHaveBeenCalled();
      // The video's play function should have been called
      expect(videoElement.play).toHaveBeenCalled();

      // onStartedVideo shouldn't be called since the play promise is still pending
      expect(onStartedVideo).not.toHaveBeenCalled();

      // Wait until the play promise has resolved
      await act(() => playPromise);

      expect(onStartedVideo).toHaveBeenCalled();
    });

    test('mouseLeave event takes the video through its stop flow correctly', async () => {
      const onStoppingVideo = jest.fn();
      const onStoppedVideo = jest.fn();

      const { container, getByTestId } = render(
        <HoverVideoPlayer
          videoSrc="fake/video-file.mp4"
          onStoppingVideo={onStoppingVideo}
          onStoppedVideo={onStoppedVideo}
          overlayFadeTransitionDuration={500}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const playPromise = Promise.resolve();

      videoElement.play = jest.fn(() => playPromise);
      videoElement.pause = jest.fn();

      const playerContainer = getByTestId('hover-video-player-container');

      // Mouse over the container to start playing the video
      fireEvent.mouseEnter(playerContainer);

      // Wait until the play promise has resolved
      await act(() => playPromise);

      // Mouse out of the container to stop playing the video
      fireEvent.mouseLeave(playerContainer);

      // onStoppingVideo callback should have been called
      expect(onStoppingVideo).toHaveBeenCalled();
      // onStoppedVideo callback and video.pause should not be called until the timeout has completed
      expect(onStoppedVideo).not.toHaveBeenCalled();
      expect(videoElement.pause).not.toHaveBeenCalled();

      // Advance by the fade transition duration to when the video will be stopped
      jest.advanceTimersByTime(500);

      // Stopping the video has to wait to make sure the play promise resolved
      await act(() => playPromise);

      expect(onStoppedVideo).toHaveBeenCalled();
      expect(videoElement.pause).toHaveBeenCalled();
    });

    test('loading state overlays are shown and hidden correctly as the video is started', async () => {
      const { container, getByTestId, queryByTestId } = render(
        <HoverVideoPlayer
          videoSrc="fake/video-file.mp4"
          loadingStateOverlay={<div data-testid="loading-state-overlay" />}
          overlayFadeTransitionDuration={500}
        />
      );

      expect(container).toMatchSnapshot();

      const videoElement = container.querySelector('video');
      expectVideoHasCorrectAttributes(videoElement);

      const playPromise = Promise.resolve();

      videoElement.play = jest.fn(() => playPromise);

      // The loading overlay should not be mounted while the player is idle
      expect(queryByTestId('loading-state-overlay')).not.toBeInTheDocument();

      // Mouse over the container to start playing the video
      fireEvent.mouseEnter(getByTestId('hover-video-player-container'));

      // We are in a loading state until the play promise is resolved so the loading overlay should now be mounted
      expect(queryByTestId('loading-state-overlay')).toBeInTheDocument();

      // Wait until the play promise has resolved
      await act(() => playPromise);

      // We have exited the loading state but the loading overlay will still be mounted as it fades out until 500ms have elapsed
      expect(queryByTestId('loading-state-overlay')).toBeInTheDocument();

      // Advance 500ms to the end of the loading overlay fade transition
      jest.advanceTimersByTime(500);

      // The loading overlay should now be unmounted
      expect(queryByTestId('loading-state-overlay')).not.toBeInTheDocument();
    });

    /**
     * TESTS THAT STILL NEED TO BE WRITTEN
     *
     * - mouseEnter interrupting mouseLeave
     * - pausedOverlay works correctly as player state changes
     * - shouldRestartOnVideoStopped
     * - mouseLeave in scenario where video.play() didn't return promise
     * - video.play() throws an error
     * - mouseEnter fired when video is already playing
     * - coverage for all touch event stuff once that is added
     * - isFocused prop
     */
  });
});
