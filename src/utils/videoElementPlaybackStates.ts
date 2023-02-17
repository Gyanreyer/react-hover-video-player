/**
 * Takes a video element and returns whether it is currently paused, meaning it is not
 * playing or attempting to play.
 *
 * @param {HTMLVideoElement} videoElement
 */
export function isVideoElementPaused(
  videoElement: HTMLVideoElement | null
): boolean {
  return videoElement ? videoElement.paused || videoElement.ended : true;
}
