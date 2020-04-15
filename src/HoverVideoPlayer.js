import React from 'react';
import { css, cx } from 'emotion';
import { formatVideoSrc, formatVideoCaptions } from './utils';

// Noop function does nothing - used as default for optional callbacks
const noop = () => {};

// Enumerates states that the hover player can be in
const HOVER_PLAYER_STATE = {
  stopped: 1,
  loading: 2,
  playing: 3,
};
// Enumerates states that the video can be in
const VIDEO_STATE = {
  paused: 0,
  loadingPlayOnReady: 1,
  loadingPlaybackCancelled: 2,
  playing: 3,
};

// Set up our emotion CSS classes
const basePlayerContainerStyle = css`
  position: relative;
`;

const expandToCoverPlayerStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
`;

const basePausedOverlayStyle = css`
  position: relative;
  display: block;
  width: 100%;
  z-index: 1;
  pointer-events: none;

  /* By default the paused overlay should be set to fill its available width */
  > * {
    display: block;
    width: 100%;
  }
`;

const baseLoadingOverlayStyle = css`
  z-index: 2;
  pointer-events: none;
`;

const baseVideoStyle = css`
  width: 100%;
  display: block;
  object-fit: cover;
`;

/**
 * @typedef   {object}  VideoSource
 * @property  {string}  src - The src URL string to use for a video player source
 * @property  {string}  type - The media type of the video, ie 'video/mp4'
 */

/**
 * @typedef   {object}  VideoCaptionsTrack
 * @property  {string}  src - The src URL string for the captions track file
 * @property  {string}  srcLang - The language code for the language that these captions are in
 * @property  {string}  label - The title of the captions track
 */

/**
 * @component HoverVideoPlayer
 *
 * @param {!(string|string[]|VideoSource|VideoSource[])}  videoSrc - Source(s) to use for the video player. Accepts 3 different formats:
 *                                                                   - **String**: the URL string to use as the video player's src
 *                                                                   - **Object**: an object with attributes:
 *                                                                     - src: The src URL string to use for a video player source
 *                                                                     - type: The media type of the video source, ie 'video/mp4'
 *                                                                   - **Array**: if you would like to provide multiple sources, you can provide an array of URL strings and/or objects with the shape described above
 * @param {!(string|string[]|VideoCaptionsTrack|VideoCaptionsTrack[])} videoCaptions - Captions track(s) to use for the video player for accessibility. Accepts 3 different formats:
 *                                                                                     - **String**: the URL string to use as the captions track's src
 *                                                                                     - **Object**: an object with attributes:
 *                                                                                       - src: The src URL string for the captions track file
 *                                                                                       - srcLang: The language code for the language that these captions are in (ie, 'en', 'es', 'fr')
 *                                                                                       - label: The title of the captions track
 *                                                                                     - **Array**: if you would like to provide multiple caption tracks, you can provide an array of objects with the shape described above
 * @param {bool}    [isFocused=false] - Offers a prop interface for forcing the video to start/stop without DOM events
 *                                        When set to true, the video will begin playing and any events that would normally
 *                                        stop it will be ignored
 * @param {node}    [pausedOverlay] - Contents to render over the video while it's not playing
 * @param {node}    [loadingOverlay] - Contents to render over the video while it's loading
 * @param {number}  [loadingStateTimeoutDuration=400] - Duration in ms to wait after attempting to start the video before showing the loading overlay
 * @param {number}  [overlayFadeTransitionDuration=400] - The transition duration in ms for how long it should take for the overlay to fade in/out
 * @param {bool}    [shouldRestartOnVideoStopped=true] - Whether the video should reset to the beginning every time it stops playing after the user mouses out of the player
 * @param {bool}    [shouldUseOverlayDimensions=true] - Whether the player should display using the pausedOverlay's dimensions rather than the video element's dimensions if an overlay is provided
 *                                                        This helps prevent content height jumps when the video loads its dimensions
 * @param {func}    [onStartingVideo] - Optional callback for every time the user mouses over or focuses on the hover player and we attempt to start the video
 * @param {func}    [onStartedVideo] - Optional callback for when the video has been successfully started
 * @param {func}    [onStoppingVideo] - Optional callback for every time the user mouses out or blurs the hover player and we attempt to stop the video
 * @param {func}    [onStoppedVideo] - Optional callback for when the video has successfully been stopped
 * @param {func}    [onVideoPlaybackFailed] - Optional callback for when the video throws an error while attempting to play
 * @param {bool}    [isVideoMuted=true] - Whether the video player should be muted
 * @param {bool}    [shouldShowVideoControls=false] - Whether the video player should show the browser's controls
 * @param {bool}    [shouldVideoLoop=true] - Whether the video player should loop when it reaches the end
 * @param {string}  [className] - Optional className to apply custom styling to the container element
 * @param {string}  [pausedOverlayWrapperClassName] - Optional className to apply custom styling to the overlay contents' wrapper
 * @param {string}  [loadingOverlayWrapperClassName] - Optional className to apply custom styling to the loading state overlay contents' wrapper
 * @param {string}  [videoClassName] - Optional className to apply custom styling to the video element
 * @param {object}  [style] - Style object to apply custom CSS styles to the hover player container
 *
 * @license MIT
 */
function HoverVideoPlayer({
  videoSrc,
  videoCaptions,
  isFocused = false,
  pausedOverlay = null,
  loadingOverlay = null,
  loadingStateTimeoutDuration = 400,
  overlayFadeTransitionDuration = 400,
  shouldRestartOnVideoStopped = true,
  shouldUseOverlayDimensions = true,
  onStartingVideo = noop,
  onStartedVideo = noop,
  onStoppingVideo = noop,
  onStoppedVideo = noop,
  onVideoPlaybackFailed = noop,
  isVideoMuted = true,
  shouldShowVideoControls = false,
  shouldVideoLoop = true,
  className = '',
  pausedOverlayWrapperClassName = '',
  loadingOverlayWrapperClassName = '',
  videoClassName = '',
  style = null,
}) {
  const [hoverPlayerState, setHoverPlayerState] = React.useState(
    HOVER_PLAYER_STATE.stopped
  );

  const containerRef = React.useRef();
  const videoRef = React.useRef();

  // Make a ref for holding all of our variables that we want to
  // keep track of and update without triggering a re-render
  const mutableStateRef = React.useRef(null);

  if (mutableStateRef.current === null) {
    // Set up the mutable state with initial values
    mutableStateRef.current = {
      videoState: VIDEO_STATE.paused,
      pauseTimeout: null,
      loadingTimeout: null,
    };
  }

  // Parse the `videoSrc` prop into an array of VideoSource objects to be used for the video player
  const parsedVideoSources = React.useMemo(() => formatVideoSrc(videoSrc), [
    videoSrc,
  ]);

  // Parse the `videoCaptions` prop into an array of VideoCaptionsTrack objects to be used for
  // captions tracks for the video player
  const parsedVideoCaptions = React.useMemo(
    () => formatVideoCaptions(videoCaptions),
    [videoCaptions]
  );

  /**
   * Pauses the video and resets it if necessary
   */
  const pauseVideo = React.useCallback(() => {
    // Pause the video
    videoRef.current.pause();
    // Update our video state to reflect that the video is now paused
    mutableStateRef.current.videoState = VIDEO_STATE.paused;

    if (shouldRestartOnVideoStopped) {
      // If we should restart the video, reset its time to the beginning
      videoRef.current.currentTime = 0;
    }
  }, [shouldRestartOnVideoStopped]);

  /**
   * @function  attemptStartVideo
   *
   * Starts the video and fades the paused overlay out when the user mouses over or focuses in the video container element
   */
  const attemptStartVideo = React.useCallback(() => {
    // If the user quickly moved their mouse away and then back over the container,
    // cancel any outstanding timeout that would pause the video
    clearTimeout(mutableStateRef.current.pauseTimeout);

    // Return early if we're already playing or attempting to play
    if (
      hoverPlayerState !== HOVER_PLAYER_STATE.stopped &&
      mutableStateRef.current.videoState !== VIDEO_STATE.paused
    )
      return;

    // Fire onStartingVideo callback to indicate the video is attempting to start
    onStartingVideo();

    if (mutableStateRef.current.videoState === VIDEO_STATE.playing) {
      // If the video was already loaded and playing, just update the state to reflect that
      setHoverPlayerState(HOVER_PLAYER_STATE.playing);
      // Fire onStartedVideo callback to indicate that the video is still playing as normal
      onStartedVideo();
      return;
    }

    // Set a timeout to start showing a loading state if the video doesn't start playing
    // after a given amount of time
    clearTimeout(mutableStateRef.current.loadingTimeout);
    mutableStateRef.current.loadingTimeout = setTimeout(() => {
      // If the video is still loading when this timeout completes, transition the
      // player to show a loading state
      setHoverPlayerState(HOVER_PLAYER_STATE.loading);
    }, loadingStateTimeoutDuration);

    if (mutableStateRef.current.videoState === VIDEO_STATE.paused) {
      const onPlaybackRejected = (error) => {
        // Cancel the loading state timeout if it is still active
        clearTimeout(mutableStateRef.current.loadingTimeout);
        // Change the video state back to paused
        mutableStateRef.current.videoState = VIDEO_STATE.paused;
        // Fire callback indicating playback failed
        onVideoPlaybackFailed(error);
        // Log the error that occurred
        console.error('HoverVideoPlayer playback failed:', error);
      };

      const onPlaybackResolved = () => {
        // Cancel the loading state timeout if it is still active
        clearTimeout(mutableStateRef.current.loadingTimeout);

        if (
          mutableStateRef.current.videoState ===
          VIDEO_STATE.loadingPlaybackCancelled
        ) {
          // If the video's playback was cancelled before it finished loading, pause it immediately
          pauseVideo();
        } else {
          // Update our states to indicate the video is now playing
          mutableStateRef.current.videoState = VIDEO_STATE.playing;
          setHoverPlayerState(HOVER_PLAYER_STATE.playing);
          // Fire callback indicating playback succeeded
          onStartedVideo();
        }
      };

      // Attempt to play the video and store the return value from play()
      // In most modern browsers, it should return a promise we can use
      // to keep track of when the play attempt has succeeded or failed
      const videoPlayPromise = videoRef.current.play();

      // Check that the return value from play() is in fact a Promise
      if (videoPlayPromise && videoPlayPromise.then) {
        // If we have a play promise, use that to update our state
        videoPlayPromise
          .catch(onPlaybackRejected)
          .then(onPlaybackResolved, onPlaybackRejected);
      } else {
        // If we don't have a play promise, we'll have to use traditional
        // event listeners to keep track of when the video playback succeeds/fails
        videoRef.current.onplaying = onPlaybackResolved;
        videoRef.current.onerror = onPlaybackRejected;
      }
    }

    // If the video isn't playing, indicate that it's now in the process of attempting to play
    mutableStateRef.current.videoState = VIDEO_STATE.loadingPlayOnReady;
  }, [
    hoverPlayerState,
    loadingStateTimeoutDuration,
    onStartedVideo,
    onStartingVideo,
    onVideoPlaybackFailed,
    pauseVideo,
  ]);

  /**
   * @function  attemptStopVideo
   *
   * Stops the video and fades the paused overlay in when the user mouses out from or blurs the video container element
   */
  const attemptStopVideo = React.useCallback(() => {
    // If a timeout for showing the loading state is active, cancel it
    // since we want to stay in a stopped state
    clearTimeout(mutableStateRef.current.loadingTimeout);

    // If the isFocused override prop is active, ignore any other events attempting to stop the video
    if (
      isFocused ||
      (hoverPlayerState === HOVER_PLAYER_STATE.stopped &&
        mutableStateRef.current.videoState === VIDEO_STATE.paused)
    )
      return;

    // Mark that the video is now stopped and we should revert to just
    // showing the paused overlay
    setHoverPlayerState(HOVER_PLAYER_STATE.stopped);

    // Fire onStoppingVideo callback
    onStoppingVideo();

    if (mutableStateRef.current.videoState === VIDEO_STATE.loadingPlayOnReady) {
      // If the video is still loading, we don't want to interrupt its play promise when we pause
      // We will update the video state to mark that the play attempt is "cancelled" so the video
      // should be paused immediately after the play promise resolves
      mutableStateRef.current.videoState = VIDEO_STATE.loadingPlaybackCancelled;
    }

    // Set a timeout with the duration of the overlay's fade transition so the video
    // won't stop until it's fully hidden
    clearTimeout(mutableStateRef.current.pauseTimeout);
    mutableStateRef.current.pauseTimeout = setTimeout(
      () => {
        // Fire onStoppedVideo callback to indicate the video has been stopped
        onStoppedVideo();

        if (mutableStateRef.current.videoState === VIDEO_STATE.playing) {
          // If the video is currently playing, we can safely pause it
          pauseVideo();
        }
      },
      // If we don't have to wait for the overlay to fade back in, just set the timeout to 0 to invoke it ASAP
      pausedOverlay ? overlayFadeTransitionDuration : 0
    );
  }, [
    hoverPlayerState,
    isFocused,
    onStoppedVideo,
    onStoppingVideo,
    overlayFadeTransitionDuration,
    pauseVideo,
    pausedOverlay,
  ]);

  React.useEffect(() => {
    // Use effect to start/stop the video when isFocused override prop changes
    if (isFocused) {
      attemptStartVideo();
    } else {
      attemptStopVideo();
    }

    // We really only want to fire this effect when the isFocused prop changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  React.useEffect(() => {
    const onWindowTouchStart = (event) => {
      if (!containerRef.current.contains(event.target)) {
        attemptStopVideo();
      }
    };

    window.addEventListener('touchstart', onWindowTouchStart);

    // Remove the event listener on cleanup
    return () => window.removeEventListener('touchstart', onWindowTouchStart);
  }, [attemptStopVideo]);

  React.useEffect(() => {
    // Manually setting the `muted` attribute on the video element via an effect in order
    // to avoid a know React issue with the `muted` prop not applying correctly on initial render
    // https://github.com/facebook/react/issues/10389
    videoRef.current.muted = isVideoMuted;
  }, [isVideoMuted]);

  React.useEffect(() => {
    // Ensure casting controls aren't shown on the video
    videoRef.current.disableRemotePlayback = true;

    return () => {
      // Clear any outstanding timeouts when the component unmounts to prevent memory leaks
      clearTimeout(mutableStateRef.current.loadingTimeout);
      clearTimeout(mutableStateRef.current.pauseTimeout);
    };
  }, []);

  // The video should use the overlay's dimensions rather than the other way around if
  //  an overlay was provided and the shouldUseOverlayDimensions is true
  const shouldVideoExpandToFitOverlayDimensions =
    pausedOverlay && shouldUseOverlayDimensions;

  return (
    <div
      onMouseEnter={attemptStartVideo}
      onFocus={attemptStartVideo}
      onMouseOut={attemptStopVideo}
      onBlur={attemptStopVideo}
      onTouchStart={attemptStartVideo}
      className={cx(basePlayerContainerStyle, className)}
      style={style}
      data-testid="hover-video-player-container"
      ref={containerRef}
    >
      {pausedOverlay && (
        <div
          style={{
            opacity: hoverPlayerState !== HOVER_PLAYER_STATE.playing ? 1 : 0,
            transition: `opacity ${overlayFadeTransitionDuration}ms`,
          }}
          className={cx(
            basePausedOverlayStyle,
            {
              [expandToCoverPlayerStyle]: !shouldVideoExpandToFitOverlayDimensions,
            },
            pausedOverlayWrapperClassName
          )}
          data-testid="paused-overlay-wrapper"
        >
          {pausedOverlay}
        </div>
      )}
      {loadingOverlay && (
        <div
          style={{
            opacity: hoverPlayerState === HOVER_PLAYER_STATE.loading ? 1 : 0,
            transition: `opacity ${overlayFadeTransitionDuration}ms`,
          }}
          className={cx(
            baseLoadingOverlayStyle,
            expandToCoverPlayerStyle,
            loadingOverlayWrapperClassName
          )}
          data-testid="loading-overlay-wrapper"
        >
          {loadingOverlay}
        </div>
      )}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        controls={shouldShowVideoControls}
        loop={shouldVideoLoop}
        playsInline
        // Only preload video data if we depend on having loaded its dimensions to display it
        preload={shouldVideoExpandToFitOverlayDimensions ? 'none' : 'metadata'}
        ref={videoRef}
        className={cx(
          baseVideoStyle,
          {
            [expandToCoverPlayerStyle]: shouldVideoExpandToFitOverlayDimensions,
          },
          videoClassName
        )}
      >
        {parsedVideoSources.map(({ src, type }) => (
          <source key={src} src={src} type={type} />
        ))}
        {parsedVideoCaptions.map(({ src, srcLang, label }) => (
          <track
            key={src}
            kind="captions"
            src={src}
            srcLang={srcLang}
            label={label}
          />
        ))}
      </video>
    </div>
  );
}

export default HoverVideoPlayer;
