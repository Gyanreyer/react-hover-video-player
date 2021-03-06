// Extend jest expect with additional functionality for testing-library and emotion before we run the tests
import '@testing-library/jest-dom/extend-expect';

import { getVideoState } from '../src/utils';
import { VIDEO_STATE } from '../src/constants';

// Extend expect with some custom checks for the video's state
expect.extend({
  toBePaused(videoElement) {
    if (videoElement.tagName !== 'VIDEO') {
      return {
        pass: false,
        message: `Expected ${videoElement} to be a video element`,
      };
    }

    const videoState = getVideoState(videoElement);

    if (videoState === VIDEO_STATE.paused) {
      return {
        pass: true,
        message: `Expected video state "${videoState} to not be ${VIDEO_STATE.paused}`,
      };
    }

    return {
      pass: false,
      message: `Expected video state "${videoState}" to be ${VIDEO_STATE.paused}`,
    };
  },
  toBeLoading(videoElement) {
    if (videoElement.tagName !== 'VIDEO') {
      return {
        pass: false,
        message: `Expected ${videoElement} to be a video element`,
      };
    }

    const videoState = getVideoState(videoElement);

    if (videoState === VIDEO_STATE.loading) {
      return {
        pass: true,
        message: `Expected video state "${videoState} to not be ${VIDEO_STATE.loading}`,
      };
    }

    return {
      pass: false,
      message: `Expected video state "${videoState}" to be ${VIDEO_STATE.loading}`,
    };
  },
  toBePlaying(videoElement) {
    if (videoElement.tagName !== 'VIDEO') {
      return {
        pass: false,
        message: `Expected ${videoElement} to be a video element`,
      };
    }

    const videoState = getVideoState(videoElement);

    if (videoState === VIDEO_STATE.playing) {
      return {
        pass: true,
        message: `Expected video state "${videoState} to not be ${VIDEO_STATE.playing}`,
      };
    }

    return {
      pass: false,
      message: `Expected video state "${videoState}" to be ${VIDEO_STATE.playing}`,
    };
  },
});
