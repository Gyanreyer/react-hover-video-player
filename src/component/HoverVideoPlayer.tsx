import React, {
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
  useCallback,
} from 'react';

import useSetAdditionalAttributesOnVideo from '../hooks/useSetAdditionalAttributesOnVideo';
import useHoverTargetElement from '../hooks/useHoverTargetElement';
import useManageHoverEvents from '../hooks/useManageHoverEvents';

import { isVideoElementPaused } from '../utils/videoElementPlaybackStates';

import {
  expandToFillContainerStyle,
  containerSizingStyles,
  pausedOverlayWrapperSizingStyles,
  videoSizingStyles,
} from './HoverVideoPlayer.styles';

import { HoverVideoPlayerProps } from '../HoverVideoPlayer.types';

/**
 * @component HoverVideoPlayer
 * @license MIT
 *
 * @param {HoverVideoPlayerProps} props
 */
export default function HoverVideoPlayer({
  videoSrc,
  videoCaptions = null,
  focused = false,
  disableDefaultEventHandling = false,
  hoverTarget = null,
  onHoverStart = null,
  onHoverEnd = null,
  hoverOverlay = null,
  pausedOverlay = null,
  loadingOverlay = null,
  loadingStateTimeout = 200,
  overlayTransitionDuration = 400,
  playbackStartDelay = 0,
  restartOnPaused = false,
  unloadVideoOnPaused = false,
  playbackRangeStart = null,
  playbackRangeEnd = null,
  muted = true,
  volume = 1,
  loop = true,
  preload = undefined,
  crossOrigin = undefined,
  controls = false,
  controlsList = undefined,
  disableRemotePlayback = true,
  disablePictureInPicture = true,
  style = undefined,
  hoverOverlayWrapperClassName = undefined,
  hoverOverlayWrapperStyle = undefined,
  pausedOverlayWrapperClassName = undefined,
  pausedOverlayWrapperStyle = undefined,
  loadingOverlayWrapperClassName = undefined,
  loadingOverlayWrapperStyle = undefined,
  videoId = undefined,
  videoClassName = undefined,
  videoRef: forwardedVideoRef = null,
  videoStyle = undefined,
  sizingMode = 'video',
  ...spreadableProps
}: HoverVideoPlayerProps): JSX.Element {
  // Element refs
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Forward out local videoRef along to the videoRef prop
  useImperativeHandle(
    forwardedVideoRef,
    () => videoRef.current as HTMLVideoElement
  );

  // Effect sets attributes on the video which can't be done via props
  useSetAdditionalAttributesOnVideo(
    videoRef,
    muted,
    volume,
    disableRemotePlayback,
    disablePictureInPicture
  );

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && playbackRangeStart) {
      videoElement.currentTime = playbackRangeStart;
    }
  }, [playbackRangeStart]);

  // Get the hover target element from the hoverTarget prop, or default to the component's container div
  const hoverTargetElement = useHoverTargetElement(hoverTarget || containerRef);

  // Keep a ref for the time which the video should be started from next time it is played
  // This is useful if the video gets unloaded and we want to restore it to the time it was
  // at before if the user tries playing it again
  const nextVideoStartTimeRef = useRef<number | null>(null);

  // Whether the user is hovering over the hover target, meaning we should be trying to play the video
  const [isHovering, setIsHovering] = useState(false);
  // Whether the video is currently in a loading state, meaning it's not ready to be played yet
  const [isLoading, setIsLoading] = useState(false);
  // Whether the video is currently playing or not
  const [isPlaying, setIsPlaying] = useState(false);

  const isHoveringRef = useRef<boolean>();
  isHoveringRef.current = isHovering;

  const playTimeoutRef = useRef<number | undefined>();
  const pauseTimeoutRef = useRef<number | undefined>();

  const cancelTimeouts = useCallback(() => {
    // Cancel any previously active pause or playback attempts
    window.clearTimeout(playTimeoutRef.current);
    window.clearTimeout(pauseTimeoutRef.current);
  }, []);

  const hasPausedOverlay = Boolean(pausedOverlay);
  const hasHoverOverlay = Boolean(hoverOverlay);

  // If we have a paused or hover overlay, the player should wait
  // for the overlay(s) to finish transitioning back in before we
  // pause the video
  const shouldWaitForOverlayTransitionBeforePausing =
    hasPausedOverlay || hasHoverOverlay;

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!hoverTargetElement || !videoElement) return undefined;

    const onHoverStart = () => {
      // Bail out if we're already hovering
      if (isHoveringRef.current) return;

      // Cancel any previously active pause or playback attempts
      cancelTimeouts();

      setIsHovering(true);
    };
    const onHoverEnd = () => {
      cancelTimeouts();

      setIsHovering(false);
    };

    hoverTargetElement.addEventListener('hvp:hoverStart', onHoverStart);
    hoverTargetElement.addEventListener('hvp:hoverEnd', onHoverEnd);

    return () => {
      hoverTargetElement.removeEventListener('hvp:hoverStart', onHoverStart);
      hoverTargetElement.removeEventListener('hvp:hoverEnd', onHoverEnd);
    };
  }, [
    cancelTimeouts,
    hoverTargetElement,
    overlayTransitionDuration,
    playbackRangeStart,
    restartOnPaused,
    shouldWaitForOverlayTransitionBeforePausing,
  ]);

  const playVideo = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.play().catch((error: DOMException) => {
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
        playVideo();

        // When the user clicks on the document, unmute the video since we should now
        // be free to play audio
        const onClickDocument = () => {
          videoElement.muted = false;

          // Clean up the event listener so it is only fired once
          document.removeEventListener('click', onClickDocument);
        };
        document.addEventListener('click', onClickDocument);
      } else {
        // Log any other playback errors with console.error
        console.error(`HoverVideoPlayer: ${error.message}`);
      }
    });
  }, []);

  // Effect attempts to start playing the video if the user is hovering over the hover target
  // and the video is loaded enough to be played
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isHovering && !isLoading && !isPlaying) {
      if (
        nextVideoStartTimeRef.current !== null &&
        videoElement.currentTime !== nextVideoStartTimeRef.current
      ) {
        videoElement.currentTime = nextVideoStartTimeRef.current;
      }

      if (playbackStartDelay) {
        playTimeoutRef.current = window.setTimeout(
          playVideo,
          playbackStartDelay
        );
      } else {
        playVideo();
      }
    }
  }, [isHovering, isLoading, isPlaying, playVideo, playbackStartDelay]);

  // Effect pauses the video if the user is no longer hovering over the hover target
  // and the video is currently playing
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!isHovering && (isPlaying || isLoading)) {
      const pauseVideo = () => {
        videoElement.pause();

        // Performing post-save cleanup tasks in here rather than the onPause listener
        // because onPause can also be called when the video reaches the end of a playback range
        // and it's just simpler to deal with that separately
        if (restartOnPaused) {
          videoElement.currentTime = playbackRangeStart || 0;
        }
        nextVideoStartTimeRef.current = videoElement.currentTime;
      };

      if (shouldWaitForOverlayTransitionBeforePausing) {
        // If we have a paused overlay, the player should wait
        // for the overlay(s) to finish transitioning back in before we
        // pause the video
        pauseTimeoutRef.current = window.setTimeout(
          pauseVideo,
          overlayTransitionDuration
        );
      } else {
        setIsHovering(false);
      }
    }
  }, [
    isHovering,
    isLoading,
    isPlaying,
    overlayTransitionDuration,
    playbackRangeStart,
    restartOnPaused,
    shouldWaitForOverlayTransitionBeforePausing,
  ]);

  // Effect cancels any pending timeouts when the component unmounts
  useEffect(() => () => cancelTimeouts(), [cancelTimeouts]);

  useManageHoverEvents(
    hoverTargetElement,
    focused,
    disableDefaultEventHandling,
    onHoverStart,
    onHoverEnd
  );

  const currentVideoSrc = useRef(videoSrc);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoSrc !== currentVideoSrc.current && !isHovering && !isPlaying) {
      currentVideoSrc.current = videoSrc;
      // If the video element doesn't have a loaded source or the source has changed since the
      // last time we played the video, make sure to force the video to load the most up-to-date sources
      videoElement.load();
      // Reset the next start time to the start of the video
      nextVideoStartTimeRef.current = playbackRangeStart || 0;
    }
  }, [videoSrc, isHovering, isPlaying, playbackRangeStart]);

  // If the video's sources should be unloaded when it's paused and the video is not currently active, we can unload the video's sources.
  // We will remove the video's <source> tags in this render and then call video.load() in an effect to
  // fully unload the video
  const shouldUnloadVideo = unloadVideoOnPaused && !isHovering && !isPlaying;

  useEffect(() => {
    if (shouldUnloadVideo) {
      // Re-load the video with the sources removed so we unload everything from memory
      videoRef.current?.load();
    }
  }, [shouldUnloadVideo]);

  const shouldShowLoadingOverlay = isHovering && !isPlaying;
  // Show a paused overlay when the user isn't hovering or when the user is hovering
  // but the video is still loading
  const shouldShowPausedOverlay = !isHovering || (isHovering && !isPlaying);

  const isUsingPlaybackRange =
    playbackRangeStart !== null || playbackRangeEnd !== null;

  const hasLoadingOverlay = Boolean(loadingOverlay);

  console.log('isPlaying', isPlaying);

  return (
    <div
      data-testid="hover-video-player-container"
      ref={containerRef}
      style={{
        ...containerSizingStyles[sizingMode],
        position: 'relative',
        ...style,
      }}
      {...spreadableProps}
    >
      {hasPausedOverlay ? (
        <div
          style={{
            ...pausedOverlayWrapperSizingStyles[sizingMode],
            zIndex: 1,
            opacity: shouldShowPausedOverlay ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms`,
            // Disable pointer events on the paused overlay when it's hidden
            pointerEvents: shouldShowPausedOverlay ? 'auto' : 'none',
            ...pausedOverlayWrapperStyle,
          }}
          className={pausedOverlayWrapperClassName}
          data-testid="paused-overlay-wrapper"
        >
          {pausedOverlay}
        </div>
      ) : null}
      {hasLoadingOverlay ? (
        <div
          style={{
            ...expandToFillContainerStyle,
            zIndex: 2,
            opacity: shouldShowLoadingOverlay ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms ${
              shouldShowLoadingOverlay ? loadingStateTimeout : 0
            }ms`,
            // Disable pointer events on the loading overlay when it's hidden
            pointerEvents: shouldShowLoadingOverlay ? 'auto' : 'none',
            ...loadingOverlayWrapperStyle,
          }}
          className={loadingOverlayWrapperClassName}
          data-testid="loading-overlay-wrapper"
        >
          {loadingOverlay}
        </div>
      ) : null}
      {hasHoverOverlay ? (
        <div
          style={{
            ...expandToFillContainerStyle,
            zIndex: 3,
            // Show the hover overlay when the player is hovered/playing
            opacity: isHovering ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms`,
            // Disable pointer events on the hover overlay when it's hidden
            pointerEvents: isHovering ? 'auto' : 'none',
            ...hoverOverlayWrapperStyle,
          }}
          className={hoverOverlayWrapperClassName}
          data-testid="hover-overlay-wrapper"
        >
          {hoverOverlay}
        </div>
      ) : null}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={
          typeof currentVideoSrc.current === 'string' && !shouldUnloadVideo
            ? currentVideoSrc.current
            : undefined
        }
        // If a playback range is set, the loop attribute will not work correctly so there's no point in setting it here;
        // in that case, we will manually implement this behavior
        loop={isUsingPlaybackRange ? false : loop}
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
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadStart={() => setIsLoading(true)}
        onLoadedData={() => {
          setIsLoading(
            (videoRef.current?.readyState || 0) <
              HTMLMediaElement.HAVE_ENOUGH_DATA
          );
        }}
        onAbort={() => setIsLoading(false)}
        onTimeUpdate={
          // If there's a playback range set, the traditional `loop` video prop won't work correctly so
          // we'll need watch the video's time as it plays and manually keep it within the bounds of the range
          isUsingPlaybackRange
            ? () => {
                const videoElement = videoRef.current;
                if (!videoElement) return;

                const maxVideoTime = playbackRangeEnd || videoElement.duration;
                const minVideoTime = playbackRangeStart || 0;

                const { currentTime } = videoElement;

                if (loop && currentTime >= maxVideoTime) {
                  // If the video should loop and is >= the max video time,
                  // loop it back around to the start
                  const startTime = playbackRangeStart || 0;
                  videoElement.currentTime = startTime;

                  // If the video is paused but the user is still hovering,
                  // meaning it should continue to play, call play() to keep it going
                  if (isHovering && isVideoElementPaused(videoElement)) {
                    playVideo();
                  }
                } else if (currentTime > maxVideoTime) {
                  // If the video shouldn't loop but we've exceeded the max video time,
                  // clamp it to the max time and pause it
                  videoElement.pause();
                  videoElement.currentTime = maxVideoTime;
                } else if (currentTime < minVideoTime) {
                  // If the video's time somehow ended up before the min video time,
                  // clamp it to the min time
                  videoElement.currentTime = minVideoTime;
                }
              }
            : undefined
        }
      >
        {shouldUnloadVideo || typeof currentVideoSrc.current === 'string'
          ? null
          : currentVideoSrc.current}
        {videoCaptions}
      </video>
    </div>
  );
}
