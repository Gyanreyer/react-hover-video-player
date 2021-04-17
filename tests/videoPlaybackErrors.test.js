import { screen, fireEvent } from '@testing-library/react';

import { renderHoverVideoPlayer, advanceVideoTime } from './utils';

describe('Video playback errors', () => {
  afterEach(() => {
    expect(console.error).toHaveBeenCalled();
  });

  test('handles playback errors correctly', () => {
    const { videoElement, playerContainer } = renderHoverVideoPlayer(
      {
        videoSrc: 'fake/video-file.mp4',
      },
      {
        // the video should throw an error during its playback attempt
        shouldPlaybackFail: true,
      }
    );

    expect(videoElement).toBePaused();

    // Mouse over the container to start playing the video
    fireEvent.mouseEnter(playerContainer);

    advanceVideoTime(300);

    // The video should be in a loading state because it couldn't load enough to play
    expect(videoElement).toBeLoading();

    // The error should have been logged correctly
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `HoverVideoPlayer encountered an error for src "${videoElement.currentSrc}".`
    );
  });
});
