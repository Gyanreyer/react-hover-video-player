import React, {
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
  useCallback,
} from 'react';

import useSetAdditionalAttributesOnVideo from '../hooks/useSetAdditionalAttributesOnVideo';
import useFormatVideoSrc from '../hooks/useFormatVideoSrc';
import useFormatVideoCaptions from '../hooks/useFormatVideoCaptions';
import useHoverTargetElement from '../hooks/useHoverTargetElement';
import useManageHoverEvents from '../hooks/useManageHoverEvents';

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

  // Get the hover target element from the hoverTarget prop, or default to the component's container div
  const hoverTargetElement = useHoverTargetElement(hoverTarget || containerRef);

  const nextVideoStartTimeRef = useRef(0);

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

  const attemptToPlayVideo = useCallback(async () => {
    const videoElement = videoRef.current;

    videoElement.currentTime = nextVideoStartTimeRef.current;
    if (
      !videoElement.currentSrc ||
      previousFormattedVideoSourcesRef.current !== formattedVideoSources
    ) {
      // If the video element doesn't have a loaded source or the source has changed since the
      // last time we played the video, make sure to force the video to load the most up-to-date sources
      videoElement.load();
    }

    await videoElement.play().catch((error: DOMException) => {
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
  }, [formattedVideoSources, shouldSuppressPlaybackInterruptedErrors]);

  const [playbackState, setPlaybackState] = useState<
    'PAUSED' | 'LOADING' | 'PLAYING'
  >('PAUSED');

  const [isHovering, setIsHovering] = useState(false);

  const hasPausedOverlay = Boolean(pausedOverlay);
  const hasHoverOverlay = Boolean(hoverOverlay);

  // If we have a paused or hover overlay, the player should wait
  // for the overlay(s) to finish transitioning back in before we
  // pause the video
  const shouldWaitForOverlayTransitionBeforePausing =
    hasPausedOverlay || hasHoverOverlay;

  useEffect(() => {
    if (!hoverTargetElement) return undefined;

    const attemptToPlayVideoOnHover = async () => {
      setIsHovering(true);

      attemptToPlayVideo();
    };
    const attemptToPauseVideoOnHoverEnd = () => {
      setIsHovering(false);
      const videoElement = videoRef.current;

      const pauseVideo = () => {
        videoElement.pause();

        // Performing post-save cleanup tasks in here rather than the onPause listener
        // because onPause can also be called when the video reaches the end of a playback range
        // and it's just simpler to deal with that separately
        if (restartOnPaused) {
          videoElement.currentTime = playbackRangeStart || 0;
        }
        nextVideoStartTimeRef.current = videoElement.currentTime;

        setPlaybackState('PAUSED');
      };

      if (shouldWaitForOverlayTransitionBeforePausing) {
        window.setTimeout(pauseVideo, overlayTransitionDuration);
      } else {
        pauseVideo();
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
    };
  }, [
    attemptToPlayVideo,
    hoverTargetElement,
    overlayTransitionDuration,
    playbackRangeStart,
    restartOnPaused,
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
  const shouldUnloadVideo =
    unloadVideoOnPaused && !isHovering && playbackState !== 'PLAYING';

  useEffect(() => {
    // If shouldUnloadVideo is true, this effect is being run after the video's
    // sources have been removed, so call load on the video to unload any sources it currently has loaded
    if (shouldUnloadVideo) {
      const videoElement = videoRef.current;
      videoElement.load();
    }
  }, [shouldUnloadVideo]);

  const shouldShowLoadingOverlay = playbackState === 'LOADING';
  const shouldShowPausedOverlay =
    playbackState === 'PAUSED' || shouldShowLoadingOverlay;

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
            opacity: !isHovering ? 1 : 0,
            transition: `opacity ${overlayTransitionDuration}ms`,
            // Disable pointer events on the hover overlay when it's hidden
            pointerEvents: !isHovering ? 'auto' : 'none',
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
        data-testid="video-element"
        onPlay={() => {
          setPlaybackState('LOADING');
        }}
        onPlaying={() => {
          setPlaybackState('PLAYING');
        }}
        onPause={() => {
          if (isHovering && loop) {
            const videoElement = videoRef.current;
            const videoStartTime = playbackRangeStart || 0;
            videoElement.currentTime = videoStartTime;
            videoElement.play();
          }
        }}
        onTimeUpdate={() => {
          const videoElement = videoRef.current;

          if (
            playbackRangeEnd !== null &&
            videoElement.currentTime > playbackRangeEnd
          ) {
            if (loop) {
              videoElement.currentTime = playbackRangeStart || 0;
              if (videoElement.paused) {
                videoElement.play();
              }
            } else {
              videoElement.pause();
              videoElement.currentTime = playbackRangeEnd;
            }
          }
        }}
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
