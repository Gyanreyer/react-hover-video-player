/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, act } from '@testing-library/react';

// This is being mapped in the jest config files so we can alternate between
// running tests off of the development version (../src) of the component or
// the built production version (../es)
// eslint-disable-next-line import/no-unresolved
import HoverVideoPlayer from 'react-hover-video-player';

/**
 * Takes a video element and sets up spies and basic config so we can use it in our unit tests
 *
 * @param {HTMLVideoElement} videoElement - The video element to hook up so we can use it in unit tests
 * @param {object}  videoConfig - Object with config defining how the video should behave
 * @param {bool}    [videoConfig.shouldPlaybackFail=false] - Whether video.load() should succeed or fail
 */
export const prepareVideoElementForTests = (videoElement, videoConfig) => {
  videoElement.shouldPlaybackFail =
    // If shouldPlaybackFail was set on the video config, use that value
    videoConfig && videoConfig.shouldPlaybackFail !== undefined
      ? videoConfig.shouldPlaybackFail
      : // Default to false
        false;

  jest.spyOn(videoElement, 'load');
  jest.spyOn(videoElement, 'play');
  jest.spyOn(videoElement, 'pause');
};

/**
 * Advances mock jest timers by the given amount of time, wrapped in `act` so
 * any resulting React state updates can be handled safely
 *
 * @param {number}  [time=0]  Time in milliseconds to advance the timers by
 */
export const advanceVideoTime = (time = 0) =>
  act(() => jest.advanceTimersByTime(time));

/**
 * Renders a HoverVideoPlayer component with the given props and video behavior config
 *
 * @param {object}  props - Object with all props to apply to the HoverVideoPlayer component
 * @param {object}  videoConfig - Object with config defining how the video should behave
 * @param {bool}    [videoConfig.shouldPlaybackFail=false] - Whether video.load() should succeed or fail
 */
export function renderHoverVideoPlayer(props, videoConfig) {
  const renderResult = render(<HoverVideoPlayer {...props} />);
  expect(renderResult.container).toMatchSnapshot();

  const videoElement = renderResult.container.querySelector('video');
  prepareVideoElementForTests(videoElement, videoConfig);

  // Verify that basic attributes were set on the video correctly
  expect(videoElement).toHaveAttribute('playsInline');

  return {
    ...renderResult,
    rerenderWithProps(newProps) {
      return renderResult.rerender(<HoverVideoPlayer {...newProps} />);
    },
  };
}
