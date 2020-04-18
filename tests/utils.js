/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import HoverVideoPlayer from '../src';

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
    .mockReturnValue(videoElement.preload === 'none' ? 0 : 2);

  jest.spyOn(videoElement, 'currentSrc', 'get').mockImplementation(() => {
    const firstVideoSource = videoElement.querySelector('source');
    return firstVideoSource ? firstVideoSource.src : '';
  });

  let isPlayAttemptInProgress = false;

  videoElement.play = jest.fn(() => {
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
        // Fire the video's onError event with a custom message we can check for
        fireEvent(
          videoElement,
          // eslint-disable-next-line no-undef
          new ErrorEvent('error', { error: 'the onError event was fired' })
        );
      } else {
        videoElement.currentTime = 10;
        videoElementReadyStateSpy.mockReturnValue(3);
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
