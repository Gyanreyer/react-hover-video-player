import React, { useEffect } from 'react';

/**
 * Hook unloads the video when it is paused, if the unloadVideoOnPaused prop was set to true
 *
 * @param {React.RefObject<HTMLVideoElement>} videoRef - Ref to the video element
 * @param {bool} shouldUnloadVideo - Whether we should unload the video's sources
 */
export default function useUnloadVideo(
  videoRef: React.RefObject<HTMLVideoElement>,
  shouldUnloadVideo: boolean
): void {
  // Effect ensures the video element fully unloads after its <source> tags were removed
  useEffect(() => {
    if (shouldUnloadVideo) {
      // Perform a manual load to unload the video's current source
      const videoElement = videoRef.current;
      videoElement.load();
    }
  }, [shouldUnloadVideo, videoRef]);
}
