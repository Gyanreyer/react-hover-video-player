import React, { useEffect, useState, useRef, useCallback } from 'react';

import { OverlayState } from '../constants/OverlayState';

interface MutableVideoState {
  isPlayAttemptInProgress: boolean;
  pauseTimeout: number;
  loadingStateTimeout: number;
  videoTimeToRestore: number;
  previousIsVideoActive: boolean;
  previousShouldPlayVideo: boolean;
}

/**
 * Hook manages safely transitioning video playback between
 * a playing or paused state, depending on the value of shouldPlayVideo
 *
 * @param {React.RefObject<HTMLVideoElement>} videoRef - Ref to the video element
 * @param {bool} shouldPlayVideo - Whether the video should currently be playing or not
 * @param {number} playbackRangeStart - The start time of the playback range that the video must be kept within
 * @param {number} playbackRangeEnd - The end time of the playback range that the video must be kept within
 * @param {bool} loop - Whether the video should loop when it reaches the end of its playback range or not
 *                        If a playback range is set, the native `loop` video attribute will not work, so we have to
 *                        manually implement this behavior ourselves.
 * @param {bool} restartOnPaused - Whether the video should be reset to the start when paused
 * @param {bool} shouldWaitForOverlayTransitionBeforePausing - Whether the player has an overlay which we should wait to fade back in before we pause the video
 * @param {bool} hasLoadingOverlay - Whether the player has an overlay to display when loading
 * @param {number} overlayTransitionDuration - How long it should take for overlays to fade in/out; this influences how long we should wait
 *                                              after the user stops hovering before fully pausing the video since the paused overlay needs time to fade in.
 * @param {number} loadingStateTimeout - How long to wait after starting a play attempt to fade in the loading overlay
 *
 * @returns {[OverlayState, bool]} An array with the current overlay state in the first position and whether the video player is active in the second positions
 */
export default function useManageVideoPlayback(
  videoRef: React.RefObject<HTMLVideoElement>,
  shouldPlayVideo: boolean,
  playbackRangeStart: number,
  playbackRangeEnd: number,
  loop: boolean,
  restartOnPaused: boolean,
  shouldWaitForOverlayTransitionBeforePausing: boolean,
  hasLoadingOverlay: boolean,
  overlayTransitionDuration: number,
  loadingStateTimeout: number
): [OverlayState, boolean] {
  // Keep track of how the paused and loading overlays should be displayed
  const [overlayState, setOverlayState] = useState<OverlayState>(
    OverlayState.paused
  );
  // Keep track of whether the video is currently playing or attempting to play
  const [isVideoLoadingOrPlaying, setIsVideoLoadingOrPlaying] =
    useState<boolean>(false);

  // Keep track of when the video is "active", meaning it is in one of the following states:
  // 1. The user is hovering over the video but it is still loading
  // 2. The user is hovering over the video and it is playing
  // 3. The user is no longer hovering over the video but it is still transitioning back into a paused state
  //
  // This helps us keep track of when the player is truly done with the video so we can perform
  // cleanup such as resetting the time to the start or unloading the video
  const isVideoActive = shouldPlayVideo || isVideoLoadingOrPlaying;

  // Keep a ref for all variables related to the video's playback state
  // which we need to persist between renders and manage asynchronously
  // but shouldn't trigger re-renders when updated
  const mutableVideoState = useRef<MutableVideoState>(null);

  if (mutableVideoState.current === null) {
    // Set initial values for our video state
    mutableVideoState.current = {
      // Whether there is a play promise in progress which we should avoid interrupting
      // with calls to video.play() or video.load()
      isPlayAttemptInProgress: false,
      // Keep refs for timeouts so we can keep track of and cancel them
      pauseTimeout: null,
      loadingStateTimeout: null,
      // Keep track of the video time that we should start from when the video is played again
      // This is particularly useful so we can restore our previous place in the video even if
      // we are unloading it every time it gets paused
      videoTimeToRestore: playbackRangeStart || 0,
      // Keep refs to previous values for some states so we can avoid running effects for
      // changes in values we don't care about
      previousIsVideoActive: false,
      previousShouldPlayVideo: false,
    };
  }

  // Cancel any pending timeouts to pause or show a loading state
  const clearVideoStateTimeouts = useCallback(() => {
    clearTimeout(mutableVideoState.current.pauseTimeout);
    clearTimeout(mutableVideoState.current.loadingStateTimeout);
  }, []);

  useEffect(
    // On cleanup when the component is unmounting, clear any outstanding timeouts
    () => () => clearVideoStateTimeouts(),
    [clearVideoStateTimeouts]
  );

  // Method begins an attempt to play the video and updates state accordingly
  const attemptToPlayVideo = useCallback(() => {
    mutableVideoState.current.isPlayAttemptInProgress = true;

    const videoElement = videoRef.current;

    videoElement.play().catch((error) => {
      // Additional handling for when browsers block playback for unmuted videos.
      // This is unfortunately necessary because most modern browsers do not allow playing videos with audio
      //  until the user has "interacted" with the page by clicking somewhere at least once; mouseenter events
      //  don't count.

      // If the video isn't muted and playback failed with a `NotAllowedError`, this means the browser blocked
      // playing the video because the user hasn't clicked anywhere on the page yet.
      if (!videoElement.muted && error.name === 'NotAllowedError') {
        console.warn(
          'HoverVideoPlayer: Playback with sound was blocked by the browser. Attempting to play again with the video muted; audio will be restored if the user clicks on the page.'
        );
        // Mute the video and attempt to play again
        videoElement.muted = true;
        videoElement.play();

        // When the user clicks on the document, unmute the video since we should now
        // be free to play audio
        const onClickDocument = () => {
          videoElement.muted = false;

          // Clean up the event listener so it is only fired once
          document.removeEventListener('click', onClickDocument);
        };
        document.addEventListener('click', onClickDocument);
      }
    });
  }, [videoRef]);

  // Method attempts to pause the video, if it is safe to do so without interrupting a pending play promise
  const attemptToPauseVideo = useCallback(() => {
    const videoElement = videoRef.current;

    if (
      !videoElement.paused &&
      // If there is a play attempt in progress, the video can't be
      //  safely paused right away without intnerrupting the play promise and throwing an error.
      // In this case, we'll have to wait for the logic in the video's `onPlaying` event
      // to immediately pause the video as soon as the play promise resolves
      !mutableVideoState.current.isPlayAttemptInProgress
    ) {
      videoElement.pause();
    }
  }, [videoRef]);

  // Effect adds a `play` and `pause` event listener to the video element to keep our state
  // updated to reflect whether the video is currently playing or paused
  useEffect(() => {
    const videoElement = videoRef.current;

    const onPause = () => setIsVideoLoadingOrPlaying(false);
    const onPlay = () => setIsVideoLoadingOrPlaying(true);
    videoElement.addEventListener('pause', onPause);
    videoElement.addEventListener('play', onPlay);

    return () => {
      videoElement.removeEventListener('pause', onPause);
      videoElement.removeEventListener('play', onPlay);
    };
  }, [videoRef]);

  // Effect adds a `playing` event listener to the video to update state to reflect when the video successfully starts playing
  useEffect(() => {
    const videoElement = videoRef.current;

    // Listen for when the video actually finishes loading and starts playing
    const onPlaying = () => {
      // Ensure we cancel any pending loading state timeout
      clearVideoStateTimeouts();

      // The play attempt is now complete
      mutableVideoState.current.isPlayAttemptInProgress = false;

      if (shouldPlayVideo) {
        // Hide the overlays to reveal the video now that it's playing
        setOverlayState(OverlayState.playing);
      } else {
        // If the play attempt just succeeded but we no longer want to play the video,
        // pause it immediately!
        videoElement.pause();
      }
    };
    videoElement.addEventListener('playing', onPlaying);

    return () => {
      videoElement.removeEventListener('playing', onPlaying);
    };
  }, [clearVideoStateTimeouts, shouldPlayVideo, videoRef]);

  // When the video becomes inactive, effect resets it to the start if restartOnPaused is true and
  // stores the video's current time so we can restore to it when we start playing the video again
  useEffect(() => {
    if (mutableVideoState.current.previousIsVideoActive === isVideoActive) {
      return;
    }
    mutableVideoState.current.previousIsVideoActive = isVideoActive;

    if (!isVideoActive) {
      const videoElement = videoRef.current;

      // Ensure we cancel any pending timeouts to pause or show a loading state
      // since we are now officially paused
      clearVideoStateTimeouts();

      if (restartOnPaused) {
        // Reset the video to the start since we're now paused
        const resetStartTime = playbackRangeStart || 0;
        videoElement.currentTime = resetStartTime;
      }

      // Hang onto the time that the video is currently at so we can
      // restore it when we try to play again
      // This is mainly helpful because the unloadVideoOnPaused prop will cause
      // the video's currentTime to be cleared every time its sources are unloaded
      // after pausing
      mutableVideoState.current.videoTimeToRestore = videoElement.currentTime;
    }
  }, [
    clearVideoStateTimeouts,
    isVideoActive,
    playbackRangeStart,
    restartOnPaused,
    videoRef,
  ]);

  // Effect starts an update loop while the video is playing
  // to ensure the video stays within the bounds of its playback range
  useEffect(() => {
    if (
      // If we don't have a playback range set, we don't need to do anything here
      playbackRangeStart === null &&
      playbackRangeEnd === null
    )
      return undefined;

    const videoElement = videoRef.current;

    let animationFrameId = null;

    // Update loop checks the video's time each frame while it's playing to make sure
    // it stays clamped inside the playback range
    const checkPlaybackRangeTime = () => {
      // Use playbackRangeEnd as our maximum time to play to, or default to the video's full duration
      const playbackRangeMaxTime = playbackRangeEnd || videoElement.duration;
      // Use playbackRangeStart as our minimum time to play from, or default to the very beginning of the video (0sƒ)
      const playbackRangeMinTime = playbackRangeStart || 0;

      if (videoElement.currentTime >= playbackRangeMaxTime) {
        // If the video's current time has played past the maximum time in the playback range,
        // determine how to handle keeping the video inside of the playback range
        if (loop) {
          // If the video should loop, jump it back to the start of the playback range again
          videoElement.currentTime = playbackRangeMinTime;

          // If the video is paused, start playing it again (when the video reaches the end
          // of the playback range for the first time, most browsers will pause it)
          if (shouldPlayVideo && (videoElement.paused || videoElement.ended)) {
            attemptToPlayVideo();
          }
        } else {
          // If we don't want to loop the video, just pause it
          attemptToPauseVideo();

          if (videoElement.currentTime > playbackRangeMaxTime) {
            videoElement.currentTime = playbackRangeMaxTime;
          }
        }
      } else if (videoElement.currentTime < playbackRangeMinTime) {
        // If the video's current time has someone gotten before the playback range,
        // clamp it to the lower end of the playback range
        videoElement.currentTime = playbackRangeMinTime;
      }

      // If the video is playing, keep the update loop going for the next frame
      if (shouldPlayVideo) {
        animationFrameId = requestAnimationFrame(checkPlaybackRangeTime);
      }
    };

    // Run our update loop at least once; if the video is playing,
    // it will continue running every frame until the video is paused again
    animationFrameId = requestAnimationFrame(checkPlaybackRangeTime);

    return () => {
      // Cancel the animation frame loop on cleanup
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    attemptToPauseVideo,
    attemptToPlayVideo,
    loop,
    playbackRangeEnd,
    playbackRangeStart,
    shouldPlayVideo,
    videoRef,
  ]);

  // Effect attempts to play or pause the video as shouldPlayVideo changes
  useEffect(() => {
    // Only run the effect when shouldPlayVideo changes
    if (mutableVideoState.current.previousShouldPlayVideo === shouldPlayVideo) {
      return;
    }
    mutableVideoState.current.previousShouldPlayVideo = shouldPlayVideo;

    // Clear any outstanding timeouts since our playback state is changing
    clearVideoStateTimeouts();

    const videoElement = videoRef.current;

    // The video is stopped if it is paused or ended
    const isVideoStopped = videoElement.paused || videoElement.ended;

    // If shouldPlayVideo is true, attempt to start playing the video
    if (shouldPlayVideo) {
      // readyState 3 is HAVE_FUTURE_DATA, meaning the video has loaded enough data that it can play
      const isVideoLoadedEnoughToPlay = videoElement.readyState >= 3;

      // If the video is stopped or still loading and we have a loading overlay,
      // set a timeout to display the overlay if the video doesn't finish loading
      // after a certain amount of time
      if ((isVideoStopped || !isVideoLoadedEnoughToPlay) && hasLoadingOverlay) {
        // If we have a loading overlay, set a timeout to start showing it if the video doesn't start playing
        // before the loading state timeout has elapsed
        mutableVideoState.current.loadingStateTimeout = window.setTimeout(
          () => {
            // If this timeout wasn't cancelled, we're still trying to play the video
            // and it's still loading, so fade in the loading overlay
            setOverlayState(OverlayState.loading);
          },
          loadingStateTimeout
        );
      }

      // If the video is fully stopped, we need to attempt to start it by calling play()
      if (isVideoStopped) {
        // Ensure we're at the correct time to start playing from
        videoElement.currentTime = mutableVideoState.current.videoTimeToRestore;

        // Start attempting to play
        attemptToPlayVideo();
      } else if (isVideoLoadedEnoughToPlay) {
        // If the video isn't stopped and is loaded enough to play. it's already playing,
        // so ensure the overlays are hidden to reflect that!
        setOverlayState(OverlayState.playing);
      }
    }
    // Otherwise if shouldPlayVideo is false, go through the process necessary to pause the video
    else {
      // Start fading the paused overlay back in
      setOverlayState(OverlayState.paused);

      if (
        shouldWaitForOverlayTransitionBeforePausing &&
        overlayTransitionDuration
      ) {
        // If we have a paused/hover overlay, set a timeout with a duration of the overlay's fade
        // transition since we want to keep the video playing until the overlay has fully
        // faded in and hidden it.
        mutableVideoState.current.pauseTimeout = window.setTimeout(
          attemptToPauseVideo,
          overlayTransitionDuration
        );
      } else {
        // If we don't have an overlay transition to wait on, pause right away!
        attemptToPauseVideo();
      }
    }
  }, [
    attemptToPauseVideo,
    attemptToPlayVideo,
    clearVideoStateTimeouts,
    hasLoadingOverlay,
    shouldWaitForOverlayTransitionBeforePausing,
    loadingStateTimeout,
    overlayTransitionDuration,
    shouldPlayVideo,
    videoRef,
  ]);

  return [overlayState, isVideoActive];
}
