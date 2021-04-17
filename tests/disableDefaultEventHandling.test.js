import { fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('disableDefaultEventHandling', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('disableDefaultEventHandling prop disables all default event handling', () => {
    const {
      rerenderWithProps,
      videoElement,
      playerContainer,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      disableDefaultEventHandling: true,
    });

    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();

    fireEvent.mouseEnter(playerContainer);
    fireEvent.touchStart(playerContainer);

    advanceVideoTime(300);

    // Mouse and touch events should not have done anything
    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();

    // Set focused to true to start playing the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      disableDefaultEventHandling: true,
      focused: true,
    });

    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    fireEvent.mouseLeave(playerContainer);
    fireEvent.touchStart(document.body);

    advanceVideoTime(300);

    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBePlaying();

    // Set focused to true to start playing the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      disableDefaultEventHandling: true,
      focused: false,
    });

    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });
});
