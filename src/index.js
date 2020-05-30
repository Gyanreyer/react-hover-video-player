import React from 'react';

import { formatVideoSrc, formatVideoCaptions } from './utils';

// Enumerates states that the hover player can be in
const HOVER_PLAYER_STATE = {
  paused: 'paused',
  loading: 'loading',
  playing: 'playing',
};

// Enumerates sizing modes which define how the player's contents should be sized relative to each other
const SIZING_MODES = {
  // Everything should be sized based on the paused overlay's dimensions - the video element will expand to fill that space
  overlay: 'overlay',
  // Everything should be sized based on the video element's dimensions - the overlays will expand to cover the video
  video: 'video',
  // Everything should be sized based on the player's outer container div - the overlays and video will all expand to cover
  // the container
  container: 'container',
  // Manual mode does not apply any special styling and allows the developer to exercise full control
  // over how everything should be sized - this means you will likely need to provide your own custom styling for
  // both the paused overlay and the video element
  manual: 'manual',
};

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

// CSS styles to make some contents in the player expand to fill the container
const expandToFillContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

// Styles to apply to the paused overlay wrapper and video element for different sizing modes
const pausedOverlayWrapperSizingStyles = {
  [SIZING_MODES.overlay]: {
    position: 'relative',
  },
  [SIZING_MODES.video]: expandToFillContainerStyle,
  [SIZING_MODES.container]: expandToFillContainerStyle,
  [SIZING_MODES.manual]: null,
};

const videoSizingStyles = {
  [SIZING_MODES.overlay]: expandToFillContainerStyle,
  [SIZING_MODES.video]: {
    display: 'block',
    width: '100%',
  },
  [SIZING_MODES.container]: expandToFillContainerStyle,
  [SIZING_MODES.manual]: null,
};

/**
 * @component HoverVideoPlayer
 *
 * @param {!(string|string[]|VideoSource|VideoSource[])}  videoSrc - Source(s) to use for the video player. Accepts 3 different formats:
 *                                                                   - **String**: the URL string to use as the video player's src
 *                                                                   - **Object**: an object with attributes:
 *                                                                     - src: The src URL string to use for a video player source
 *                                                                     - type: The media type of the video source, ie 'video/mp4'
 *                                                                   - **Array**: if you would like to provide multiple sources, you can provide an array of URL strings and/or objects with the shape described above
 * @param {!(string|string[]|VideoCaptionsTrack|VideoCaptionsTrack[])} [videoCaptions] - Captions track(s) to use for the video player for accessibility. Accepts 3 different formats:
 *                                                                                      - **String**: the URL string to use as the captions track's src
 *                                                                                      - **Object**: an object with attributes:
 *                                                                                        - src: The src URL string for the captions track file
 *                                                                                        - srcLang: The language code for the language that these captions are in (ie, 'en', 'es', 'fr')
 *                                                                                        - label: The title of the captions track
 *                                                                                        - default: Whether this track should be used by default if the user's preferences don't match an available srcLang
 *                                                                                      - **Array**: if you would like to provide multiple caption tracks, you can provide an array of objects with the shape described above
 * @param {bool}    [focused=false] - Offers a prop interface for forcing the video to start/stop without DOM events
 *                                      When set to true, the video will begin playing and any events that would normally stop it will be ignored
 * @param {bool}    [disableDefaultEventHandling] - Whether the video player's default mouse and touch event handling should be disabled in favor of a fully custom solution using the `focused` prop
 * @param {node}    [pausedOverlay] - Contents to render over the video while it's not playing
 * @param {node}    [loadingOverlay] - Contents to render over the video while it's loading
 * @param {number}  [loadingStateTimeout=200] - Duration in ms to wait after attempting to start the video before showing the loading overlay
 * @param {number}  [overlayTransitionDuration=400] - The transition duration in ms for how long it should take for the overlay to fade in/out
 * @param {bool}    [restartOnPaused=false] - Whether the video should reset to the beginning every time it stops playing after the user mouses out of the player
 * @param {bool}    [unloadVideoOnPaused=false] - Whether we should unload the video's sources when it is not playing in order to free up memory and bandwidth
 *                                                  This can be useful in scenarios where you may have a large number of relatively large video files on a single page;
 *                                                  particularly due to a known bug in Google Chrome, if too many videos are loading in the background at the same time,
 *                                                  it starts to gum up the works so that nothing loads properly and performance can degrade significantly.
 * @param {bool}    [muted=true] - Whether the video player should be muted
 * @param {bool}    [loop=true] - Whether the video player should loop when it reaches the end
 * @param {string}  [preload] - Sets how much information the video element should preload before being played. Accepts one of the following values:
 *                              - **"none"**: Nothing should be preloaded before the video is played
 *                              - **"metadata"**: Only the video's metadata (ie length, dimensions) should be preloaded
 *                              - **"auto"**: The whole video file should be preloaded even if it won't be played
 * @param {string}  [className] - Optional className to apply custom styling to the container element
 * @param {object}  [style] - Style object to apply custom inlined styles to the hover player container
 * @param {string}  [pausedOverlayWrapperClassName] - Optional className to apply custom styling to the overlay contents' wrapper
 * @param {object}  [pausedOverlayWrapperStyle] - Style object to apply custom inlined styles to the paused overlay wrapper
 * @param {string}  [loadingOverlayWrapperClassName] - Optional className to apply custom styling to the loading state overlay contents' wrapper
 * @param {object}  [loadingOverlayWrapperStyle] - Style object to apply custom inlined styles to the loading overlay wrapper
 * @param {string}  [videoClassName] - Optional className to apply custom styling to the video element
 * @param {object}  [videoStyle] - Style object to apply custom inlined styles to the video element
 * @param {string}  [sizingMode='video'] - Describes sizing mode to use to determine how the player's contents should be styled. Accepts 4 possible values:
 *                                         - **"video"**: Everything should be sized based on the video element's dimensions - the overlays will expand to cover the video
 *                                         - **"overlay"**: Everything should be sized based on the paused overlay's dimensions - the video element will expand to fit inside those dimensions
 *                                         - **"container"**: Everything should be sized based on the player's outer container div - the overlays and video will all expand to cover the container
 *                                         - **"manual"**: Manual mode does not apply any special styling and allows the developer to exercise full control over how everything should be sized - this means you will likely need to provide your own custom styling for both the paused overlay and the video element
 *
 * @license MIT
 */
export default function HoverVideoPlayer({
  videoSrc,
  videoCaptions = null,
  focused = false,
  disableDefaultEventHandling = false,
  pausedOverlay = null,
  loadingOverlay = null,
  loadingStateTimeout = 200,
  overlayTransitionDuration = 400,
  restartOnPaused = false,
  unloadVideoOnPaused = false,
  muted = true,
  loop = true,
  preload = null,
  className = '',
  style = null,
  pausedOverlayWrapperClassName = '',
  pausedOverlayWrapperStyle = null,
  loadingOverlayWrapperClassName = '',
  loadingOverlayWrapperStyle = null,
  videoClassName = '',
  videoStyle = null,
  sizingMode = SIZING_MODES.video,
}) {
  // Keep track of state to determine how the paused and loading overlays should be displayed
  const [overlayState, setOverlayState] = React.useState(
    HOVER_PLAYER_STATE.paused
  );
  // Keep track of whether the video is unloaded, meaning its sources should be removed from
  // the DOM and unloaded for optimization purposes
  // This is only relevant if `unloadVideoOnPaused` is set to true
  const [isVideoUnloaded, setIsVideoUnloaded] = React.useState(
    unloadVideoOnPaused
  );

  // Keep refs to previous state values for comparison in effect hooks
  const previousIsVideoUnloadedRef = React.useRef(isVideoUnloaded);
  const previousFocusedRef = React.useRef(false);

  // Keep a ref for all state variables related to the video's state
  // which need to be managed asynchronously as it attempts to play/pause
  const mutableVideoState = React.useRef(null);

  if (mutableVideoState.current === null) {
    // Set initial values for our video state
    mutableVideoState.current = {
      isPlayAttemptInProgress: false,
      isPlayAttemptCancelled: false,
      isPlayerUnmounted: false,
      // Keep refs for timeouts so we can keep track of and cancel them
      pauseTimeout: null,
      loadingStateTimeout: null,
      // Keep track of the video time that we should start from when the video is played again
      // This is particularly useful so we can restore our previous place in the video even if
      // we are unloading it every time it gets paused
      videoTimeToRestore: 0,
    };
  }

  // Element refs
  const containerRef = React.useRef(null);
  const videoRef = React.useRef(null);

  /**
   * @function  pauseVideo
   *
   * Pauses the video and unloads it if necessary
   */
  const pauseVideo = React.useCallback(() => {
    const videoElement = videoRef.current;

    videoElement.pause();

    if (restartOnPaused) {
      // If we should restart the video, reset its time to the beginning next time we play
      videoElement.currentTime = 0;
    }

    // Hang onto the time that the video is currently at so we can restore it when we try to play
    // again even if the video was unloaded
    mutableVideoState.current.videoTimeToRestore = videoElement.currentTime;

    if (unloadVideoOnPaused) {
      // If necessary, unload the video now that it's paused
      setIsVideoUnloaded(true);
    }
  }, [restartOnPaused, unloadVideoOnPaused]);

  /**
   * @function playVideo
   *
   * Attempts to play the video if it is not already playing
   */
  const playVideo = React.useCallback(() => {
    // Clear any timeouts that may have been in progress
    clearTimeout(mutableVideoState.current.pauseTimeout);
    clearTimeout(mutableVideoState.current.loadingStateTimeout);

    const videoElement = videoRef.current;

    // Make sure our play attempt is no longer cancelled since the user is hovering on it again
    mutableVideoState.current.isPlayAttemptCancelled = false;

    // If the video is already playing, just make sure we keep the overlays hidden
    if (getVideoState(videoElement) === VIDEO_STATE.playing) {
      setOverlayState(HOVER_PLAYER_STATE.playing);
      return;
    }

    if (loadingOverlay) {
      // If we have a loading overlay, start a timeout to fade it in if it takes too long
      // for playback to start
      mutableVideoState.current.loadingStateTimeout = setTimeout(() => {
        // If the video is still loading when this timeout completes, transition the
        // player to show a loading state
        setOverlayState(HOVER_PLAYER_STATE.loading);
      }, loadingStateTimeout);
    }

    // If a play attempt is already in progress, don't start a new one
    if (mutableVideoState.current.isPlayAttemptInProgress) return;

    // We are now attempting to play the video
    mutableVideoState.current.isPlayAttemptInProgress = true;

    // Ensure we're at the correct video time to start playing from
    videoElement.currentTime = mutableVideoState.current.videoTimeToRestore;

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
        videoElement.addEventListener('playing', onVideoPlaybackStarted);

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

    playPromise
      .then(() => {
        // If the player was unmounted before the play promise could resolve, don't do anything
        if (mutableVideoState.current.isPlayerUnmounted) return;

        if (mutableVideoState.current.isPlayAttemptCancelled) {
          // If the play attempt was cancelled, immediately pause the video
          pauseVideo();
        } else {
          // If the play attempt wasn't cancelled, hide the overlays to reveal the video now that it's playing
          setOverlayState(HOVER_PLAYER_STATE.playing);
        }
      })
      .catch((error) => {
        console.error(
          `HoverVideoPlayer playback failed for src ${videoElement.currentSrc}:`,
          error
        );

        // Revert to paused state
        pauseVideo();
      })
      .finally(() => {
        // The play attempt is now complete
        mutableVideoState.current.isPlayAttemptInProgress = false;
        mutableVideoState.current.isPlayAttemptCancelled = false;
        clearTimeout(mutableVideoState.current.loadingStateTimeout);
      });
  }, [loadingOverlay, loadingStateTimeout, pauseVideo]);

  /**
   * @function  onHoverStart
   *
   * Starts the video when the user mouses hovers on the player
   */
  const onHoverStart = React.useCallback(() => {
    if (isVideoUnloaded) {
      // If the video is currently unloaded, we need to make sure we update our state
      // to restore the video's sources before we attempt to play it
      setIsVideoUnloaded(false);
    } else {
      playVideo();
    }
  }, [isVideoUnloaded, playVideo]);

  /**
   * @function  onHoverEnd
   *
   * Stops the video and fades the paused overlay in when the user stops hovering on the player
   */
  const onHoverEnd = React.useCallback(() => {
    // Clear any timeouts that may have been in progress
    clearTimeout(mutableVideoState.current.pauseTimeout);
    clearTimeout(mutableVideoState.current.loadingStateTimeout);

    const videoElement = videoRef.current;

    // If the focused override prop is active, ignore any other events attempting to stop the video
    // Also don't do anything if the video is already paused
    if (focused || getVideoState(videoElement) === VIDEO_STATE.paused) return;

    // Start fading the paused overlay back in
    setOverlayState(HOVER_PLAYER_STATE.paused);

    if (mutableVideoState.current.isPlayAttemptInProgress) {
      // If we have a play attempt in progress, mark that the play attempt should be cancelled
      // so that as soon as the promise resolves, the video should be paused
      mutableVideoState.current.isPlayAttemptCancelled = true;
    } else if (pausedOverlay) {
      // If we have a paused overlay, set a timeout with a duration of the overlay's fade
      // transition since we want to keep the video playing until the overlay has fully
      // faded in and hidden it.
      mutableVideoState.current.pauseTimeout = setTimeout(
        () => pauseVideo(),
        overlayTransitionDuration
      );
    } else {
      // If a play attempt isn't in progress and there is no paused overlay, just pause
      pauseVideo();
    }
  }, [focused, overlayTransitionDuration, pauseVideo, pausedOverlay]);

  /* ~~~~ EFFECTS ~~~~ */
  React.useEffect(() => {
    // If the focused prop hasn't changed, don't do anything
    if (previousFocusedRef.current === focused) return;

    // Use effect to start/stop the video when focused override prop changes
    if (focused) {
      onHoverStart();
    } else {
      onHoverEnd();
    }

    previousFocusedRef.current = focused;
  }, [focused, onHoverEnd, onHoverStart]);

  React.useEffect(() => {
    // If default event handling is disabled, we shouldn't check for touch events outside of the player
    if (disableDefaultEventHandling) return undefined;

    // Event listener pauses the video when the user touches somewhere outside of the player
    function onWindowTouchStart(event) {
      if (!containerRef.current.contains(event.target)) {
        onHoverEnd();
      }
    }

    window.addEventListener('touchstart', onWindowTouchStart);

    // Remove the event listener on cleanup
    return () => window.removeEventListener('touchstart', onWindowTouchStart);
  }, [disableDefaultEventHandling, onHoverEnd]);

  React.useEffect(() => {
    // Manually setting the `muted` attribute on the video element via an effect in order
    // to avoid a know React issue with the `muted` prop not applying correctly on initial render
    // https://github.com/facebook/react/issues/10389
    videoRef.current.muted = muted;
  }, [muted]);

  React.useEffect(() => {
    // Don't do anything if the video's unloaded state hasn't changed
    if (previousIsVideoUnloadedRef.current === isVideoUnloaded) return;

    // Since the video's sources have changed, perform a manual load to update
    // or unload the video's current source
    videoRef.current.load();

    if (!isVideoUnloaded) {
      // If the video was just changed from being unloaded, that means we're trying to play,
      // so let's kick off a play attempt now that the video's sources are restored
      playVideo();
    }

    previousIsVideoUnloadedRef.current = isVideoUnloaded;
  }, [isVideoUnloaded, onHoverStart, playVideo]);

  React.useEffect(() => {
    const videoElement = videoRef.current;
    // Ensure casting and PiP controls aren't shown on the video
    videoElement.disableRemotePlayback = true;
    videoElement.disablePictureInPicture = true;

    return () => {
      // Clear any outstanding timeouts when the component unmounts to prevent memory leaks
      clearTimeout(mutableVideoState.current.pauseTimeout);
      clearTimeout(mutableVideoState.current.loadingStateTimeout);

      // Mark that the player is unmounted so that we won't try to update the component state
      // if the play promise resolves afterward
      mutableVideoState.current.isPlayerUnmounted = true;

      // Clean up the sources for the video to avoid potential memory leaks
      // It's debatable how necessary this really is but playing it safe never hurts
      const videoSourceElements = videoElement.getElementsByTagName('source');
      for (
        let i = 0, videoSourceCount = videoSourceElements.length;
        i < videoSourceCount;
        i += 1
      ) {
        videoSourceElements[i].src = '';
        videoSourceElements[i].removeAttribute('src');
      }
      videoElement.load();
    };
  }, []);
  /* ~~~~ END EFFECTS ~~~~ */

  return (
    <div
      onMouseEnter={disableDefaultEventHandling ? null : onHoverStart}
      onMouseLeave={disableDefaultEventHandling ? null : onHoverEnd}
      onTouchStart={disableDefaultEventHandling ? null : onHoverStart}
      data-testid="hover-video-player-container"
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {pausedOverlay && (
        <div
          style={{
            ...pausedOverlayWrapperSizingStyles[sizingMode],
            zIndex: 1,
            opacity: overlayState !== HOVER_PLAYER_STATE.playing ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms`,
            ...pausedOverlayWrapperStyle,
          }}
          className={pausedOverlayWrapperClassName}
          data-testid="paused-overlay-wrapper"
        >
          {pausedOverlay}
        </div>
      )}
      {loadingOverlay && (
        <div
          style={{
            ...expandToFillContainerStyle,
            zIndex: 2,
            opacity: overlayState === HOVER_PLAYER_STATE.loading ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms`,
            ...loadingOverlayWrapperStyle,
          }}
          className={loadingOverlayWrapperClassName}
          data-testid="loading-overlay-wrapper"
        >
          {loadingOverlay}
        </div>
      )}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        loop={loop}
        playsInline
        preload={preload}
        ref={videoRef}
        style={{
          ...videoSizingStyles[sizingMode],
          objectFit: 'cover',
          ...videoStyle,
        }}
        className={videoClassName}
        data-testid="video-element"
      >
        {!isVideoUnloaded &&
          // If the video is not unloaded, parse the `videoSrc` prop into an array of objects and render them
          // as sources for the video
          formatVideoSrc(videoSrc).map(({ src, type }) => (
            <source key={src} src={src} type={type} />
          ))}
        {/*  Parse the `videoCaptions` prop into an array of VideoCaptionsTrack objects and render them
              as caption tracks for the video */}
        {formatVideoCaptions(videoCaptions).map(
          ({ src, srcLang, label, default: isDefault }) => (
            <track
              key={src}
              kind="captions"
              src={src}
              srcLang={srcLang}
              label={label}
              default={isDefault}
            />
          )
        )}
      </video>
    </div>
  );
}
