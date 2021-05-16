import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
} from 'react';

import {
  expandToFillContainerStyle,
  pausedOverlayWrapperSizingStyles,
  videoSizingStyles,
} from './HoverVideoPlayer.styles';
import {
  HoverVideoPlayerProps,
  VideoSource,
  VideoSrcProp,
  VideoCaptionsTrack,
  VideoCaptionsProp,
} from './HoverVideoPlayer.types';

/**
 * @function  formatVideoSrc
 *
 * Takes a videoSrc value and formats it as an array of VideoSource objects which can be used to render
 * <source> elements for the video
 *
 * @param {VideoSrcProp}  videoSrc - Source(s) to format into VideoSource objects so they can be added to the video player.
 *
 * @returns {VideoSource[]} Array of formatted VideoSource objects which can be used to render <source> elements for the video
 */
function formatVideoSrc(videoSrc: VideoSrcProp): VideoSource[] {
  const formattedVideoSources = [];

  if (videoSrc == null) {
    // A videoSrc value is required in order to make the video player work
    console.error(
      "Error: 'videoSrc' prop is required for HoverVideoPlayer component"
    );
  } else {
    // Make sure we can treat the videoSrc value as an array
    const rawVideoSources = Array.isArray(videoSrc) ? videoSrc : [videoSrc];

    // Parse our video source values into an array of VideoSource objects that can be used to render sources for the video
    for (
      let i = 0, numSources = rawVideoSources.length;
      i < numSources;
      i += 1
    ) {
      const source = rawVideoSources[i];

      if (typeof source === 'string') {
        // If the source is a string, it's an src URL so format it into a VideoSource object and add it to the array
        formattedVideoSources.push({ src: source });
      } else if (source && source.src) {
        // If the source is an object with an src, just add it to the array
        formattedVideoSources.push({ src: source.src, type: source.type });
      } else {
        // Log an error if one of the videoSrc values is invalid
        console.error(
          "Error: invalid value provided to HoverVideoPlayer prop 'videoSrc':",
          source
        );
      }
    }
  }

  return formattedVideoSources;
}

/**
 * @function formatVideoCaptions
 *
 * Takes a videoCaptions value and formats it as an array of VideoCaptionsTrack objects which can be used to render
 * <track> elements for the video
 *
 * @param {VideoCaptionsProp} videoCaptions - Captions track(s) to use for the video player for accessibility.
 *
 * @returns {VideoCaptionsTrack[]}  Array of formatted VideoCaptionsTrack objects which can be used to render <track> elements for the video
 */
function formatVideoCaptions(
  videoCaptions: VideoCaptionsProp
): VideoCaptionsTrack[] {
  const formattedVideoCaptions = [];

  // If captions were provided, format them for use for the video
  if (videoCaptions != null) {
    // Make sure we can treat the videoCaptions value as an array
    const rawVideoCaptions = Array.isArray(videoCaptions)
      ? videoCaptions
      : [videoCaptions];

    // Parse our raw video captions values into an array of formatted VideoCaptionsTrack
    // objects that can be used to render caption tracks for the video
    for (
      let i = 0, numCaptions = rawVideoCaptions.length;
      i < numCaptions;
      i += 1
    ) {
      const captions = rawVideoCaptions[i];

      if (captions && captions.src) {
        formattedVideoCaptions.push({
          src: captions.src,
          srcLang: captions.srcLang,
          label: captions.label,
          default: Boolean(captions.default),
        });
      } else {
        // Log an error if one of the videoCaptions values is invalid
        console.error(
          "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
          captions
        );
      }
    }
  }

  return formattedVideoCaptions;
}

// Enumerates states that the hover player's overlay can be in
enum OverlayState {
  // Only the paused overlay is visible, if provided
  paused = 'paused',
  // Both the paused and loading overlays are visible, if provided
  loading = 'loading',
  // No overlays are visible
  playing = 'playing',
}

/**
 * @component HoverVideoPlayer
 * @license MIT
 *
 * @param {HoverVideoPlayerProps} props
 */
const HoverVideoPlayer: React.FC<HoverVideoPlayerProps> = ({
  videoSrc,
  videoCaptions = null,
  focused = false,
  disableDefaultEventHandling = false,
  hoverTargetRef = null,
  pausedOverlay = null,
  loadingOverlay = null,
  loadingStateTimeout = 200,
  overlayTransitionDuration = 400,
  restartOnPaused = false,
  unloadVideoOnPaused = false,
  muted = true,
  volume = 1,
  loop = true,
  preload = null,
  crossOrigin = 'anonymous',
  controls = false,
  controlsList = null,
  disableRemotePlayback = true,
  disablePictureInPicture = true,
  className = null,
  style = null,
  pausedOverlayWrapperClassName = null,
  pausedOverlayWrapperStyle = null,
  loadingOverlayWrapperClassName = null,
  loadingOverlayWrapperStyle = null,
  videoId = null,
  videoClassName = null,
  videoRef: forwardedVideoRef = null,
  videoStyle = null,
  sizingMode = 'video',
}: HoverVideoPlayerProps) => {
  // Keep track of whether the user is hovering over the video and it should therefore be playing or not
  const [isHoveringOverVideo, setIsHoveringOverVideo] = useState(false);
  // Keep track of how the paused and loading overlays should be displayed
  const [overlayState, setOverlayState] = useState(OverlayState.paused);
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  // Keep a ref for all state variables related to the video's state
  // which need to be managed asynchronously as it attempts to play/pause
  const mutableVideoState = useRef(null);

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
      videoTimeToRestore: 0,
    };
  }

  // Element refs
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Forward out local videoRef along to the videoRef prop
  useImperativeHandle(forwardedVideoRef, () => videoRef.current);

  const hasPausedOverlay = Boolean(pausedOverlay);
  const hasLoadingOverlay = Boolean(loadingOverlay);

  // We should attempt to play the video if the user is hovering over it or the `focused` override prop is enabled
  const shouldPlayVideo = isHoveringOverVideo || focused;

  /* ~~~~ EFFECTS ~~~~ */
  // Effect starts and stops the video depending on the current value for `shouldPlayVideo`
  useEffect(
    () => {
      const videoElement = videoRef.current;

      // If shouldPlayVideo is true, attempt to start playing the video
      if (shouldPlayVideo) {
        // Use heuristics to check if the video is already playing.
        if (
          // A video is playing if...
          // The video isn't paused
          !videoElement.paused &&
          // The video hasn't ended
          !videoElement.ended &&
          // The video has loaded enough data that it can play
          // (readyState 3 is HAVE_FUTURE_DATA, meaning the video has loaded enough data that it can play)
          videoElement.readyState >= 3
        ) {
          // If the video is already playing, ensure the overlays are hidden to reflect that!
          setOverlayState(OverlayState.playing);
        } else {
          // If the video is not currently playing, proceed to kick off a loading timeout if needed and attempt to play the video
          // if there isn't already one in progress

          if (hasLoadingOverlay) {
            // If we have a loading overlay, set a timeout to start showing it if the video doesn't start playing
            // before the loading state timeout has elapsed
            mutableVideoState.current.loadingStateTimeout = setTimeout(() => {
              // If this timeout wasn't cancelled, we're still trying to play the video
              // and it's still loading, so fade in the loading overlay
              setOverlayState(OverlayState.loading);
            }, loadingStateTimeout);
          }

          // If videoElement.paused is false that means a play attempt is already in progress so there's no need to actually
          // start attempting to play again. This can happen if the video is taking a long time to load and still hasn't
          // finished since the user has hovered off of the player and then back on again.
          if (videoElement.paused) {
            // Ensure we're at the correct time to start playing from
            videoElement.currentTime =
              mutableVideoState.current.videoTimeToRestore;

            // Start attempting to play
            videoElement.play();
          }
        }
      }
      // Otherwise if shouldPlayVideo is false, go through the process necessary to pause the video
      else {
        // Start fading the paused overlay back in
        setOverlayState(OverlayState.paused);

        // Only proceed to pause the video if it's not already paused
        if (!videoElement.paused) {
          const pauseVideo = () => {
            // If there isn't a play attempt in progress and the video can therefore
            //  safely be paused right away, do it!
            // Otherwise, we'll have to wait for the logic in the video's `onPlaying` event
            // to immediately pause the video as soon as it starts playing, or else we will end up
            // getting an error for interrupting the play promise
            if (!mutableVideoState.current.isPlayAttemptInProgress) {
              videoElement.pause();
            }
          };

          if (hasPausedOverlay) {
            // If we have a paused overlay, set a timeout with a duration of the overlay's fade
            // transition since we want to keep the video playing until the overlay has fully
            // faded in and hidden it.
            mutableVideoState.current.pauseTimeout = setTimeout(
              pauseVideo,
              overlayTransitionDuration
            );
          } else {
            // If we don't have a paused overlay, pause right away!
            pauseVideo();
          }
        }
      }

      return () => {
        // On cleanup, clear any outstanding timeouts since our playback state is changing
        // or the component is unmounting
        clearTimeout(mutableVideoState.current.pauseTimeout);
        clearTimeout(mutableVideoState.current.loadingStateTimeout);
      };
    },
    // Only run the effect when shouldPlayVideo changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shouldPlayVideo]
  );

  // If the video's sources should be unloaded when it's paused, the video is paused, AND we're not currently
  // trying to play, we can unload the video's sources
  const isVideoUnloaded =
    unloadVideoOnPaused && isVideoPaused && !shouldPlayVideo;

  // Effect ensures the video element fully unloads after its <source> tags were removed
  useEffect(() => {
    if (isVideoUnloaded) {
      // Since the video's sources have changed, perform a manual load to update
      // or unload the video's current source
      videoRef.current.load();
    }
  }, [isVideoUnloaded]);

  // Effect adds hover event listeners to the appropriate hover target element so it will start and stop as the user interacts with it
  useEffect(() => {
    // If default event handling is disabled, we shouldn't check for touch events outside of the player
    if (disableDefaultEventHandling) return undefined;

    // If a ref to a custom hover target was provided, we'll use that as our target element,
    // but otherwise just default to our container element
    const hoverTargetElement = (hoverTargetRef || containerRef).current;

    // Add the event listeners
    const onHoverStart = () => setIsHoveringOverVideo(true);
    const onHoverEnd = () => setIsHoveringOverVideo(false);

    // Mouse events
    hoverTargetElement.addEventListener('mouseenter', onHoverStart);
    hoverTargetElement.addEventListener('mouseleave', onHoverEnd);

    // Focus/blur
    hoverTargetElement.addEventListener('focus', onHoverStart);
    hoverTargetElement.addEventListener('blur', onHoverEnd);

    // Touch events
    hoverTargetElement.addEventListener('touchstart', onHoverStart);
    // Event listener pauses the video when the user touches somewhere outside of the player
    const onWindowTouchStart = (event: TouchEvent) => {
      if (!hoverTargetElement.contains(event.target)) {
        onHoverEnd();
      }
    };

    window.addEventListener('touchstart', onWindowTouchStart);

    // Return a cleanup function that removes all event listeners
    return () => {
      hoverTargetElement.removeEventListener('mouseenter', onHoverStart);
      hoverTargetElement.removeEventListener('mouseleave', onHoverEnd);
      hoverTargetElement.removeEventListener('focus', onHoverStart);
      hoverTargetElement.removeEventListener('blur', onHoverEnd);
      hoverTargetElement.removeEventListener('touchstart', onHoverStart);
      window.removeEventListener('touchstart', onWindowTouchStart);
    };
  }, [disableDefaultEventHandling, hoverTargetRef]);

  // Effect sets attributes on the video which can't be done via props
  useEffect(() => {
    const videoElement = videoRef.current;

    // Manually setting the `muted` attribute on the video element via an effect in order
    // to avoid a know React issue with the `muted` prop not applying correctly on initial render
    // https://github.com/facebook/react/issues/10389
    videoElement.muted = muted;
    // Set the video's volume to match the `volume` prop
    // Note that this will have no effect if the `muted` prop is set to true
    videoElement.volume = volume;
    // React does not support directly setting disableRemotePlayback or disablePictureInPicture directly
    // via the video element's props, so make sure we manually set them in an effect
    videoElement.disableRemotePlayback = disableRemotePlayback;
    videoElement.disablePictureInPicture = disablePictureInPicture;
  }, [disablePictureInPicture, disableRemotePlayback, muted, volume]);
  /* ~~~~ END EFFECTS ~~~~ */

  const isPausedOverlayVisible = overlayState !== OverlayState.playing;
  const isLoadingOverlayVisibile = overlayState === OverlayState.loading;

  // Parse the sources and captions into formatted arrays that we can use to
  // render <source> and <track> elements for the video
  const formattedVideoSources = useMemo(() => formatVideoSrc(videoSrc), [
    videoSrc,
  ]);
  const formattedVideoCaptions = useMemo(
    () => formatVideoCaptions(videoCaptions),
    [videoCaptions]
  );

  return (
    <div
      data-testid="hover-video-player-container"
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {hasPausedOverlay && (
        <div
          style={{
            ...pausedOverlayWrapperSizingStyles[sizingMode],
            zIndex: 1,
            opacity: isPausedOverlayVisible ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms`,
            // Disable pointer events on the paused overlay when it's hidden
            pointerEvents: isPausedOverlayVisible ? 'auto' : 'none',
            ...pausedOverlayWrapperStyle,
          }}
          className={pausedOverlayWrapperClassName}
          data-testid="paused-overlay-wrapper"
        >
          {pausedOverlay}
        </div>
      )}
      {hasLoadingOverlay && (
        <div
          style={{
            ...expandToFillContainerStyle,
            zIndex: 2,
            opacity: isLoadingOverlayVisibile ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms`,
            // Disable pointer events on the loading overlay when it's hidden
            pointerEvents: isLoadingOverlayVisibile ? 'auto' : 'none',
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
        crossOrigin={crossOrigin}
        ref={videoRef}
        style={{
          ...videoSizingStyles[sizingMode],
          objectFit: 'cover',
          ...videoStyle,
        }}
        controls={controls}
        controlsList={controlsList}
        className={videoClassName}
        id={videoId}
        onError={() => {
          // Event fired when an error occurred on the video element, usually because something went wrong
          // when attempting to load its source
          console.error(
            `HoverVideoPlayer encountered an error for src "${videoRef.current.currentSrc}".`
          );
        }}
        onPlay={() => {
          // Mark that we now have a play attempt in progress which shouldn't be interrupted
          mutableVideoState.current.isPlayAttemptInProgress = true;
          // The video is no longer paused
          setIsVideoPaused(false);
        }}
        onPlaying={() => {
          // Cancel any state timeouts that may be pending
          clearTimeout(mutableVideoState.current.pauseTimeout);
          clearTimeout(mutableVideoState.current.loadingStateTimeout);

          // The play attempt is now complete
          mutableVideoState.current.isPlayAttemptInProgress = false;

          if (shouldPlayVideo) {
            // Hide the overlays to reveal the video now that it's playing
            setOverlayState(OverlayState.playing);
          } else {
            // If the play attempt just succeeded but we no longer want to play the video,
            // pause it immediately!
            videoRef.current.pause();
          }
        }}
        onPause={() => {
          // Cancel any state timeouts that may be pending
          clearTimeout(mutableVideoState.current.pauseTimeout);
          clearTimeout(mutableVideoState.current.loadingStateTimeout);

          if (restartOnPaused) {
            // If we should restart the video when paused, reset its time to the beginning
            videoRef.current.currentTime = 0;
          }

          // Hang onto the time that the video is currently at so we can
          // restore it when we try to play again
          // This is mainly helpful because the unloadVideoOnPaused prop will cause
          // the video's currentTime to be cleared every time its sources are unloaded
          // after pausing
          mutableVideoState.current.videoTimeToRestore =
            videoRef.current.currentTime;

          // Update that the video is now paused
          setIsVideoPaused(true);
        }}
        data-testid="video-element"
      >
        {!isVideoUnloaded &&
          // Only render sources for the video if it is not unloaded
          formattedVideoSources.map(({ src, type }) => (
            <source key={src} src={src} type={type} />
          ))}
        {formattedVideoCaptions.map(
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
};

export default HoverVideoPlayer;
