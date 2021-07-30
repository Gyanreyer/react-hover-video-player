import { fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('restartOnPaused', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('restartOnPaused prop restarts the video when set to true', () => {
    const { videoElement, playerContainer } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      restartOnPaused: true,
    });

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    // Wait for the video to start playing
    advanceVideoTime(300);

    // Simulate the video having been playing for 5 seconds
    videoElement.currentTime = 5;

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    // The video should have been paused and reset to the start
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();
  });

  test('restartOnPaused prop does not restart the video when set to false', () => {
    const { videoElement, playerContainer } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // restartOnPaused is false by default
    });

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);

    // Wait for the video to start playing
    advanceVideoTime(300);

    // Simulate the video having been playing for 5 seconds
    videoElement.currentTime = 5;

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    // The video time should not have been reset to 0
    expect(videoElement.currentTime).toBe(5);
    expect(videoElement).toBePaused();
  });
});
