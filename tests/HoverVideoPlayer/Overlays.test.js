import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  expectVideoHasCorrectAttributes,
  addMockedFunctionsToVideoElement,
} from '../utils';
import HoverVideoPlayer from '../../src';

describe('Pause and loading overlays work correctly', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('overlays are shown and hidden correctly as the video is started and stopped', async () => {
    const { container, getByTestId, queryByTestId } = render(
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

    const playPromise = addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // The paused overlay should be visible since we're in the initial idle paused state
    expect(
      queryByTestId('paused-overlay-transition-wrapper').style.opacity
    ).toBe('1');
    // The loading overlay should not be mounted while the player is idle
    expect(
      queryByTestId('loading-overlay-transition-wrapper')
    ).not.toBeInTheDocument();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // The paused overlay should still be visible under the loading overlay
    expect(
      queryByTestId('paused-overlay-transition-wrapper').style.opacity
    ).toBe('1');
    // We are in a loading state until the play promise is resolved so the loading overlay should now be mounted
    expect(
      queryByTestId('loading-overlay-transition-wrapper')
    ).toBeInTheDocument();

    // Wait until the play promise has resolved
    await act(() => playPromise);

    // The paused overlay should be hidden now that we are playing
    expect(
      queryByTestId('paused-overlay-transition-wrapper').style.opacity
    ).toBe('0');
    // We have exited the loading state and the loading overlay should be hidden,
    // but it will still be mounted as it fades out until 500ms have elapsed
    expect(
      queryByTestId('loading-overlay-transition-wrapper')
    ).toBeInTheDocument();

    // Advance 500ms to the end of the loading overlay fade transition
    jest.advanceTimersByTime(500);

    expect(
      queryByTestId('paused-overlay-transition-wrapper').style.opacity
    ).toBe('0');
    // The loading overlay should now be unmounted
    expect(
      queryByTestId('loading-overlay-transition-wrapper')
    ).not.toBeInTheDocument();

    // Fire a mouseLeave event to stop the video
    fireEvent.mouseLeave(playerContainer);

    // Advance 500ms to let the paused overlay fade back in
    jest.advanceTimersByTime(500);

    // Since we're stopping, the paused overlay should be visible again
    expect(
      queryByTestId('paused-overlay-transition-wrapper').style.opacity
    ).toBe('1');
    // The loading overlay should still be unmounted
    expect(
      queryByTestId('loading-overlay-transition-wrapper')
    ).not.toBeInTheDocument();
  });
});
