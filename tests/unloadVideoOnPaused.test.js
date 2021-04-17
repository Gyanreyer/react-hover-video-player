import { fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('unloadVideoOnPaused', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test("unloadVideoOnPaused prop unloads the video's sources while it is paused when set to true", () => {
    const { videoElement, playerContainer } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      unloadVideoOnPaused: true,
    });

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();
    expect(videoElement.currentSrc).toBe('');

    // The video should not have any sources
    expect(videoElement.querySelectorAll('source')).toHaveLength(0);

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement.currentTime).toBe(0);
    expect(videoElement.querySelectorAll('source')).toHaveLength(1);
    expect(videoElement.currentSrc).toBe(
      `${window.location.origin}/fake/video-file.mp4`
    );

    expect(videoElement).not.toBePlaying();

    // Advance time so the video element can load and start playing
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    // simulate the video having played for 5s
    videoElement.currentTime = 5;

    // Stop the video
    fireEvent.mouseLeave(playerContainer);

    expect(videoElement).toBePaused();

    // The video's source should have been removed
    expect(videoElement.currentSrc).toBe('');
    expect(videoElement.readyState).toBe(0);
    expect(videoElement.querySelectorAll('source')).toHaveLength(0);

    // The video time should have been reset to 0 because the source was removed
    expect(videoElement.currentTime).toBe(0);

    // Start playing the video again
    fireEvent.mouseEnter(playerContainer);

    expect(videoElement).not.toBePlaying();

    // Advance time so the video element can load and start playing again
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    // The video time should have been correctly restored to what it was before it was paused
    expect(videoElement.currentTime).toBe(5);
  });

  test('unloadVideoOnPaused prop does not restore previous time when restartOnPaused is true', () => {
    const { videoElement, playerContainer } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      unloadVideoOnPaused: true,
      restartOnPaused: true,
    });

    // The video's initial time should be 0
    expect(videoElement.currentTime).toBe(0);
    expect(videoElement).toBePaused();
    expect(videoElement.currentSrc).toBe('');

    // Quickly start the video
    fireEvent.mouseEnter(playerContainer);
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    // simulate the video having played for 5s
    videoElement.currentTime = 5;

    // Stop the video
    fireEvent.mouseLeave(playerContainer);
    advanceVideoTime(300);
    expect(videoElement).toBePaused();

    // The video time should have been reset to 0 because the source was removed
    expect(videoElement.currentTime).toBe(0);

    // Start playing the video again
    fireEvent.mouseEnter(playerContainer);
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    // The video time should not have been restored to what it was before it was paused
    expect(videoElement.currentTime).toBe(0);
  });

  test('unloaded video is able to play immediately if focused prop is initially set to true', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      unloadVideoOnPaused: true,
      focused: true,
    });

    // The video should be loading
    expect(videoElement).toBeLoading();
    expect(videoElement.querySelectorAll('source')).toHaveLength(1);
    expect(videoElement.currentSrc).toBe(
      `${window.location.origin}/fake/video-file.mp4`
    );

    // Advance time so the video element can load and start playing
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    // Re-render with focused set to false so the video should pause
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      unloadVideoOnPaused: true,
      focused: false,
    });

    expect(videoElement).toBePaused();

    // The video's source should have been removed
    expect(videoElement.currentSrc).toBe('');
    expect(videoElement.querySelectorAll('source')).toHaveLength(0);
    expect(videoElement.readyState).toBe(0);

    // Re-render with focused set to true to start playing one last time
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      unloadVideoOnPaused: true,
      focused: true,
    });

    // The video should be loading and its source should be restored
    expect(videoElement).toBeLoading();
    expect(videoElement.querySelectorAll('source')).toHaveLength(1);
    expect(videoElement.currentSrc).toBe(
      `${window.location.origin}/fake/video-file.mp4`
    );

    // Advance time so the video element can load and start playing
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();
  });
});
