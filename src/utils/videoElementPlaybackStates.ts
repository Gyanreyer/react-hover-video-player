/**
 * Takes a video element and returns whether it is currently paused, meaning it is not
 * playing or attempting to play.
 *
 * @param {HTMLVideoElement} videoElement
 */
export function isVideoElementPaused(videoElement: HTMLVideoElement): boolean {
  return videoElement.paused || videoElement.ended;
}

/**
 * Takes a video element and returns whether it is currently loading, meaning it is not
 * paused but has also not loaded enough to play.
 *
 * @param {HTMLVideoElement} videoElement
 */
export function isVideoElementLoading(videoElement: HTMLVideoElement): boolean {
  return (
    !isVideoElementPaused(videoElement) &&
    videoElement.readyState < videoElement.HAVE_FUTURE_DATA
  );
}

/**
 * Takes a video element and returns whether it is currently playing, meaning it is not
 * paused and is loaded enough to be playing.
 *
 * @param {HTMLVideoElement} videoElement
 */
export function isVideoElementPlaying(videoElement: HTMLVideoElement): boolean {
  return (
    !isVideoElementPaused(videoElement) && !isVideoElementLoading(videoElement)
  );
}
