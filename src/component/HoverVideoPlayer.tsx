import React, { useRef, useImperativeHandle, useEffect } from 'react';

import useSetAdditionalAttributesOnVideo from '../hooks/useSetAdditionalAttributesOnVideo';
import useIsHoveringOverVideo from '../hooks/useIsHoveringOverVideo';
import useManageVideoPlayback from '../hooks/useManageVideoPlayback';
import useFormatVideoSrc from '../hooks/useFormatVideoSrc';
import useFormatVideoCaptions from '../hooks/useFormatVideoCaptions';

import {
  expandToFillContainerStyle,
  containerSizingStyles,
  pausedOverlayWrapperSizingStyles,
  videoSizingStyles,
} from './HoverVideoPlayer.styles';
import { OverlayState } from '../constants/OverlayState';
import { HoverVideoPlayerProps, VideoSource } from '../HoverVideoPlayer.types';

/**
 * @component HoverVideoPlayer
 * @license MIT
 *
 * @param {HoverVideoPlayerProps} props
 */
const HoverVideoPlayer = ({
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
  restartOnPaused = false,
  unloadVideoOnPaused = false,
  playbackRangeStart = null,
  playbackRangeEnd = null,
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
}: HoverVideoPlayerProps): JSX.Element => {
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

  const isHoveringOverVideo = useIsHoveringOverVideo(
    // If the hoverTarget prop wasn't provided, fall back to the component's container div
    hoverTarget || containerRef,
    disableDefaultEventHandling,
    onHoverStart,
    onHoverEnd
  );

  // We should attempt to play the video if the user is hovering over it or the `focused` override prop is enabled
  const shouldPlayVideo = isHoveringOverVideo || focused;

  const hasPausedOverlay = Boolean(pausedOverlay);
  const hasHoverOverlay = Boolean(hoverOverlay);

  // If we have a paused or hover overlay, the player should wait
  // for the overlay(s) to finish transitioning back in before we
  // pause the video
  const shouldWaitForOverlayTransitionBeforePausing =
    hasPausedOverlay || hasHoverOverlay;

  const hasLoadingOverlay = Boolean(loadingOverlay);

  // Effect handles transitioning the video between playing or paused states
  // depending on the current value for `shouldPlayVideo`
  const [overlayState, isVideoActive] = useManageVideoPlayback(
    videoRef,
    shouldPlayVideo,
    playbackRangeStart,
    playbackRangeEnd,
    loop,
    restartOnPaused,
    shouldWaitForOverlayTransitionBeforePausing,
    hasLoadingOverlay,
    overlayTransitionDuration,
    loadingStateTimeout,
    shouldSuppressPlaybackInterruptedErrors
  );

  // If the video's sources should be unloaded when it's paused and the video is not currently active, we can unload the video's sources.
  // We will remove the video's <source> tags in this render and then call video.load() in an effect to
  // fully unload the video
  const shouldUnloadVideo = unloadVideoOnPaused && !isVideoActive;

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

  // Effect re-loads the video if its sources should be unloaded when paused or if the videoSrc changed
  useEffect(() => {
    // Only reload when the video is paused
    if (isVideoActive) return;

    if (
      unloadVideoOnPaused ||
      previousFormattedVideoSourcesRef.current !== formattedVideoSources
    ) {
      // Perform a manual load to unload the video's current source
      const videoElement = videoRef.current;
      videoElement.load();

      previousFormattedVideoSourcesRef.current = formattedVideoSources;
    }
  }, [isVideoActive, unloadVideoOnPaused, formattedVideoSources]);

  const hasPlaybackRange =
    playbackRangeStart !== null || playbackRangeEnd !== null;

  // Show the paused overlay if the overlay state is either "paused" OR "loading"; if
  // "loading", the loading overlay will be displayed on top of the paused overlay
  const isPausedOverlayVisible = overlayState !== OverlayState.playing;
  // Show the loading overlay only if the overlay state is specifically "loading"
  const isLoadingOverlayVisibile = overlayState === OverlayState.loading;

  return (
    <div
      data-testid="hover-video-player-container"
      ref={containerRef}
      className={className}
      style={{
        ...containerSizingStyles[sizingMode],
        position: 'relative',
        ...style,
      }}
    >
      {hasPausedOverlay ? (
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
      ) : null}
      {hasLoadingOverlay ? (
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
      ) : null}
      {hasHoverOverlay ? (
        <div
          style={{
            ...expandToFillContainerStyle,
            zIndex: 3,
            // Show the hover overlay when the player is hovered/playing
            opacity: shouldPlayVideo ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms`,
            // Disable pointer events on the hover overlay when it's hidden
            pointerEvents: shouldPlayVideo ? 'auto' : 'none',
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
        loop={loop && !hasPlaybackRange}
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
};

export default HoverVideoPlayer;
