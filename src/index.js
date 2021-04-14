import React, { useState, useEffect, useRef, useMemo } from 'react';

import { formatVideoSrc, formatVideoCaptions } from './utils';
import {
  OVERLAY_STATE,
  SIZING_MODES,
  expandToFillContainerStyle,
  pausedOverlayWrapperSizingStyles,
  videoSizingStyles,
} from './constants';

/**
 * @component HoverVideoPlayer
 *
 * @param {object}  props - Component props
 * @param {(string|string[]|VideoSource|VideoSource[])}  props.videoSrc - Source(s) to use for the video player. Accepts 3 different formats:
 *                                                                   - **String**: the URL string to use as the video player's src
 *                                                                   - **Object**: an object with attributes:
 *                                                                     - src: The src URL string to use for a video player source
 *                                                                     - type: The media type of the video source, ie 'video/mp4'
 *                                                                   - **Array**: if you would like to provide multiple sources, you can provide an array of URL strings and/or objects with the shape described above
 * @param {(VideoCaptionsTrack|VideoCaptionsTrack[])} [props.videoCaptions] - Captions track(s) to use for the video player for accessibility. Accepts 2 formats:
 *                                                                                      - **Object**: an object with attributes:
 *                                                                                        - src: The src URL string for the captions track file
 *                                                                                        - srcLang: The language code for the language that these captions are in (ie, 'en', 'es', 'fr')
 *                                                                                        - label: The title of the captions track
 *                                                                                        - default: Whether this track should be used by default if the user's preferences don't match an available srcLang
 *                                                                                      - **Array**: if you would like to provide multiple caption tracks, you can provide an array of objects with the shape described above
 * @param {boolean} [props.focused=false] - Offers a prop interface for forcing the video to start/stop without DOM events
 *                                      When set to true, the video will begin playing and any events that would normally stop it will be ignored
 * @param {boolean} [props.disableDefaultEventHandling] - Whether the video player's default mouse and touch event handling should be disabled in favor of a fully custom solution using the `focused` prop
 * @param {node}    [props.hoverTargetRef] - Ref to a custom element that should be used as the target for hover events to start/stop the video
 *                                      By default will just use the container div wrapping the player
 * @param {node}    [props.pausedOverlay] - Contents to render over the video while it's not playing
 * @param {node}    [props.loadingOverlay] - Contents to render over the video while it's loading
 * @param {number}  [props.loadingStateTimeout=200] - Duration in ms to wait after attempting to start the video before showing the loading overlay
 * @param {number}  [props.overlayTransitionDuration=400] - The transition duration in ms for how long it should take for the overlay to fade in/out
 * @param {boolean} [props.restartOnPaused=false] - Whether the video should reset to the beginning every time it stops playing after the user mouses out of the player
 * @param {boolean} [props.unloadVideoOnPaused=false] - Whether we should unload the video's sources when it is not playing in order to free up memory and bandwidth
 *                                                  This can be useful in scenarios where you may have a large number of relatively large video files on a single page;
 *                                                  particularly due to a known bug in Google Chrome, if too many videos are loading in the background at the same time,
 *                                                  it starts to gum up the works so that nothing loads properly and performance can degrade significantly.
 * @param {boolean} [props.muted=true] - Whether the video player should be muted
 * @param {number}  [props.volume=1] - The volume that the video's audio should play at, on a scale from 0-1. This will only work if the muted prop is also set to false.
 * @param {boolean} [props.loop=true] - Whether the video player should loop when it reaches the end
 * @param {string}  [props.preload] - Sets how much information the video element should preload before being played. Accepts one of the following values:
 *                              - **"none"**: Nothing should be preloaded before the video is played
 *                              - **"metadata"**: Only the video's metadata (ie length, dimensions) should be preloaded
 *                              - **"auto"**: The whole video file should be preloaded even if it won't be played
 * @param {string}  [props.crossOrigin='anonymous'] - Sets how the video element should handle CORS requests. Accepts one of the following values:
 *                                              - **"anonymous"**: CORS requests will have the credentials flag set to 'same-origin'
 *                                              - **"use-credentials"**: CORS requests for this element will have the credentials flag set to 'include'
 * @param {boolean} [props.controls=false] - Sets whether the video element should have the browser's video playback controls enabled.
 * @param {string}  [props.controlsList] - Allows finer control over which controls the browser should exclude from the video playback controls.
 *                                    Be aware that this feature is not currently supported across all major browsers.
 *                                    Accepts a string with the following values, separated by spaces if using more than one:
 *                                      - **"nodownload"**: Removes the download button from the video's controls
 *                                      - **"nofullscreen"**: Removes the fullscreen button from the video's controls
 * @param {boolean} [props.disableRemotePlayback=true] - Prevents the browser from showing controls to cast the video
 * @param {boolean} [props.disablePictureInPicture=true] - Prevents the browser from showing picture-in-picture controls on the video
 * @param {string}  [props.className] - Optional className to apply custom styling to the container element
 * @param {object}  [props.style] - Style object to apply custom inlined styles to the hover player container
 * @param {string}  [props.pausedOverlayWrapperClassName] - Optional className to apply custom styling to the overlay contents' wrapper
 * @param {object}  [props.pausedOverlayWrapperStyle] - Style object to apply custom inlined styles to the paused overlay wrapper
 * @param {string}  [props.loadingOverlayWrapperClassName] - Optional className to apply custom styling to the loading state overlay contents' wrapper
 * @param {object}  [props.loadingOverlayWrapperStyle] - Style object to apply custom inlined styles to the loading overlay wrapper
 * @param {string}  [props.videoClassName] - Optional className to apply custom styling to the video element
 * @param {string}  [props.videoId] - Optional unique id to apply to the video element to make it easier to access
 * @param {object}  [props.videoStyle] - Style object to apply custom inlined styles to the video element
 * @param {string}  [props.sizingMode='video'] - Describes sizing mode to use to determine how the player's contents should be styled. Accepts 4 possible values:
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
  videoClassName = null,
  videoId = null,
  videoStyle = null,
  sizingMode = SIZING_MODES.video,
}) {
  // Keep track of whether the user is hovering over the video and it should therefore be playing or not
  const [isHoveringOverVideo, setIsHoveringOverVideo] = useState(false);
  // Keep track of how the paused and loading overlays should be displayed
  const [overlayState, setOverlayState] = useState(OVERLAY_STATE.paused);
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
        setOverlayState(OVERLAY_STATE.paused);

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
    const onWindowTouchStart = (event) => {
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

  const isPausedOverlayVisible = overlayState !== OVERLAY_STATE.playing;
  const isLoadingOverlayVisibile = overlayState === OVERLAY_STATE.loading;

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
            setOverlayState(OVERLAY_STATE.playing);
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
}
