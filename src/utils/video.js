/* eslint-disable no-param-reassign */
// Enumerates states that the video can be in
export const VIDEO_STATE = {
  paused: 'paused',
  loading: 'loading',
  playing: 'playing',
};

/**
 * @function getVideoState
 *
 * Takes a video element and returns its current playing state
 *
 * @param {node} videoElement
 */
export function getVideoState(videoElement) {
  if (videoElement.paused || videoElement.ended) {
    return VIDEO_STATE.paused;
  }

  // If the video isn't paused but its readyState indicates it isn't loaded enough
  // to play yet, it is loading
  if (videoElement.readyState < 3) {
    return VIDEO_STATE.loading;
  }

  // If the video isn't paused and its ready state indicates it's loaded enough to play,
  // assume it's playing
  return VIDEO_STATE.playing;
}

/**
 * @function playVideo
 *
 * Takes a video element and attempts to play it.
 *
 * @param {node}  videoElement - The video element to start playing
 *
 * @returns {Promise}   A Promise which will resolve when the video starts playing or reject if an error occurs
 */
export function playVideo(videoElement) {
  // Start playing the video and hang onto the play promise it returns
  let playPromise = videoElement.play();

  if (!playPromise || !playPromise.then) {
    // If videoElement.play() didn't return a promise, we'll manually create one
    // ourselves which mimics the same behavior
    playPromise = new Promise((resolve, reject) => {
      // Declaring onVideoPlaybackFailed up here so we can refer to it and remove its event listener
      // if the video successfully starts playing
      let onVideoPlaybackFailed;

      // Set up event listener to resolve the promise when the video player starts playing
      const onVideoPlaybackStarted = () => {
        // Remove the event listeners we added as cleanup now that the play attempt has succeeded
        videoElement.removeEventListener('playing', onVideoPlaybackStarted);
        videoElement.removeEventListener('error', onVideoPlaybackFailed);

        // Resolve because we successfully started playing!
        resolve();
      };
      videoElement.addEventListener('playing', onVideoPlaybackStarted, {
        once: true,
      });

      // Set up event listener to reject the promise when the video player encounters an error
      onVideoPlaybackFailed = (event) => {
        // Remove the event listeners we added as cleanup now that the play attempt has failed
        videoElement.removeEventListener('error', onVideoPlaybackFailed);
        videoElement.removeEventListener('playing', onVideoPlaybackStarted);

        // Reject with the error that was thrown
        reject(event.error);
      };
      videoElement.addEventListener('error', onVideoPlaybackFailed);
    });
  }

  return playPromise;
}

/**
 * @function  pauseVideo
 *
 * Pauses the video and resets it to the beginning if necessary
 *
 * @param {node}  videoElement - The video element to pause playback for
 * @param {bool}  shouldRestart - Whether the videp should be reset to the beginning after pausing
 */
export function pauseVideo(videoElement, shouldRestart) {
  videoElement.pause();

  if (shouldRestart) {
    // If we should restart the video, reset its time to the beginning
    videoElement.currentTime = 0;
  }
}
