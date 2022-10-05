import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';

import useSetAdditionalAttributesOnVideo from '../hooks/useSetAdditionalAttributesOnVideo';
import useFormatVideoSrc from '../hooks/useFormatVideoSrc';
import useFormatVideoCaptions from '../hooks/useFormatVideoCaptions';
import useHoverTargetElement from '../hooks/useHoverTargetElement';
import useManageHoverEvents from '../hooks/useManageHoverEvents';

import {
  isVideoElementPaused,
  isVideoElementPlaying,
} from '../utils/videoElementPlaybackStates';

import {
  expandToFillContainerStyle,
  containerSizingStyles,
  pausedOverlayWrapperSizingStyles,
  videoSizingStyles,
} from './HoverVideoPlayer.styles';
import { HoverVideoPlayerProps, VideoSource } from '../HoverVideoPlayer.types';

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
  preload = null,
  crossOrigin = null,
  controls = false,
  controlsList = null,
  disableRemotePlayback = true,
  disablePictureInPicture = true,
  style = null,
  hoverOverlayWrapperClassName = null,
  hoverOverlayWrapperStyle = null,
  pausedOverlayWrapperClassName = null,
  pausedOverlayWrapperStyle = null,
  loadingOverlayWrapperClassName = null,
  loadingOverlayWrapperStyle = null,
  videoId = null,
  videoClassName = null,
  videoRef: forwardedVideoRef = null,
  videoStyle = null,
  sizingMode = 'video',
  shouldSuppressPlaybackInterruptedErrors = true,
  ...spreadableProps
}: HoverVideoPlayerProps): JSX.Element {
  // Element refs
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Forward out local videoRef along to the videoRef prop
  useImperativeHandle(forwardedVideoRef, () => videoRef.current);

  // Effect sets attributes on the video which can't be done via props
  useSetAdditionalAttributesOnVideo(
    videoRef,
    muted,
    volume,
    disableRemotePlayback,
    disablePictureInPicture
  );

  // Get the hover target element from the hoverTarget prop, or default to the component's container div
  const hoverTargetElement = useHoverTargetElement(hoverTarget || containerRef);

  // Keep a ref for the time which the video should be started from next time it is played
  // This is useful if the video gets unloaded and we want to restore it to the time it was
  // at before if the user tries playing it again
  const nextVideoStartTimeRef = useRef(null);

  // Parse the sources and captions into formatted arrays that we can use to
  // render <source> and <track> elements for the video
  const formattedVideoCaptions = useFormatVideoCaptions(videoCaptions);
  const formattedVideoSources = useFormatVideoSrc(
    videoSrc,
    playbackRangeStart,
    playbackRangeEnd
  );
  // Keep a ref to the previous formatted video sources so we can track when the video sources change
  const previousFormattedVideoSourcesRef = useRef<VideoSource[]>(
    formattedVideoSources
  );

  /**
   * Attempts to load and play the video.
   * Storing this on a ref because we don't really want to worry about triggering re-renders when
   * any of this function's dependencies change; it should only be called when the
   * player is hovered/focused.
   */
  const attemptToPlayVideoRef = useRef<() => void>();
  attemptToPlayVideoRef.current = () => {
    const videoElement = videoRef.current;

    if (nextVideoStartTimeRef.current !== null) {
      videoElement.currentTime = nextVideoStartTimeRef.current;
    }

    videoElement.play().catch((error: DOMException) => {
      // If shouldSuppressPlaybackInterruptedErrors is true and this is an AbortError, do nothing instead of logging it.
      if (
        shouldSuppressPlaybackInterruptedErrors &&
        error.name === 'AbortError'
      ) {
        return;
      }

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
      } else {
        // Log any other playback errors with console.error
        console.error(`HoverVideoPlayer: ${error.message}`);
      }
    });
  };

  /**
   * Attempts to pause the video.
   * Storing this on a ref because we don't really want to worry about triggering re-renders when
   * any of this function's dependencies change; it should only be called when the
   * player is un-hovered/focused.
   */
  const attemptToPauseVideoRef = useRef<() => void>();
  attemptToPauseVideoRef.current = () => {
    const videoElement = videoRef.current;

    videoElement.pause();

    // Performing post-save cleanup tasks in here rather than the onPause listener
    // because onPause can also be called when the video reaches the end of a playback range
    // and it's just simpler to deal with that separately
    if (restartOnPaused) {
      videoElement.currentTime = playbackRangeStart || 0;
    }
    nextVideoStartTimeRef.current = videoElement.currentTime;

    setIsPlaying(false);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      // When the video isn't playing, check if the sources loaded in the video
      // have changed from what the video currently has loaded. If so, we'll call videoElement.load()
      // to trigger a reload with the new source
      const shouldReloadVideoSources =
        previousFormattedVideoSourcesRef.current !== formattedVideoSources;

      if (shouldReloadVideoSources) {
        previousFormattedVideoSourcesRef.current = formattedVideoSources;

        const videoElement = videoRef.current;
        // If the video element doesn't have a loaded source or the source has changed since the
        // last time we played the video, make sure to force the video to load the most up-to-date sources
        videoElement.load();
        // Reset the next start time to the start of the video
        nextVideoStartTimeRef.current = playbackRangeStart || 0;
      }
    }
  }, [formattedVideoSources, isPlaying, playbackRangeStart]);

  const hasPausedOverlay = Boolean(pausedOverlay);
  const hasHoverOverlay = Boolean(hoverOverlay);

  // If we have a paused or hover overlay, the player should wait
  // for the overlay(s) to finish transitioning back in before we
  // pause the video
  const shouldWaitForOverlayTransitionBeforePausing =
    hasPausedOverlay || hasHoverOverlay;

  useEffect(() => {
    if (!hoverTargetElement) return undefined;

    let playbackStartTimeout: number | null = null;
    let pauseTimeout: number | null = null;

    const cancelTimeouts = () => {
      // Cancel any previously active pause or playback attempts
      window.clearTimeout(playbackStartTimeout);
      window.clearTimeout(pauseTimeout);
    };

    const attemptToPlayVideoOnHover = () => {
      cancelTimeouts();

      setIsHovering(true);

      // We only need to attempt to play if the video is currently paused
      if (isVideoElementPaused(videoRef.current)) {
        if (playbackStartDelay) {
          playbackStartTimeout = window.setTimeout(
            () => attemptToPlayVideoRef.current(),
            playbackStartDelay
          );
        } else {
          attemptToPlayVideoRef.current();
        }
      }
    };
    const attemptToPauseVideoOnHoverEnd = () => {
      cancelTimeouts();

      setIsHovering(false);

      if (
        // We only need to delay a pause attempt if the video is currently playing
        isVideoElementPlaying(videoRef.current) &&
        shouldWaitForOverlayTransitionBeforePausing
      ) {
        pauseTimeout = window.setTimeout(
          () => attemptToPauseVideoRef.current(),
          overlayTransitionDuration
        );
      } else {
        attemptToPauseVideoRef.current();
      }
    };

    hoverTargetElement.addEventListener(
      'hvp:hoverStart',
      attemptToPlayVideoOnHover
    );
    hoverTargetElement.addEventListener(
      'hvp:hoverEnd',
      attemptToPauseVideoOnHoverEnd
    );

    return () => {
      hoverTargetElement.removeEventListener(
        'hvp:hoverStart',
        attemptToPlayVideoOnHover
      );
      hoverTargetElement.removeEventListener(
        'hvp:hoverEnd',
        attemptToPauseVideoOnHoverEnd
      );
      cancelTimeouts();
    };
  }, [
    hoverTargetElement,
    overlayTransitionDuration,
    playbackStartDelay,
    shouldWaitForOverlayTransitionBeforePausing,
  ]);

  useManageHoverEvents(
    hoverTargetElement,
    focused,
    disableDefaultEventHandling,
    onHoverStart,
    onHoverEnd
  );

  // We should attempt to play the video if the user is hovering over it or the `focused` override prop is enabled
  // const shouldPlayVideo = isHoveringOverVideo || focused;

  const hasLoadingOverlay = Boolean(loadingOverlay);

  // If the video's sources should be unloaded when it's paused and the video is not currently active, we can unload the video's sources.
  // We will remove the video's <source> tags in this render and then call video.load() in an effect to
  // fully unload the video
  const shouldUnloadVideo = unloadVideoOnPaused && !isHovering && !isPlaying;

  useEffect(() => {
    // If shouldUnloadVideo is true, this effect is being run after the video's
    // sources have been removed, so call load on the video to unload any sources it currently has loaded
    if (shouldUnloadVideo) {
      const videoElement = videoRef.current;
      videoElement.load();
    }
  }, [shouldUnloadVideo]);

  const shouldShowLoadingOverlay = isHovering && !isPlaying;
  // Show a paused overlay when the user isn't hovering or when the user is hovering
  // but the video is still loading
  const shouldShowPausedOverlay = !isHovering || (isHovering && !isPlaying);

  const isUsingPlaybackRange =
    playbackRangeStart !== null || playbackRangeEnd !== null;

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
        data-testid="video-element"
        onPlaying={() => {
          setIsPlaying(true);
        }}
        onTimeUpdate={
          // If there's a playback range set, the traditional `loop` video prop won't work correctly so
          // we'll need watch the video's time as it plays and manually keep it within the bounds of the range
          isUsingPlaybackRange
            ? () => {
                const videoElement = videoRef.current;

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
                    videoElement.play();
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
            : null
        }
      >
        {!shouldUnloadVideo &&
          // Only render sources for the video if it is not unloaded
          formattedVideoSources.map(({ src, type }) => (
            <source key={src} src={src} type={type} />
          ))}
        {formattedVideoCaptions.map(
          ({ src, srcLang, label, kind, default: isDefault }) => (
            <track
              key={src}
              kind={kind}
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
