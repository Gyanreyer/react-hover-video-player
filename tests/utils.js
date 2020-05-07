/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import HoverVideoPlayer from '../src';

const READY_STATES = {
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
};

/**
 * Takes a video element and applies a bunch of mocks to it to simulate its normal functionality
 * since JSDOM won't do it for us
 *
 * @param {node}    videoElement  Video element top apply mocks top
 * @param {object}  videoConfig - Object with config defining how the video should behave
 * @param {bool}    [videoConfig.shouldPlaybackFail=false] - Whether video.play() should succeed or fail
 * @param {bool}    [videoConfig.shouldPlayReturnPromise=true] - Whether video.play() should return a promise
 */
function addMockedFunctionsToVideoElement(
  videoElement,
  { shouldPlaybackFail = false, shouldPlayReturnPromise = true } = {}
) {
  const videoElementPausedSpy = jest
    .spyOn(videoElement, 'paused', 'get')
    .mockReturnValue(true);

  const videoElementReadyStateSpy = jest
    .spyOn(videoElement, 'readyState', 'get')
    .mockReturnValue(READY_STATES.HAVE_NOTHING);

  const videoElementCurrentSrcSpy = jest
    .spyOn(videoElement, 'currentSrc', 'get')
    .mockReturnValue('');

  let isPlayAttemptInProgress = false;

  videoElement.load = jest.fn(() => {
    const videoSources = videoElement.getElementsByTagName('source');
    if (videoSources.length > 0) {
      // Just assume we're using the first source
      videoElementCurrentSrcSpy.mockReturnValue(videoSources[0].src);
    } else {
      // If we don't have any sources, the currentSrc should be ''
      videoElementCurrentSrcSpy.mockReturnValue('');
      // If we don't have a source, set the video time to 0
      videoElement.currentTime = 0;
      // The ready state shoudl be
      videoElementReadyStateSpy.mockReturnValue(READY_STATES.HAVE_NOTHING);
    }
  });

  // Attempt an initial load if the video should preload
  if (videoElement.preload === 'metadata') {
    videoElement.load();
    videoElementReadyStateSpy.mockReturnValue(READY_STATES.HAVE_METADATA);
  } else if (videoElement.preload === 'auto') {
    videoElement.load();
    videoElementReadyStateSpy.mockReturnValue(READY_STATES.HAVE_FUTURE_DATA);
  }

  videoElement.play = jest.fn(() => {
    videoElement.load();

    const wasPausedWhenTriedToPlay = videoElement.paused;

    if (wasPausedWhenTriedToPlay) {
      isPlayAttemptInProgress = true;
      videoElementPausedSpy.mockReturnValue(false);
    }

    if (shouldPlayReturnPromise) {
      if (shouldPlaybackFail) {
        return new Promise((resolve, reject) => {
          isPlayAttemptInProgress = false;

          // eslint-disable-next-line prefer-promise-reject-errors
          reject('The video broke');
        });
      }

      return Promise.resolve().then(() => {
        isPlayAttemptInProgress = false;
        videoElementReadyStateSpy.mockReturnValue(
          READY_STATES.HAVE_FUTURE_DATA
        );

        if (wasPausedWhenTriedToPlay) {
          fireEvent.playing(videoElement);
        }
      });
    }

    setTimeout(() => {
      isPlayAttemptInProgress = false;

      if (shouldPlaybackFail) {
        // Fire the video's onError event with a custom message we can check for
        fireEvent(
          videoElement,
          // eslint-disable-next-line no-undef
          new ErrorEvent('error', { error: 'the onError event was fired' })
        );
      } else {
        videoElementReadyStateSpy.mockReturnValue(
          READY_STATES.HAVE_FUTURE_DATA
        );
        // Fire the video's onPlaying event to mark that loading is complete
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
}

/**
 * Renders a HoverVideoPlayer component with the given props and video behavior config
 *
 * @param {object}  props - Object with all props to apply to the HoverVideoPlayer component
 * @param {object}  videoConfig - Object with config defining how the video should behave
 */
export function renderHoverVideoPlayer(props, videoConfig) {
  const renderResult = render(<HoverVideoPlayer {...props} />);
  expect(renderResult.container).toMatchSnapshot();

  const videoElement = renderResult.container.querySelector('video');
  addMockedFunctionsToVideoElement(videoElement, videoConfig);

  // Verify that basic attributes were set on the video correctly
  expect(videoElement).toHaveAttribute('playsInline');
  expect(videoElement.disableRemotePlayback).toBe(true);

  return {
    rerenderWithProps(newProps) {
      return renderResult.rerender(<HoverVideoPlayer {...newProps} />);
    },
    ...renderResult,
  };
}

/**
 * Gets the play promise returned by a given call to video.play()
 *
 * @param {node}    videoElement - The video element to get the play promise for
 * @param {number}  playCallIndex - The index of the play() call that we want to get the returned promise for
 */
export function getPlayPromise(videoElement, playCallIndex) {
  return videoElement.play.mock.results[playCallIndex].value;
}

const originalConsoleError = console.error;

/**
 * Mocks console.error so we can either easily check what was logged in tests where errors
 * are expected or ensure that it was not called for any tests where it was not expected
 *
 * @param {bool}  shouldExpectErrors - Whether we should expect the tests to log errors
 */
export function mockConsoleError(shouldExpectErrors) {
  beforeEach(() => {
    // Mock the console.error function so we can verify that an error was logged correctly
    console.error = jest.fn();
  });

  afterEach(() => {
    // Ensure console.error was or wasn't called as expected
    if (shouldExpectErrors) {
      expect(console.error).toHaveBeenCalled();
    } else {
      expect(console.error).not.toHaveBeenCalled();
    }

    console.error = originalConsoleError;
  });
}
