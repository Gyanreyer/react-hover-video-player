export interface VideoSource {
  /**
   * The src URL string to use for a video player source
   */
  src: string;
  /**
   * The media type of the video, ie 'video/mp4'
   */
  type: string;
}

/**
 * One or an array of URL strings and/or VideoSource objects describing sources that the video
 * should choose to load and play from.
 * @typedef {(string|string[]|VideoSource|VideoSource[])} VideoSrcProp
 */
export type VideoSrcProp = string | string[] | VideoSource | VideoSource[];

export interface VideoCaptionsTrack {
  /**
   * The src URL string for the captions track file
   */
  src: string;
  /**
   * The language code for the language that these captions are in
   */
  srcLang: string;
  /**
   * The title of the captions track
   */
  label: string;
  /**
   * Whether this track should be used by default if the user's preferences don't match an available srcLang
   */
  default?: boolean;
}

/**
 * One or an array of VideoCaptionsTrack objects describing closed captions that can be loaded and displayed
 * on the video for accessibility.
 * @typedef {VideoCaptionsTrack|VideoCaptionsTrack[]} VideoCaptionsProp
 */
export type VideoCaptionsProp = VideoCaptionsTrack | VideoCaptionsTrack[];

export interface HoverVideoPlayerProps {
  /**
   * Source(s) to load from and play in the video player.
   */
  videoSrc: VideoSrcProp;
  /**
   * Captions track(s) to load and display on the video player for accessibility.
   * @defaultValue null
   */
  videoCaptions?: VideoCaptionsProp;
  /**
   * Offers a prop interface for forcing the video to start/stop without DOM events.
   * When set to true, the video will begin playing and any events that would normally
   * stop it will be ignored.
   * @defaultValue false
   */
  focused?: boolean;
  /**
   * Whether the video player's default mouse and touch event handling should be disabled in favor of a fully
   * custom solution using the `focused` prop
   * @defaultValue false
   */
  disableDefaultEventHandling?: boolean;
  /**
   * Ref to a custom element that should be used as the target for hover events to start/stop the video.
   * The component's container div element will be used by default if no hover target ref is provided.
   * @defaultValue null
   */
  hoverTargetRef?: React.RefObject<HTMLElement>;
  /**
   * Contents to render over the video while it's not playing.
   * @defaultValue null
   */
  pausedOverlay?: JSX.Element;
  /**
   * Contents to render over the video while it's loading.
   * If a `pausedOverlay` was provided, this will be overlaid on top of that.
   * @defaultValue null
   */
  loadingOverlay?: JSX.Element;
  /**
   * Duration in ms to wait after attempting to start the video before showing the loading overlay.
   * @defaultValue 200
   */
  loadingStateTimeout?: number;
  /**
   * The transition duration in ms for how long it should take for
   * the `pausedOverlay` and `loadingOverlay` to fade in/out.
   * @defaultValue 400
   */
  overlayTransitionDuration?: number;
  /**
   * Whether the video should reset to the beginning every time it is paused.
   * @defaultValue false
   */
  restartOnPaused?: boolean;
  /**
   * Whether we should unload the video's sources when it is not playing
   * in order to free up memory and bandwidth for performance purposes.
   * @defaultValue false
   */
  unloadVideoOnPaused?: boolean;
  /**
   * Whether the video's audio should be muted.
   * @defaultValue true
   */
  muted?: boolean;
  /**
   * The volume that the video's audio should play at, on a scale from 0-1.
   * This will only work if the muted prop is also set to false.
   * @defaultValue 1
   */
  volume?: number;
  /**
   * Whether the video player should loop when it reaches the end.
   * @defaultValue true
   */
  loop?: boolean;
  /**
   * Sets how much information the video element should preload before being played.
   * Accepts one of the following values:
   * - **"none"**: Nothing should be preloaded before the video is played
   * - **"metadata"**: Only the video's metadata (ie length, dimensions) should be preloaded
   * - **"auto"**: The whole video file should be preloaded even if it won't be played
   *
   * By default, the video's preload behavior will be left up to the browser; the official spec recommends
   * defaulting to "metadata", but many browsers don't follow that standard.
   * @defaultValue null
   */
  preload?: 'none' | 'metadata' | 'auto';
  /**
   * Sets how the video element should handle CORS requests.
   * Accepts one of the following values:
   * - **"anonymous"**: The video element will send cross-origin requests with no credentials.
   *    This is the browser default and usually all you need for most purposes.
   * - **"use-credentials"**: The video element will send cross-origin requests with credentials.
   *
   * @defaultValue "anonymous"
   */
  crossOrigin?: 'anonymous' | 'use-credentials';
  /**
   * Sets whether the video element should have the browser's video playback controls enabled.
   * @defaultValue false
   */
  controls?: boolean;
  /**
   * Allows finer control over which controls the browser should exclude from the video playback controls.
   * Be aware that this feature is not currently supported across all major browsers.
   * Accepts a string with the following values, separated by spaces if using more than one:
   * - **"nodownload"**: Removes the download button from the video's controls
   * - **"nofullscreen"**: Removes the fullscreen button from the video's controls
   * @defaultValue null
   */
  controlsList?: string;
  /**
   * Prevents the browser from showing controls to cast the video.
   * @defaultValue true
   */
  disableRemotePlayback?: boolean;
  /**
   * Prevents the browser from showing picture-in-picture controls on the video.
   * @defaultValue true
   */
  disablePictureInPicture?: boolean;
  /**
   * Optional className to apply custom styling to the component's container div element.
   * @defaultValue null
   */
  className?: string;
  /**
   * Style object to apply custom inlined styles to the component's container div element.
   * @defaultValue null
   */
  style?: React.CSSProperties;
  /**
   * Optional className to apply custom styling to the div element wrapping the `pausedOverlay` contents.
   * @defaultValue null
   */
  pausedOverlayWrapperClassName?: string;
  /**
   * Style object to apply custom inlined styles to the div element wrapping the `pausedOverlay` contents.
   * @defaultValue null
   */
  pausedOverlayWrapperStyle?: React.CSSProperties;
  /**
   * Optional className to apply custom styling to the div element wrapping the `loadingOverlay` contents.
   * @defaultValue null
   */
  loadingOverlayWrapperClassName?: string;
  /**
   * Style object to apply custom inlined styles to the div element wrapping the `loadingOverlay` contents.
   * @defaultValue null
   */
  loadingOverlayWrapperStyle?: React.CSSProperties;
  /**
   * React ref to forward to the video element rendered by HoverVideoPlayer.
   * @defaultValue null
   */
  videoRef?: React.Ref<HTMLVideoElement>;
  /**
   * Optional unique ID to apply to the video element.
   * This can be useful for scenarios where you need to manually access
   * and manipulate the video element via `getElementById`.
   * @defaultValue null
   */
  videoId?: string;
  /**
   * Optional className to apply custom styling to the video element.
   * @defaultValue null
   */
  videoClassName?: string;
  /**
   * Style object to apply custom inlined styles to the video element.
   * @defaultValue null
   */
  videoStyle?: React.CSSProperties;
  /**
   * Describes which styling preset to apply to determine how the player's contents should be sized.
   * Accepts 4 possible values:
   * - **"video"**: Everything should be sized based on the video element's dimensions; the overlays will expand to cover the video.
   * - **"overlay"**: Everything should be sized based on the paused overlay's dimensions; the video element will expand to fit inside those dimensions.
   * - **"container"**: Everything should be sized based on the component's outer container div element; the overlays and video will all expand to cover the container.
   * - **"manual"**: Manual mode disables preset styling and allows the developer to exercise full control over how everything should be sized.
   *                  This means you will likely need to provide your own custom styling for both the paused overlay and the video element.
   *
   * @defaultValue "video"
   */
  sizingMode?: 'video' | 'overlay' | 'container' | 'manual';
}
