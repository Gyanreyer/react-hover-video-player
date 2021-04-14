// Extend jest expect with additional functionality for testing-library and emotion before we run the tests
import '@testing-library/jest-dom/extend-expect';

import { fireEvent } from '@testing-library/react';

// Spy on console.error so we can ensure errors are only called when expected
jest.spyOn(console, 'error');

// Enumerates possible values that the video's readyState attribute can be in
const VIDEO_READY_STATES = {
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
};

// Enable writing to the video's read-only currentSrc, readyState, and paused properties
Object.defineProperty(window.HTMLVideoElement.prototype, 'currentSrc', {
  // Default value is empty string
  value: '',
  writable: true,
  configurable: true,
});
Object.defineProperty(window.HTMLVideoElement.prototype, 'readyState', {
  // Default value is HAVE_NOTHING
  value: VIDEO_READY_STATES.HAVE_NOTHING,
  writable: true,
  configurable: true,
});
Object.defineProperty(window.HTMLVideoElement.prototype, 'paused', {
  // Default value is true
  value: true,
  writable: true,
  configurable: true,
});

// Mocks the video's `readyState` going up over time as it loads more data
// The most important one for most tests is `HAVE_FUTURE_DATA`, which is when the
// `onCanPlay` event is fired and the video can start playing. When starting from `HAVE_NOTHING`,
// it should take 300ms to reach this `readyState`.
const mockLoadVideoElement = (videoElement) => {
  if (!videoElement.currentSrc) {
    const videoSources = videoElement.getElementsByTagName('source');
    // If we have sources, start loading the first one
    if (videoSources.length > 0) {
      // Fire an event indicating we are starting to load
      fireEvent.loadStart(videoElement);

      // Just assume we're using the first source
      videoElement.currentSrc = videoSources[0].src;
    }
  }

  if (videoElement.shouldPlaybackFail) {
    videoElement.readyState = VIDEO_READY_STATES.HAVE_NOTHING;

    fireEvent.error(videoElement);
  } else if (
    !videoElement.mockLoadTimeoutIds ||
    !videoElement.mockLoadTimeoutIds.length
  ) {
    // Only start mocking loading the video if we don't have any existing mock load timeouts already
    // that would indicate the video is already either in the process of loading or has already been loaded
    videoElement.mockLoadTimeoutIds = [];

    let timeoutDuration = 100;

    for (
      let i = videoElement.readyState + 1;
      i <= VIDEO_READY_STATES.HAVE_ENOUGH_DATA;
      i += 1
    ) {
      videoElement.mockLoadTimeoutIds.push(
        setTimeout(() => {
          videoElement.readyState = i;

          switch (i) {
            case VIDEO_READY_STATES.HAVE_METADATA:
              fireEvent.loadedMetadata(videoElement);
              break;
            case VIDEO_READY_STATES.HAVE_CURRENT_DATA:
              fireEvent.loadedData(videoElement);
              break;
            case VIDEO_READY_STATES.HAVE_FUTURE_DATA:
              fireEvent.canPlay(videoElement);
              break;
            case VIDEO_READY_STATES.HAVE_ENOUGH_DATA:
              fireEvent.canPlayThrough(videoElement);
              break;
            default:
          }
        }, timeoutDuration)
      );

      timeoutDuration += 100;
    }
  }
};

// Stub out the video element prototype's `load`, `play`, and `pause` functions for testing purposes
window.HTMLVideoElement.prototype.load = function load() {
  // Ensure we cancel loading timeouts from a previous load() call on this video
  if (this.mockLoadTimeoutIds) this.mockLoadTimeoutIds.forEach(clearTimeout);
  this.mockLoadTimeoutIds = [];

  // Set the video time to 0
  this.currentTime = 0;
  // Stop the video while we re-load it
  this.paused = true;

  // Fire an event indicating the video's data is being cleared and re-loaded
  fireEvent.emptied(this);

  const videoSources = this.getElementsByTagName('source');
  // If we have sources, start loading the first one
  if (videoSources.length > 0) {
    mockLoadVideoElement(this);
  }
  // If we don't have any sources, unload the video
  else {
    // Reset the currentSrc to an empty string ''
    this.currentSrc = '';
    // The ready state should be reset to indicate the video is unloaded
    this.readyState = VIDEO_READY_STATES.HAVE_NOTHING;
  }
};

window.HTMLVideoElement.prototype.play = function play() {
  if (this.paused) {
    // Set `paused` to false to indicate we're playing or attempting to play
    this.paused = false;

    // Fire an event indicating we are attempting to play the video
    fireEvent.play(this);

    if (this.readyState >= VIDEO_READY_STATES.HAVE_ENOUGH_DATA) {
      // If the video is already loaded enough to play immediately, fire an event
      // indicating it's now playing and return a resolved promise
      fireEvent.playing(this);
      return Promise.resolve();
    }
  } else if (this.readyState >= VIDEO_READY_STATES.HAVE_ENOUGH_DATA) {
    // If the video was already playing, don't do anything and just return a resolved promise
    return Promise.resolve();
  }

  // Return a promise which will resolve when the video starts playing or reject if something goes wrong
  const playPromise = new Promise((resolve, reject) => {
    let cleanupEventListeners;

    const onCanPlay = () => {
      // If the video has loaded enough to play, fire an event that we're playing and resolve the promise
      cleanupEventListeners();
      fireEvent.playing(this);
      resolve();
    };
    this.addEventListener('canplay', onCanPlay);

    const onError = () => {
      // Reject the promise if an error occurs
      cleanupEventListeners();
      reject();
    };
    this.addEventListener('error', onError);

    const onInterruptPlayAttempt = () => {
      // Reject the promise if it gets interrupted by a call to video.pause() or video.load()
      cleanupEventListeners();
      // Log an error to make our test fail
      console.error('INTERRUPTED PLAY ATTEMPT');
      reject();
    };
    this.addEventListener('pause', onInterruptPlayAttempt);
    this.addEventListener('emptied', onInterruptPlayAttempt);

    cleanupEventListeners = () => {
      this.removeEventListener('canplay', onCanPlay);
      this.removeEventListener('error', onError);
      this.removeEventListener('pause', onInterruptPlayAttempt);
      this.removeEventListener('emptied', onInterruptPlayAttempt);
    };
  }).catch(() => {
    // If the play attempt rejects, pause the video again
    this.pause();
  });
  // If we don't have enough data loaded yet, start loading
  mockLoadVideoElement(this);
  return playPromise;
};

window.HTMLVideoElement.prototype.pause = function pause() {
  if (!this.paused) {
    // Update that the video is paused
    this.paused = true;
    // Fire an event indicating that the video was paused
    fireEvent.pause(this);
  }
};

const VIDEO_STATE = {
  paused: 'paused',
  loading: 'loading',
  playing: 'playing',
};

/**
 * @function getVideoState
 *
 * Takes a video element and returns its current playing state
 *
 * @param {node} videoElement
 */
function getVideoState(videoElement) {
  if (videoElement.paused || videoElement.ended) {
    return VIDEO_STATE.paused;
  }

  // If the video isn't paused but its readyState indicates it isn't loaded enough
  // to play yet, it is loading
  if (videoElement.readyState < VIDEO_READY_STATES.HAVE_FUTURE_DATA) {
    return VIDEO_STATE.loading;
  }

  // If the video isn't paused and its ready state indicates it's loaded enough to play,
  // assume it's playing
  return VIDEO_STATE.playing;
}

// Extend expect with some custom checks for the video's state
expect.extend({
  toBePaused(videoElement) {
    if (videoElement.tagName !== 'VIDEO') {
      return {
        // If we didn't receive a video element this should fail regardless of whether
        // it was negated or not
        pass: this.isNot,
        message: () => `Expected ${videoElement} to be a video element`,
      };
    }

    const videoState = getVideoState(videoElement);

    if (videoState === VIDEO_STATE.paused) {
      return {
        pass: true,
        message: () =>
          `Expected video state "${videoState} to not be ${VIDEO_STATE.paused}`,
      };
    }

    return {
      pass: false,
      message: () =>
        `Expected video state "${videoState}" to be ${VIDEO_STATE.paused}`,
    };
  },
  toBeLoading(videoElement) {
    if (videoElement.tagName !== 'VIDEO') {
      return {
        // If we didn't receive a video element this should fail regardless of whether
        // it was negated or not
        pass: this.isNot,
        message: () => `Expected ${videoElement} to be a video element`,
      };
    }

    const videoState = getVideoState(videoElement);

    if (videoState === VIDEO_STATE.loading) {
      return {
        pass: true,
        message: () =>
          `Expected video state "${videoState} to not be ${VIDEO_STATE.loading}`,
      };
    }

    return {
      pass: false,
      message: () =>
        `Expected video state "${videoState}" to be ${VIDEO_STATE.loading}`,
    };
  },
  toBePlaying(videoElement) {
    if (videoElement.tagName !== 'VIDEO') {
      return {
        // If we didn't receive a video element this should fail regardless of whether
        // it was negated or not
        pass: this.isNot,
        message: () => `Expected ${videoElement} to be a video element`,
      };
    }

    const videoState = getVideoState(videoElement);

    if (videoState === VIDEO_STATE.playing) {
      return {
        pass: true,
        message: () =>
          `Expected video state "${videoState} to not be ${VIDEO_STATE.playing}`,
      };
    }

    return {
      pass: false,
      message: () =>
        `Expected video state "${videoState}" to be ${VIDEO_STATE.playing}`,
    };
  },
});
