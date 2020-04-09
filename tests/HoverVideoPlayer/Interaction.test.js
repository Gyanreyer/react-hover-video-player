import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  expectVideoHasCorrectAttributes,
  addMockedFunctionsToVideoElement,
} from '../utils';
import HoverVideoPlayer from '../../src';

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

    const playPromise = addMockedFunctionsToVideoElement(videoElement);

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
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const playPromise = addMockedFunctionsToVideoElement(videoElement);

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

    // Advance a sufficient amount of time for the pause timeout to have completed
    jest.advanceTimersByTime(500);

    expect(onStoppedVideo).toHaveBeenCalled();
    expect(videoElement.pause).toHaveBeenCalled();
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

    const playPromise = addMockedFunctionsToVideoElement(videoElement);

    // Mouse over the container to start playing the video
    fireEvent.touchStart(getByTestId('hover-video-player-container'));

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

    const playPromise = addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Touch the container to start playing the video
    fireEvent.touchStart(playerContainer);

    // Wait until the play promise has resolved
    await act(() => playPromise);

    // Touching an element inside of the player container should not start a stop attempt
    fireEvent.touchStart(videoElement);

    expect(onStoppingVideo).not.toHaveBeenCalled();
    expect(onStoppedVideo).not.toHaveBeenCalled();

    // Touching outside of the player container should start a stop attempt
    fireEvent.touchStart(document.body);

    // onStoppingVideo callback should have been called
    expect(onStoppingVideo).toHaveBeenCalled();
    // onStoppedVideo callback and video.pause should not be called until the timeout has completed
    expect(onStoppedVideo).not.toHaveBeenCalled();
    expect(videoElement.pause).not.toHaveBeenCalled();

    // Advance a sufficient amount of time for the pause timeout to have completed
    jest.advanceTimersByTime(500);

    expect(onStoppedVideo).toHaveBeenCalled();
    expect(videoElement.pause).toHaveBeenCalled();
  });
});

describe('Start and stop attempts interact with each other correctly', () => {
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

    const playPromise = addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await act(() => playPromise);

    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    // We are now in playing state, so mouse out to stop again
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);

    // Mouse back over to cancel the stop attempt and start a play attempt
    fireEvent.mouseEnter(playerContainer);

    // A second start attempt should have begun
    expect(onStartingVideo).toHaveBeenCalledTimes(2);
    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    await act(() => playPromise);

    // onStartedVideo should not need to be called again since we prevented it from stopping
    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);

    // onStoppedVideo should still not have been called because it was cancelled
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);
  });

  test('an attempt to stop the video will correctly reverse an active start attempt when it completes', async () => {
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

    const playPromise = addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    expect(videoElement.paused).toBe(true);

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(0);
    expect(videoElement.paused).toBe(false);

    // Fire a mouseLeave event to kick off a stop attempt before the play promise has resolved
    fireEvent.mouseLeave(playerContainer);

    // At this point the video should have begun its stop attempt but not completed it
    expect(onStoppingVideo).toHaveBeenCalledTimes(1);
    expect(onStoppedVideo).toHaveBeenCalledTimes(0);

    // Wait until the play promise has resolved
    await act(() => playPromise);

    // onStoppedVideo should have been called after the promise resolved and the video's `onPlaying` event fired
    expect(onStoppedVideo).toHaveBeenCalledTimes(1);

    // onStartedVideo shouldn't have been called because it was cancelled
    expect(onStartedVideo).toHaveBeenCalledTimes(0);

    expect(videoElement.paused).toBe(true);
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

    const playPromise = addMockedFunctionsToVideoElement(videoElement);

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // Wait until the play promise has resolved
    await act(() => playPromise);

    // The start attempt should have succeededF
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
    expect(onStartedVideo).toHaveBeenCalledTimes(1);

    // A second mouseEnter event should effectively be ignored
    fireEvent.mouseEnter(playerContainer);

    // Wait until the play promise has resolved
    await act(() => playPromise);

    // We should not have run through the start attempt flow again
    expect(onStartingVideo).toHaveBeenCalledTimes(1);
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

    const playerContainer = getByTestId('hover-video-player-container');

    // Mouse out of the container even though it was never started properly
    fireEvent.mouseLeave(playerContainer);

    expect(onStoppingVideo).not.toHaveBeenCalled();
    expect(onStoppedVideo).not.toHaveBeenCalled();
  });
});

/**
 * TESTS THAT STILL NEED TO BE WRITTEN
 *
 * - shouldRestartOnVideoStopped
 * - video.play() throws an error
 * - isFocused prop
 */
