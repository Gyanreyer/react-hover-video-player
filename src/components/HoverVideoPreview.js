import React from 'react';
import { cx, css } from 'emotion';

import FadeTransition from './FadeTransition';

// Enum for states that the hover preview can be in
const HOVER_PREVIEW_STATE = {
  stopping: 0,
  stopped: 1,
  loading: 2,
  playing: 3,
};

const baseContainerStyle = css`
  position: relative;
`;

const baseOverlayContainerStyle = css`
  /* Overlay wrapper should completely cover the dimensions of the video */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const baseVideoStyle = css`
  width: 100%;
  display: block;
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
 * @component HoverVideoPreview
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
 * @param {node}    [previewOverlay] - Contents to render over the video while it's not playing
 * @param {node}    [loadingStateOverlay] - Contents to render over the video while it's loading
 * @param {number}  [overlayFadeTransitionDuration=400] - The transition duration in ms for how long it should take for the overlay to fade in/out
 * @param {bool}    [shouldRestartOnVideoStopped=true] - Whether the video should reset to the beginning every time it stops playing after the user mouses out of the preview
 * @param {func}    [onStartingVideo] - Optional callback for every time the user mouses over or focuses on the hover preview and we attempt to start the video
 * @param {func}    [onStartedVideo] - Optional callback for when the video has been successfully started
 * @param {func}    [onStoppingVideo] - Optional callback for every time the user mouses out or blurs the hover preview and we attempt to stop the video
 * @param {func}    [onStoppedVideo] - Optional callback for when the video has successfully been stopped
 * @param {bool}    [isVideoMuted=true] - Whether the video player should be muted
 * @param {bool}    [shouldShowVideoControls=false] - Whether the video player should show the browser's controls
 * @param {bool}    [shouldVideoLoop=true] - Whether the video player should loop when it reaches the end
 * @param {string}  [videoPreload='metadata'] - What the video should preload. Possible values:
 *                                              - 'none': No part of the video will be preloaded before we try to play it
 *                                              - 'metadata' (default): Only the video's metadata will be preloaded, including information such as its length
 *                                              - 'auto': The entire video will be preloaded even if it may not be played
 * @param {string}  [className] - Optional className to apply custom styling to the container element
 * @param {string}  [overlayWrapperClassName] - Optional className to apply custom styling to the overlay contents' wrapper
 * @param {string}  [videoClassName] - Optional className to apply custom styling to the video element
 * @param {object}  [style] - Style object to apply custom CSS styles to the hover preview container
 */
const HoverVideoPreview = React.forwardRef(
  (
    {
      videoSrc,
      videoCaptions,
      previewOverlay,
      loadingStateOverlay,
      overlayFadeTransitionDuration = 400,
      shouldRestartOnVideoStopped = true,
      onStartingVideo,
      onStartedVideo,
      onStoppingVideo,
      onStoppedVideo,
      isVideoMuted = true,
      shouldShowVideoControls = false,
      shouldVideoLoop = true,
      videoPreload = 'metadata',
      className = '',
      overlayWrapperClassName = '',
      videoClassName = '',
      style = null,
    },
    ref
  ) => {
    const [hoverPreviewState, setHoverPreviewState] = React.useState(
      HOVER_PREVIEW_STATE.stopped
    );

    const videoRef = React.useRef();
    const pauseVideoTimeoutRef = React.useRef();
    const playPromiseRef = React.useRef();

    React.useEffect(() => {
      // Manually setting the `muted` attribute on the video element via an effect in order
      // to avoid a know React issue with the `muted` prop not applying correctly on initial render
      // https://github.com/facebook/react/issues/10389
      const { current: videoElement } = videoRef;
      if (isVideoMuted) {
        videoElement.setAttribute('muted', '');
      } else {
        videoElement.removeAttribute('muted');
      }
    }, [isVideoMuted]);

    // Parse the `videoSrc` prop into an array of VideoSource objects to be used for the video player
    const parsedVideoSources = React.useMemo(() => {
      if (videoSrc == null) {
        // A videoSrc value is required in order to make the video player work
        console.error(
          "Error: 'videoSrc' prop is required for HoverVideoPreview component"
        );

        return [];
      }

      return (
        // Make sure we can treat the videoSrc value as an array
        []
          .concat(videoSrc)
          // Parse our video source values into an array of VideoSource objects that can be used to render sources for the video
          .reduce((sourceArray, source) => {
            if (typeof source === 'string') {
              // If the source is a string, it's an src URL so format it into a VideoSource object and add it to the array
              sourceArray.push({ src: source });
            } else if (source && source.src) {
              // If the source is an object with an src, just add it to the array
              sourceArray.push({ src: source.src, type: source.type });
            } else {
              // Log an error if one of the videoSrc values is invalid
              console.error(
                "Error: invalid value provided to HoverVideoPreview prop 'videoSrc':",
                source
              );
            }

            return sourceArray;
          }, [])
      );
    }, [videoSrc]);

    const parsedVideoCaptions = React.useMemo(() => {
      // If no captions were provided, return an empty array
      if (videoCaptions == null) return [];

      return (
        // Make sure we can treat the videoSrc value as an array
        []
          .concat(videoCaptions)
          // Parse our video captions values into an array of VideoCaptionsTrack
          // objects that can be used to render caption tracks for the video
          .reduce((captionsArray, captions) => {
            if (typeof captions === 'string') {
              captionsArray.push({ src: captions });
            } else if (captions && captions.src) {
              captionsArray.push({
                src: captions.src,
                srcLang: captions.srcLang,
                label: captions.label,
              });
            } else {
              // Log an error if one of the videoCaptions values is invalid
              console.error(
                "Error: invalid value provided to HoverVideoPreview prop 'videoCaptions'",
                captions
              );
            }

            return captionsArray;
          }, [])
      );
    }, [videoCaptions]);

    /**
     * @function  attemptStopVideo
     *
     * Stops the video and fades the preview overlay in when the user mouses out from or blurs the video container element
     */
    const attemptStopVideo = () => {
      if (onStoppingVideo) onStoppingVideo();

      const stopVideo = () => {
        // Start fading the overlay back in to cover up the video before it's paused
        setHoverPreviewState(HOVER_PREVIEW_STATE.stopping);

        // If we already had a timeout going to pause the video, cancel it so we can
        // replace it with a new one
        clearTimeout(pauseVideoTimeoutRef.current);

        // Set a timeout with the duration of the overlay's fade transition so the video
        // won't stop until it's fully hidden
        pauseVideoTimeoutRef.current = setTimeout(
          () => {
            const { current: videoElement } = videoRef;

            videoElement.pause();

            if (shouldRestartOnVideoStopped) {
              // If we should restart the video, reset its time to the beginning
              videoElement.currentTime = 0;
            }

            if (onStoppedVideo) onStoppedVideo();

            // Mark that the video has been stopped
            setHoverPreviewState(HOVER_PREVIEW_STATE.stopped);
          },
          previewOverlay ? overlayFadeTransitionDuration : 0
        );
      };

      if (playPromiseRef.current instanceof Promise) {
        // If we have a promise from when we attempted to start playing the video,
        // ensure we wait to pause until the play promise is completed so we don't interrupt it
        playPromiseRef.current.finally(stopVideo);
      } else {
        // If we don't have a play attempt promise, just go ahead and pause
        stopVideo();
      }
    };

    /**
     * @function  attemptStartVideo
     *
     * Starts the video and fades the preview overlay out when the user mouses over or focuses in the video container element
     */
    const attemptStartVideo = () => {
      if (onStartingVideo) onStartingVideo();

      // If the user quickly moved their mouse away and then back over the container,
      // cancel any outstanding timeout that would pause the video
      clearTimeout(pauseVideoTimeoutRef.current);

      if (hoverPreviewState <= HOVER_PREVIEW_STATE.stopped) {
        const { current: videoElement } = videoRef;

        if (videoElement.paused) {
          // Mark that we are attempting to play the video and shouild show a loading state
          setHoverPreviewState(HOVER_PREVIEW_STATE.loading);

          // If the video is not playing already, start playing it
          // Keep a reference to the returned promise for the play attempt so we can avoid interrupting
          // it when we need to pause the video
          playPromiseRef.current = videoElement.play().then(() => {
            setHoverPreviewState(HOVER_PREVIEW_STATE.playing);

            if (onStartedVideo) onStartedVideo();
          });
        } else {
          // If the video is already playing, just make sure we keep the overlay hidden
          setHoverPreviewState(HOVER_PREVIEW_STATE.playing);
        }
      }
    };

    return (
      <div
        onMouseEnter={attemptStartVideo}
        onFocus={attemptStartVideo}
        onMouseOut={attemptStopVideo}
        onBlur={attemptStopVideo}
        className={cx(baseContainerStyle, className)}
        style={style}
        ref={ref}
      >
        {previewOverlay && (
          <FadeTransition
            isVisible={hoverPreviewState <= HOVER_PREVIEW_STATE.loading}
            duration={overlayFadeTransitionDuration}
            className={cx(baseOverlayContainerStyle, overlayWrapperClassName)}
          >
            {previewOverlay}
          </FadeTransition>
        )}
        {loadingStateOverlay && (
          <FadeTransition
            isVisible={hoverPreviewState === HOVER_PREVIEW_STATE.loading}
            duration={overlayFadeTransitionDuration}
            shouldMountOnEnter
            className={cx(baseOverlayContainerStyle, overlayWrapperClassName)}
          >
            {loadingStateOverlay}
          </FadeTransition>
        )}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          controls={shouldShowVideoControls}
          loop={shouldVideoLoop}
          playsInline
          preload={videoPreload}
          ref={videoRef}
          className={cx(baseVideoStyle, videoClassName)}
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
);

export default HoverVideoPreview;
