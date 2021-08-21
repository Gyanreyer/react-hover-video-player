import React, { useEffect } from 'react';

// Interface extends the HTMLVideoElement type to include some additional missing properties
// that we use
interface VideoElement extends HTMLVideoElement {
  disableRemotePlayback?: boolean;
  disablePictureInPicture?: boolean;
}

/**
 * Hook handles manually setting some additional attributes on the video that
 * can't be set directly via attributes on the element.
 *
 * @param {React.RefObject<HTMLVideoElement>} videoRef - Ref to the video element
 * @param {bool} muted - Whether the video should be muted
 * @param {number} volume - The volume level that the video's audio should be set to
 * @param {bool} disableRemotePlayback - Whether we want to disable showing controls to cast the video
 * @param {bool} disablePictureInPicture - Whether we want to disable showing controls to play the video in picture-in-picture mode
 */
export default function useSetAdditionalAttributesOnVideo(
  videoRef: React.RefObject<VideoElement>,
  muted: boolean,
  volume: number,
  disableRemotePlayback: boolean,
  disablePictureInPicture: boolean
): void {
  useEffect(() => {
    const videoElement = videoRef.current;

    // Manually setting the `muted` attribute on the video element via an effect in order
    // to avoid a know React issue with the `muted` prop not applying correctly on initial render
    // https://github.com/facebook/react/issues/10389
    videoElement.muted = muted;
    // Set the video's volume to match the `volume` prop
    // Note that this will have no effect if the `muted` prop is set to true
    videoElement.volume = volume;
  }, [videoRef, muted, volume]);

  useEffect(() => {
    const videoElement = videoRef.current;

    // React does not support directly setting disableRemotePlayback or disablePictureInPicture directly
    // via the video element's props, so we have to manually set them in an effect
    videoElement.disableRemotePlayback = disableRemotePlayback;
    videoElement.disablePictureInPicture = disablePictureInPicture;
  }, [videoRef, disablePictureInPicture, disableRemotePlayback]);
}
