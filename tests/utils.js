import { fireEvent } from '@testing-library/react';

// Ensures the video element has all of the correct attributes set
export const expectVideoHasCorrectAttributes = (
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
export const addMockedFunctionsToVideoElement = (videoElement) => {
  const playPromise = Promise.resolve();

  const videoElementPausedSpy = jest
    .spyOn(videoElement, 'paused', 'get')
    .mockReturnValue(true);
  const videoElementReadyStateSpy = jest
    .spyOn(videoElement, 'readyState', 'get')
    .mockReturnValue(1);

  // eslint-disable-next-line no-param-reassign
  videoElement.play = jest.fn(() => {
    if (videoElement.paused) {
      videoElementPausedSpy.mockReturnValue(false);

      return playPromise.then(() => {
        videoElementReadyStateSpy.mockReturnValue(3);
        fireEvent.playing(videoElement);
      });
    }

    return playPromise;
  });
  // eslint-disable-next-line no-param-reassign
  videoElement.pause = jest.fn(() => {
    if (!videoElement.paused) {
      videoElementPausedSpy.mockReturnValue(true);
      fireEvent.pause(videoElement);
    }
  });

  return playPromise;
};
