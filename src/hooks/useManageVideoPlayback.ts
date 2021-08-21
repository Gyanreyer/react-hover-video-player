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
 * @param {bool} hasPausedOverlay - Whether the player has an overlay to display when paused
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
  hasPausedOverlay: boolean,
  hasLoadingOverlay: boolean,
  overlayTransitionDuration: number,
  loadingStateTimeout: number
): [OverlayState, boolean] {
  // Keep track of how the paused and loading overlays should be displayed
  const [overlayState, setOverlayState] = useState<OverlayState>(
    OverlayState.paused
  );
  // Keep track of whether the video is "active" for the user, meaning they are either hovering over it or the component is
  // transitioning to a paused state where the video still needs to remain loaded and playing in the meantime
  const [isVideoActive, setIsVideoActive] = useState<boolean>(shouldPlayVideo);

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
    // Update state to indicate that the video is now "active", meaning
    // that we want it to load/play and keep its sources loaded
    setIsVideoActive(true);
    mutableVideoState.current.isPlayAttemptInProgress = true;

    videoRef.current.play();
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
    if (mutableVideoState.current.previousIsVideoActive !== isVideoActive) {
      mutableVideoState.current.previousIsVideoActive = isVideoActive;
    } else {
      return undefined;
    }

    const videoElement = videoRef.current;

    if (!isVideoActive) {
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

  // Effect adds a `timeupdate` event listener to the video if a playback range is set to ensure
  // the video stays within the bounds of its playback range
  useEffect(() => {
    if (
      // If we don't have a playback range set, we don't need to do anything here
      playbackRangeStart === null &&
      playbackRangeEnd === null
    )
      return undefined;

    const videoElement = videoRef.current;

    // Makes sure the video stays clamped inside the playback range as its time updates
    const onTimeUpdate = () => {
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
          if (isVideoActive && videoElement.paused) {
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
    };

    videoElement.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      videoElement.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [
    attemptToPauseVideo,
    attemptToPlayVideo,
    isVideoActive,
    loop,
    playbackRangeEnd,
    playbackRangeStart,
    videoRef,
  ]);

  // Effect attempts to play or pause the video as shouldPlayVideo changes
  useEffect(() => {
    // Only run the effect when shouldPlayVideo changes
    if (mutableVideoState.current.previousShouldPlayVideo !== shouldPlayVideo) {
      mutableVideoState.current.previousShouldPlayVideo = shouldPlayVideo;
    } else {
      return undefined;
    }

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

      const stopVideo = () => {
        attemptToPauseVideo();

        // Now that the video is officially fully paused and no longer in use, update that
        // we're done with the video's sources for the time being
        // so they can be safely unloaded if desired
        setIsVideoActive(false);
      };

      if (hasPausedOverlay) {
        // If we have a paused overlay, set a timeout with a duration of the overlay's fade
        // transition since we want to keep the video playing until the overlay has fully
        // faded in and hidden it.
        mutableVideoState.current.pauseTimeout = window.setTimeout(
          stopVideo,
          overlayTransitionDuration
        );
      } else {
        // If we don't have a paused overlay, pause right away!
        stopVideo();
      }
    }
  }, [
    attemptToPauseVideo,
    attemptToPlayVideo,
    clearVideoStateTimeouts,
    hasLoadingOverlay,
    hasPausedOverlay,
    loadingStateTimeout,
    overlayTransitionDuration,
    shouldPlayVideo,
    videoRef,
  ]);

  return [overlayState, isVideoActive];
}
