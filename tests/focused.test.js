import { fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('focused', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('focused prop starts and stops the video correctly', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // focused is false by default
    });

    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();

    // Set focused to true to start playing the video
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', focused: true });

    // Advance time so the video can finish loading
    advanceVideoTime(300);

    expect(videoElement).toBePlaying();

    // Set focused back to false to stop playing
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', focused: false });

    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });

  test('other events which would normally stop the video are ignored if focused prop is true', () => {
    const {
      rerenderWithProps,
      videoElement,
      playerContainer,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    expect(videoElement).toBePaused();

    // Re-render with focused set to true to start playing
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', focused: true });

    // Advance time so the video can finish loading
    advanceVideoTime(300);

    expect(videoElement).toBePlaying();

    fireEvent.mouseEnter(playerContainer);

    // Advance time so the video could finish loading if it wasn't playing already
    advanceVideoTime(300);

    // Play shouldn't have been called again since we're already playing
    expect(videoElement.play).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePlaying();

    expect(videoElement.pause).not.toHaveBeenCalled();

    // Fire some events that would normally pause the video
    fireEvent.mouseLeave(playerContainer);
    fireEvent.touchStart(document.body);

    // The video still shouldn't have been paused
    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBePlaying();
  });
});
