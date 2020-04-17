import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { getVideoState, VIDEO_STATE } from '../src/utils/video';
import HoverVideoPlayer from '../src';

/**
 * Ensures the video element has all of the correct attributes set
 *
 * @param {node}    videoElement
 * @param {object}  expectedValues    Object with expected attribute values to test for
 */
const expectVideoHasCorrectAttributes = (
  videoElement,
  { muted = true, loop = true, controls = false, preload = 'metadata' } = {}
) => {
  expect(videoElement).not.toBeNull();

  if (muted) {
    expect(videoElement.muted).toBe(true);
  } else {
    expect(videoElement.muted).toBe(false);
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

/**
 * Takes the currently rendered video element and applies a bunch of mocks to it to simulate its normal functionality
 */
const addMockedFunctionsToVideoElement = ({
  shouldPlaybackFail = false,
  shouldReturnPromise = true,
} = {}) => {
  const videoElement = document.querySelector('video');

  const videoElementPausedSpy = jest
    .spyOn(videoElement, 'paused', 'get')
    .mockReturnValue(true);

  const videoElementReadyStateSpy = jest
    .spyOn(videoElement, 'readyState', 'get')
    .mockReturnValue(videoElement.preload === 'none' ? 0 : 2);

  jest
    .spyOn(videoElement, 'currentSrc', 'get')
    .mockReturnValue(videoElement.querySelector('source').src);

  let isPlayAttemptInProgress = false;

  videoElement.play = jest.fn(() => {
    const wasPausedWhenTriedToPlay = videoElement.paused;

    if (wasPausedWhenTriedToPlay) {
      isPlayAttemptInProgress = true;
      videoElementPausedSpy.mockReturnValue(false);
    }

    if (shouldReturnPromise) {
      if (shouldPlaybackFail) {
        return new Promise((resolve, reject) => {
          isPlayAttemptInProgress = false;

          // eslint-disable-next-line prefer-promise-reject-errors
          reject('The video broke');
        });
      }

      return Promise.resolve().then(() => {
        isPlayAttemptInProgress = false;
        videoElement.currentTime = 10;
        videoElementReadyStateSpy.mockReturnValue(3);

        if (wasPausedWhenTriedToPlay) {
          fireEvent.playing(videoElement);
        }
      });
    }

    setTimeout(() => {
      isPlayAttemptInProgress = false;

      if (shouldPlaybackFail) {
        fireEvent.error(videoElement, { error: 'The video broke' });
      } else {
        videoElement.currentTime = 10;
        videoElementReadyStateSpy.mockReturnValue(3);
        fireEvent.playing(videoElement);
      }
    }, 400);

    return undefined;
  });
  videoElement.pause = jest.fn(() => {
    if (isPlayAttemptInProgress) {
      // Throw an error if pause() is called while an async play() promise
      // has not been resolved yet
      throw new Error('Interrupted play attempt');
    }

    if (!videoElement.paused) {
      videoElementPausedSpy.mockReturnValue(true);
      fireEvent.pause(videoElement);
    }
  });
};

/**
 * Takes a video element and waits for its latest play() promise to resolve before continuing
 *
 * @param {node} videoElement
 */
const waitForVideoElementPlayPromise = async (
  videoElement = document.querySelector('video')
) => {
  return act(() => videoElement.play.mock.results.slice(-1)[0].value);
};

const expectVideoState = (expectedState) => {
  const videoElement = document.querySelector('video');

  expect(getVideoState(videoElement)).toEqual(expectedState);
};

const expectVideoIsPaused = () => expectVideoState(VIDEO_STATE.paused);
const expectVideoIsLoading = () => expectVideoState(VIDEO_STATE.loading);
const expectVideoIsPlaying = () => expectVideoState(VIDEO_STATE.playing);

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
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" isVideoMuted={false} />
    );
    expectVideoHasCorrectAttributes(videoElement, { muted: false });
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
});

describe('videoSrc prop', () => {
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
});

describe('videoCaptions prop', () => {
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
});

describe('Handles desktop mouse events correctly', () => {
  let playerContainer;
  let videoElement;

  beforeEach(() => {
    jest.useFakeTimers();

    const { container, getByTestId } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement();

    playerContainer = getByTestId('hover-video-player-container');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('mouseEnter event takes the video through its start flow correctly', async () => {
    // The video should initially be paused
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expectVideoIsPaused();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The video should have a play attempt in progress
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise();

    expectVideoIsPlaying();
  });

  test('mouseLeave event takes the video through its stop flow correctly', async () => {
    // The video should initially be paused
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expectVideoIsPaused();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise();

    expectVideoIsPlaying();

    // Mouse out of the container to stop playing the video
    fireEvent.mouseLeave(playerContainer);

    // The video should not be paused until the timeout has completed
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Advance a sufficient amount of time for the pause timeout to have completed
    act(() => jest.advanceTimersByTime(500));

    // The video should have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expectVideoIsPaused();
  });
});

describe('Handles mobile touch events correctly', () => {
  let playerContainer;
  let videoElement;

  beforeEach(() => {
    jest.useFakeTimers();

    const { container, getByTestId } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement();

    playerContainer = getByTestId('hover-video-player-container');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('touchStart event takes the video through its start flow correctly', async () => {
    // The video should initially be paused
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expectVideoIsPaused();

    // Mouse over the container to start playing the video
    fireEvent.touchStart(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    await waitForVideoElementPlayPromise();

    expectVideoIsPlaying();
  });

  test('touchStart events outside of the video takes it through its stop flow correctly', async () => {
    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expectVideoIsPaused();

    // Touch the container to start playing the video
    fireEvent.touchStart(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    await waitForVideoElementPlayPromise();

    expectVideoIsPlaying();

    // Touching an element inside of the player container should not start a stop attempt
    fireEvent.touchStart(videoElement);

    // Wait to sufficiently prove a stop attempt was not started
    jest.advanceTimersByTime(500);
    await waitForVideoElementPlayPromise();

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();

    // Touching outside of the player container should start a stop attempt
    fireEvent.touchStart(document.body);

    // Pause shouldn't have been called yet until the pause timeout completes
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Advance a sufficient amount of time for the pause timeout to have completed
    jest.advanceTimersByTime(500);

    // The video should have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expectVideoIsPaused();
  });
});

describe('Follows video interaction flows correctly', () => {
  let playerContainer;
  let videoElement;
  let pausedOverlayWrapper;
  let loadingOverlayWrapper;

  beforeEach(() => {
    jest.useFakeTimers();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        pausedOverlay={<div />}
        loadingOverlay={<div />}
      />
    );

    expect(container).toMatchSnapshot();

    videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement, { preload: 'none' });

    addMockedFunctionsToVideoElement();

    playerContainer = getByTestId('hover-video-player-container');
    pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    loadingOverlayWrapper = getByTestId('loading-overlay-wrapper');

    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expectVideoIsPaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('an attempt to start the video will correctly interrupt any attempts to stop it', async () => {
    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    await waitForVideoElementPlayPromise();

    expectVideoIsPlaying();
    // THe paused overlay should be hidden
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // We are now in playing state, so mouse out to stop again
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();
    // The paused overlay should be fading back in
    expect(pausedOverlayWrapper.style.opacity).toBe('1');

    // Mouse back over to cancel the stop attempt and start a play attempt
    fireEvent.mouseEnter(playerContainer);

    // Play should not have been called a second time since we're already playing
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsPlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');

    // Wait sufficiently to prove the stop attempt was cancelled
    act(() => jest.advanceTimersByTime(500));

    // The video shouldn't have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
  });

  test('the video will be paused immediately when its play attempt completes after we have already stopped', async () => {
    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance timers so the loading state should be visible
    act(() => jest.advanceTimersByTime(500));

    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Fire a mouseLeave event to kick off a stop attempt before the play promise has resolved
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance the timers by a sufficient amount of time for the pause timeout to complete
    act(() => jest.advanceTimersByTime(500));

    // The player should have been moved into the paused state but technically the video is not paused because we're waiting for the play promise to resolve
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise();

    // We should have immediately paused after the promise resolved
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expectVideoIsPaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
  });

  test('an attempt to start the video when it is already playing will be ignored', async () => {
    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The play attempt should have started
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise();

    expectVideoIsPlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // A second mouseEnter event should effectively be ignored
    fireEvent.mouseEnter(playerContainer);

    expectVideoIsPlaying();

    await waitForVideoElementPlayPromise();

    // We should not have run through the play attempt flow again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsPlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('an attempt to start the video when a previous play attempt is still loading will show the loading state again', async () => {
    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Stop the video while it's still loading in the background
    fireEvent.mouseLeave(playerContainer);

    // Allow the stop attempt to succeed
    jest.advanceTimersByTime(500);

    // The video shouldn't have been paused since the initial play attempt is still in progress
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    fireEvent.mouseEnter(playerContainer);
    // We shouldn't havec called play a second time but the onStartingVideo callback should've fired again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    act(() => jest.advanceTimersByTime(500));

    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise();

    // The start attempt should have succeeded
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsPlaying();
    expect(pausedOverlayWrapper.style.opacity).toBe('0');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('an attempt to stop the video when it is already stopped will be ignored', () => {
    // Mouse out of the container even though it was never started properly
    fireEvent.mouseLeave(playerContainer);

    // Advance timers sufficiently so that a stop attempt could complete if it was incorrectly started
    jest.advanceTimersByTime(500);

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('handles a video playback error correectly', async () => {
    // Mock the console.error function so we can verify that an error was logged correctly
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Re-add the mocked functions for the video element so that the play promise will reject
    addMockedFunctionsToVideoElement({
      shouldPlaybackFail: true,
    });

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    let errorMessage = null;
    try {
      await waitForVideoElementPlayPromise();
    } catch (error) {
      errorMessage = error;
    }
    // The promise should've rejected
    expect(errorMessage).toBe('The video broke');

    // The video should have been paused after the play attempt failed
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expectVideoIsPaused();

    // The error should have been logged correctly
    expect(console.error).toHaveBeenCalledWith(
      `HoverVideoPlayer playback failed for src ${videoElement.currentSrc}: The video broke`
    );

    // Restore the console.error function
    console.error = originalConsoleError;
  });

  test("handles start flow correctly for browsers that don't return a Promise from video.play()", async () => {
    // Re-add the mocked functions for the video element so that play() will not return a promise
    addMockedFunctionsToVideoElement({
      shouldReturnPromise: false,
    });

    expectVideoIsPaused();
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();
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
    expectVideoIsPlaying();
  });

  test("handles playback errors correctly for browsers that don't return a Promise from video.play()", async () => {
    // Mock the console.error function so we can verify that an error was logged correctly
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Re-add the mocked functions for the video element so that play() will not return a promise and will throw an error
    addMockedFunctionsToVideoElement({
      shouldPlaybackFail: true,
      shouldReturnPromise: false,
    });

    expectVideoIsPaused();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    jest.advanceTimersByTime(400);
    // Flush out the promise since it should have been rejected after the timeout completed
    await act(() => new Promise(setImmediate));

    // The video should be paused again
    expectVideoIsPaused();

    // The error should have been logged correctly
    expect(console.error).toHaveBeenCalledWith(
      `HoverVideoPlayer playback failed for src ${videoElement.currentSrc}: undefined`
    );

    console.error = originalConsoleError;
  });
});

describe('Prop combinations that change behavior/appearance work correctly', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shouldRestartOnVideoStopped prop restarts the video when set to true', async () => {
    // shouldRestartOnVideoStopped is true by default
    const { container, getByTestId } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement();

    const playerContainer = getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expectVideoIsPaused();

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);
    expectVideoIsLoading();

    await waitForVideoElementPlayPromise();

    // The video's time should now be greater than 0 because it's playing
    expect(videoElement.currentTime).toBeGreaterThan(0);
    expectVideoIsPlaying();

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    expect(videoElement.currentTime).toBeGreaterThan(0);

    // Advance a sufficient amount of time for the stop attempt to complete
    act(() => jest.advanceTimersByTime(500));

    // The video time should have been paused and reset
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expectVideoIsPaused();
  });

  test('shouldRestartOnVideoStopped prop does not restart the video when set to false', async () => {
    // shouldRestartOnVideoStopped is true by default
    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        shouldRestartOnVideoStopped={false}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement();

    const playerContainer = getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expectVideoIsPaused();

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);
    expectVideoIsLoading();

    await waitForVideoElementPlayPromise();

    // The video's time should now be greater than 0 because it's playing
    expect(videoElement.currentTime).toBeGreaterThan(0);
    expectVideoIsPlaying();

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    // Advance a sufficient amount of time for the stop attempt to complete
    act(() => jest.advanceTimersByTime(500));

    // The video time should not have been reset to 0
    expect(videoElement.currentTime).toBeGreaterThan(0);
    expectVideoIsPaused();
  });

  test('pausedOverlay and loadingOverlay are shown and hidden correctly as the video is started and stopped', async () => {
    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        pausedOverlay={<div />}
        loadingOverlay={<div />}
        overlayFadeTransitionDuration={500}
        loadingStateTimeoutDuration={500}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement, { preload: 'none' });

    addMockedFunctionsToVideoElement();

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
    await waitForVideoElementPlayPromise();

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
    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        loadingOverlay={<div />}
        loadingStateTimeoutDuration={500}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement();

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
    await waitForVideoElementPlayPromise();

    // The loading overlay should stil be hidden
    expect(loadingOverlayWrapper.style.opacity).toBe('0');

    // Advance the timer sufficiently to prove the loading state timeout was cancelled
    act(() => jest.advanceTimersByTime(500));

    // The loading overlay should still be hidden
    expect(loadingOverlayWrapper.style.opacity).toBe('0');
  });

  test('isFocused prop starts and stops the video correctly', async () => {
    const { container, rerender } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement();

    expect(videoElement.play).toHaveBeenCalledTimes(0);
    expectVideoIsPaused();

    // Set isFocused to true to start playing the video
    rerender(<HoverVideoPlayer videoSrc="fake/video-file.mp4" isFocused />);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    await waitForVideoElementPlayPromise();

    expectVideoIsPlaying();

    // Set isFocused back to false to stop playing
    rerender(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" isFocused={false} />
    );

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();

    // Advance timers by sufficient amount of time to complete the stop attempt
    act(() => jest.advanceTimersByTime(500));

    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expectVideoIsPaused();
  });

  test('other events which would normally stop the video are ignored if isFocused prop is true', async () => {
    const { container, getByTestId, rerender } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement();

    const playerContainer = getByTestId('hover-video-player-container');

    expectVideoIsPaused();

    // Re-render with isFocused set to true to start playing
    rerender(<HoverVideoPlayer videoSrc="fake/video-file.mp4" isFocused />);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    await waitForVideoElementPlayPromise();

    expectVideoIsPlaying();

    fireEvent.mouseEnter(playerContainer);

    // Play shouldn't have been called again since we're already playing
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsPlaying();

    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Fire some events that would normally pause the video
    fireEvent.mouseLeave(playerContainer);
    act(() => jest.advanceTimersByTime(500));

    // The video still shouldn't have been paused
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();

    fireEvent.touchStart(document.body);
    act(() => jest.advanceTimersByTime(500));

    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();
  });

  test('Stop attempts take the amount of time set by overlayFadeTransitionDuration prop if a pausedOverlay is provided', async () => {
    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        pausedOverlay={<div />}
        overlayFadeTransitionDuration={900}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement, { preload: 'none' });

    addMockedFunctionsToVideoElement();

    const playerContainer = getByTestId('hover-video-player-container');

    expectVideoIsPaused();

    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expectVideoIsLoading();

    await waitForVideoElementPlayPromise();
    expectVideoIsPlaying();
    fireEvent.mouseLeave(playerContainer);

    // A stop attempt should be in progress but not completed yet
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();

    // Advance timer just up to before the pause timeout should complete
    jest.advanceTimersByTime(899);

    // The pause timeout should still be in progress since we're just 1ms short of the transition duration
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();

    act(() => jest.advanceTimersByTime(1));

    // The stop attempt should be completed now that the full fade duration is complete
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expectVideoIsPaused();
  });

  test('Stop attempts stop immediately if a pausedOverlay is not provided', async () => {
    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        overlayFadeTransitionDuration={900}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement();

    const playerContainer = getByTestId('hover-video-player-container');

    expectVideoIsPaused();
    fireEvent.mouseEnter(playerContainer);
    expectVideoIsLoading();
    await waitForVideoElementPlayPromise();
    expectVideoIsPlaying();

    fireEvent.mouseLeave(playerContainer);

    // A stop attempt should be in progress but not completed yet
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
    expectVideoIsPlaying();

    // Just update the timers - the pause timeout should have a timeout of 0ms and will fire
    act(() => jest.advanceTimersByTime(0));

    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expectVideoIsPaused();
  });

  test('shouldUseOverlayDimensions prop applies the correct styling when set to true alongside a paused overlay', () => {
    // shouldUseOverlayDimensions is true by default
    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        pausedOverlay={<div />}
      />
    );

    expect(container).toMatchSnapshot();

    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const videoElement = container.querySelector('video');

    expect(pausedOverlayWrapper).toHaveStyleRule('position', 'relative');
    expect(videoElement).toHaveStyleRule('position', 'absolute');
  });

  test('shouldUseOverlayDimensions prop applies the correct styling when set to false alongside a paused overlay', () => {
    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        pausedOverlay={<div />}
        shouldUseOverlayDimensions={false}
      />
    );

    expect(container).toMatchSnapshot();

    const pausedOverlayWrapper = getByTestId('paused-overlay-wrapper');
    const videoElement = container.querySelector('video');

    expect(pausedOverlayWrapper).toHaveStyleRule('position', 'absolute');
    // The video element shouldn't have a position style rule set
    expect(videoElement).not.toHaveStyleRule('position', 'absolute');
  });

  test('video element gets styled correctly when no paused overlay is provided', () => {
    const { container, queryByTestId } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    const pausedOverlayWrapper = queryByTestId('paused-overlay-wrapper');
    const videoElement = container.querySelector('video');

    expect(pausedOverlayWrapper).not.toBeInTheDocument();
    // The video element shouldn't have a position style rule set
    expect(videoElement).not.toHaveStyleRule('position');
  });
});
