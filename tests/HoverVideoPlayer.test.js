import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

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
 * Takes a video element, applies a bunch of mocks to it to simulate its normal functionality, and returns a the
 * video's play() promise
 *
 * @param {node} videoElement
 * @returns {Promise} Promise returned by videoElement.play() which we can await to simulate the action being async
 */
const addMockedFunctionsToVideoElement = (videoElement) => {
  const videoElementPausedSpy = jest
    .spyOn(videoElement, 'paused', 'get')
    .mockReturnValue(true);
  const videoElementReadyStateSpy = jest
    .spyOn(videoElement, 'readyState', 'get')
    .mockReturnValue(1);

  let isPlayAttemptInProgress = false;

  videoElement.play = jest.fn(() => {
    if (videoElement.paused) {
      isPlayAttemptInProgress = true;
      videoElementPausedSpy.mockReturnValue(false);
    }

    return Promise.resolve().then(() => {
      isPlayAttemptInProgress = false;
      videoElementReadyStateSpy.mockReturnValue(3);
      videoElement.currentTime = 10;
      fireEvent.playing(videoElement);
    });
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
const waitForVideoElementPlayPromise = async (videoElement) =>
  act(() => videoElement.play.mock.results.slice(-1)[0].value);

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

    addMockedFunctionsToVideoElement(videoElement);

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(getByTestId('hover-video-player-container'));

    // The onStartingVideo callback should have been called
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    // The video's play function should have been called
    expect(videoElement.play).toHaveBeenCalledTimes(1);

    // onStartedVideo shouldn't be called since the play promise is still pending
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    expect(onStartedVideo).toHaveBeenCalledTimes(1);
  });

  test('mouseLeave event takes the video through its stop flow correctly', async () => {
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The play function should have been called
    expect(videoElement.play).toHaveBeenCalledTimes(1);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    // Mouse out of the container to stop playing the video
    fireEvent.mouseLeave(playerContainer);

    // onStoppingVideo callback should have been called
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    // onStoppedVideo callback and video.pause should not be called until the timeout has completed
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Advance a sufficient amount of time for the pause timeout to have completed
    act(() => jest.advanceTimersByTime(500));

    expect(onStoppedVideo).toHaveBeenCalledTimes(1);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
  });
});

describe('Handles mobile touch events correctly', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('touchStart event takes the video through its start flow correctly', async () => {
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

    addMockedFunctionsToVideoElement(videoElement);

    // Mouse over the container to start playing the video
    fireEvent.touchStart(getByTestId('hover-video-player-container'));

    // The onStartingVideo callback should have been called
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    // The video's play function should have been called
    expect(videoElement.play).toHaveBeenCalledTimes(1);

    // onStartedVideo shouldn't be called since the play promise is still pending
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    expect(onStartedVideo).toHaveBeenCalledTimes(1);
  });

  test('touchStart events outside of the video takes it through its stop flow correctly', async () => {
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Touch the container to start playing the video
    fireEvent.touchStart(playerContainer);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    // Touching an element inside of the player container should not start a stop attempt
    fireEvent.touchStart(videoElement);

    expect(onStoppingVideo).toHaveBeenCalledTimes(0);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);

    // Touching outside of the player container should start a stop attempt
    fireEvent.touchStart(document.body);

    // onStoppingVideo callback should have been called
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    // onStoppedVideo callback and video.pause should not be called until the timeout has completed
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Advance a sufficient amount of time for the pause timeout to have completed
    act(() => jest.advanceTimersByTime(500));

    expect(onStoppedVideo).toHaveBeenCalledTimes(1);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
  });
});

describe('Follows video interaction flows correctly', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('an attempt to start the video will correctly interrupt any attempts to stop it', async () => {
    const onStartingVideo = jest.fn();
    const onStartedVideo = jest.fn();
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    // We are now in playing state, so mouse out to stop again
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Mouse back over to cancel the stop attempt and start a play attempt
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);

    await waitForVideoElementPlayPromise(videoElement);

    // We shouldn't have needed to start a second start attempt since we prevented the stop attempt
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(500));

    // onStoppedVideo should still not have been called because it was cancelled
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
  });

  test('the video will be paused if its play attempt completes while we are in a stopping state', async () => {
    const onStartingVideo = jest.fn();
    const onStartedVideo = jest.fn();
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // Fire a mouseLeave event to kick off a stop attempt before the play promise has resolved
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    // onStartedVideo shouldn't have been called because it was cancelled
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // The stop attempt should not have completed yet because it's still in progress
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    act(() => jest.advanceTimersByTime(500));

    // onStoppedVideo should have been called after the promise resolved and the video's `onPlaying` event fired
    expect(onStoppedVideo).toHaveBeenCalledTimes(1);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
  });

  test('the video will be paused immediately if its play attempt completes while we are in a stopped state', async () => {
    const onStartingVideo = jest.fn();
    const onStartedVideo = jest.fn();
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // Fire a mouseLeave event to kick off a stop attempt before the play promise has resolved
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Advance the timers by a sufficient amount of time for a stop attempt timeout to complete
    act(() => jest.advanceTimersByTime(500));

    // The video should have been moved into the stopped state but technically not been paused because we're waiting for the play promise to resolve
    expect(onStoppedVideo).toHaveBeenCalledTimes(1);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    // onStartedVideo shouldn't have been called because it was cancelled
    expect(onStartedVideo).toHaveBeenCalledTimes(0);
    // We should have called pause after the play attempt completed
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
  });

  test('an attempt to start the video when it is already playing will be ignored', async () => {
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

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The play attempt should have started
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    // The play attempt should have succeeded
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    // A second mouseEnter event should effectively be ignored
    fireEvent.mouseEnter(playerContainer);

    await waitForVideoElementPlayPromise(videoElement);

    // We should not have run through the play attempt flow again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(1);
  });

  test('an attempt to start the video when a previous play attempt is still loading will show the loading state again', async () => {
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

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(1);

    // Stop the video while it's still loading in the background
    fireEvent.mouseLeave(playerContainer);
    act(() => jest.advanceTimersByTime(500));

    // The video shouldn't have been paused since the initial play attempt is still in progress
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    fireEvent.mouseEnter(playerContainer);
    // We shouldn't havec called play a second time but the onStartingVideo callback should've fired again
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(2);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

    // The start attempt should have succeeded
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(2);
    expect(onStartedVideo).toHaveBeenCalledTimes(1);
  });

  test('an attempt to stop the video when it is already stopped will be ignored', () => {
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse out of the container even though it was never started properly
    fireEvent.mouseLeave(playerContainer);

    // Advance timers sufficiently so that a stop attempt could complete if it was incorrectly started
    jest.advanceTimersByTime(500);

    expect(onStoppingVideo).toHaveBeenCalledTimes(0);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
  });

  test('handles a video playback error correectly', async () => {
    const onStartingVideo = jest.fn();
    const onStartedVideo = jest.fn();
    const onVideoPlaybackFailed = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onVideoPlaybackFailed={onVideoPlaybackFailed}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    // Make the mocked play function fire an error
    const playPromise = new Promise(() => {
      throw new Error('The video broke');
    }).catch(() => fireEvent.error(videoElement));

    videoElement.play = jest.fn(() => playPromise);

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(getByTestId('hover-video-player-container'));

    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(videoElement.play).toHaveBeenCalledTimes(1);

    // Wait for the play promise to resolve and throw an error
    await act(() => playPromise);

    expect(onVideoPlaybackFailed).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);
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

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);

    await waitForVideoElementPlayPromise(videoElement);

    // The video's time should now be greater than 0 because it's playing
    expect(videoElement.currentTime).toBeGreaterThan(0);

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    expect(videoElement.currentTime).toBeGreaterThan(0);

    // Advance a sufficient amount of time for the stop attempt to complete
    act(() => jest.advanceTimersByTime(500));

    // The video time should have been reset after the stop attempt completed
    expect(videoElement.currentTime).toBe(0);
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

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);

    await waitForVideoElementPlayPromise(videoElement);

    // The video's time should now be greater than 0 because it's playing
    expect(videoElement.currentTime).toBeGreaterThan(0);

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    expect(videoElement.currentTime).toBeGreaterThan(0);

    // Advance a sufficient amount of time for the stop attempt to complete
    act(() => jest.advanceTimersByTime(500));

    // The video time should not have been reset to 0
    expect(videoElement.currentTime).toBeGreaterThan(0);
  });

  test('pausedOverlay and loadingOverlay are shown and hidden correctly as the video is started and stopped', async () => {
    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        pausedOverlay={<div />}
        loadingOverlay={<div />}
        overlayFadeTransitionDuration={500}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement, { preload: 'none' });

    addMockedFunctionsToVideoElement(videoElement);

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

    // The paused overlay should still be visible under the loading overlay
    expect(pausedOverlayWrapper.style.opacity).toBe('1');
    // We are in a loading state until the play promise is resolved so the loading overlay should now be visible
    expect(loadingOverlayWrapper.style.opacity).toBe('1');

    // Wait until the play promise has resolved
    await waitForVideoElementPlayPromise(videoElement);

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

  test('isFocused prop starts and stops the video correctly', async () => {
    const onStartingVideo = jest.fn();
    const onStartedVideo = jest.fn();
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, rerender } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    expect(onStartingVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.play).toHaveBeenCalledTimes(0);

    // Set isFocused to true to start playing the video
    rerender(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
        isFocused
      />
    );

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    await waitForVideoElementPlayPromise(videoElement);

    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    // Set isFocused back to false to stop playing
    rerender(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
        isFocused={false}
      />
    );

    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Advance timers by sufficient amount of time to complete the stop attempt
    act(() => jest.advanceTimersByTime(500));

    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(1);
  });

  test('other events which would normally stop the video are ignored if isFocused prop is true', async () => {
    const onStartingVideo = jest.fn();
    const onStartedVideo = jest.fn();
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId, rerender } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Re-render with isFocused set to true to start playing
    rerender(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStartingVideo={onStartingVideo}
        onStartedVideo={onStartedVideo}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
        isFocused
      />
    );

    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    await waitForVideoElementPlayPromise(videoElement);

    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    fireEvent.mouseEnter(playerContainer);

    // onStartingVideo shouldn't have been called since it's already playing from isFocused
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(videoElement.play).toHaveBeenCalledTimes(1);

    await waitForVideoElementPlayPromise(videoElement);

    // onStartedVideo shouldn't have been called since it's already playing from isFocused
    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(playerContainer);

    // Advance time sufficiently for a stop attempt to have completed
    act(() => jest.advanceTimersByTime(500));

    fireEvent.touchStart(document.body);

    act(() => jest.advanceTimersByTime(500));

    // A stop attempt should not have happened since isFocused is true
    expect(onStoppingVideo).toHaveBeenCalledTimes(0);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);
  });

  test('Stop attempts take the amount of time set by overlayFadeTransitionDuration prop if a pausedOverlay is provided', async () => {
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        pausedOverlay={<div />}
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
        overlayFadeTransitionDuration={900}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement, { preload: 'none' });

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.play).toHaveBeenCalledTimes(1);

    await waitForVideoElementPlayPromise(videoElement);
    fireEvent.mouseLeave(playerContainer);

    // A stop attempt should be in progress but not completed yet
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Advance timer just up to before the stop attempt timeout should complete
    jest.advanceTimersByTime(899);

    // The stop attempt should still be in progress since we're just 1ms short of the transition duration
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    act(() => jest.advanceTimersByTime(1));

    // The stop attempt should be completed now that the full fade duration is complete
    expect(onStoppedVideo).toHaveBeenCalledTimes(1);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
  });

  test('Stop attempts stop immediately if a pausedOverlay is not provided', async () => {
    const onStoppingVideo = jest.fn();
    const onStoppedVideo = jest.fn();

    const { container, getByTestId } = render(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        onStoppingVideo={onStoppingVideo}
        onStoppedVideo={onStoppedVideo}
        overlayFadeTransitionDuration={900}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    fireEvent.mouseEnter(playerContainer);
    await waitForVideoElementPlayPromise(videoElement);
    fireEvent.mouseLeave(playerContainer);

    // A stop attempt should be in progress but not completed yet
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.pause).toHaveBeenCalledTimes(0);

    // Just update the timers - the stop attempt timeout should have a timeout of 0ms and will fire
    act(() => jest.advanceTimersByTime(0));

    expect(onStoppedVideo).toHaveBeenCalledTimes(1);
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
  });
});

/**
 * TESTS THAT STILL NEED TO BE WRITTEN
 *
 * - shouldVideoExpandToFitOverlayDimensions
 * - Add checks to make sure play and pause have been called
 */
