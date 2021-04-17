import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('Prevents memory leaks when unmounted', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('cleans everything up correctly if the video is unmounted during a play attempt', () => {
    const { unmount, videoElement, playerContainer } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      loadingOverlay: <div />,
      loadingStateTimeout: 200,
    });

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // Unmount while the play attempt and the loading timeout are still in progress
    unmount();

    expect(videoElement).not.toBeInTheDocument();

    // Advance the timers so that the loading state timeout would execute if it wasn't cancelled
    advanceVideoTime(200);

    // If the loading state timeout wasn't cancelled, an error will have been logged because it
    // attempted to update the component's state after it was been unmounted
    expect(console.error).not.toHaveBeenCalled();
  });

  test('cleans everything up correctly if the video is unmounted during a pause attempt', () => {
    const { unmount, videoElement, playerContainer } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      overlayTransitionDuration: 200,
      preload: 'auto',
    });

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    // Tick timers forward to simulate waiting for the video to load
    advanceVideoTime(300);

    expect(videoElement).toBePlaying();

    // Mouse out to start a pause attempt
    fireEvent.mouseLeave(playerContainer);

    expect(videoElement.pause).not.toHaveBeenCalled();

    // Unmount while the play attempt and the loading timeout are still in progress
    unmount();

    expect(videoElement).not.toBeInTheDocument();

    // Advance the timers so that the pause overlay transition timeout would execute if it wasn't cancelled
    advanceVideoTime(200);

    // The pause attempt should not have run
    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
