/**
 * Node, callback function that returns a node, or a React ref which can resolve to the desired
 * DOM Node to use as the target to attach hover interaction events to
 */
export type HoverTarget = Node | (() => Node) | React.RefObject<Node>;

type VideoProps = React.ComponentPropsWithoutRef<'video'>;

export interface HoverVideoPlayerProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Source(s) to load from and play in the video player.
   */
  videoSrc: string | React.ReactNode;
  /**
   * Captions track(s) to load and display on the video player for accessibility.
   * @defaultValue null
   */
  videoCaptions?: React.ReactNode;
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
   * Provides a custom element that should be used as the target for hover events to start/stop the video.
   * Accepts a DOM Node, a function which returns a DOM Node, or a React ref.
   * The component's container div element will be used by default if no hover target is provided.
   * @defaultValue null
   */
  hoverTarget?: Node | (() => Node) | React.RefObject<Node> | null;
  /**
   * Callback fired when the user starts hovering on the player's hover target
   * @defaultValue null
   */
  onHoverStart?: (() => void) | null;
  /**
   * Callback fired when the user stops hovering on the player's hover target
   * @defaultValue null
   */
  onHoverEnd?: (() => void) | null;
  /**
   * Contents to render over the video while the user is hovering over the player.
   * @defaultValue null
   */
  hoverOverlay?: JSX.Element | null;
  /**
   * Contents to render over the video while it's not playing.
   * @defaultValue null
   */
  pausedOverlay?: JSX.Element | null;
  /**
   * Contents to render over the video while it's loading.
   * If a `pausedOverlay` was provided, this will be overlaid on top of that.
   * @defaultValue null
   */
  loadingOverlay?: JSX.Element | null;
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
   * The duration in ms for how long of a delay there should be between when the
   * user starts hovering over the player and when the video will actually attempt
   * to start playing.
   * This prop may help with performance if you are concerned about your server getting
   * hit with too many requests as the user moves their mouse over a large number of videos.
   * @defaultValue 0
   */
  playbackStartDelay?: number;
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
   * The time in seconds that we should start loading and playing the video from using the
   * playback range media fragment identifier. If not specified, the video will
   * be played from the start.
   * @defaultValue null
   */
  playbackRangeStart?: number | null;
  /**
   * The maximum time in seconds that we can load/play the video to using the
   * playback range media fragment identifier. If not specified, the video
   * will play through to the end.
   * @defaultValue null
   */
  playbackRangeEnd?: number | null;
  /**
   * Whether the video's audio should be muted.
   * @defaultValue true
   */
  muted?: VideoProps['muted'];
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
  loop?: VideoProps['loop'];
  /**
   * Sets how much information the video element should preload before being played.
   * Accepts one of the following values:
   * - **"none"**: Nothing should be preloaded before the video is played
   * - **"metadata"**: Only the video's metadata (ie length, dimensions) should be preloaded
   * - **"auto"**: The whole video file should be preloaded even if it won't be played
   *
   * By default, the video's preload behavior will be left up to the browser; the official spec recommends
   * defaulting to "metadata", but many browsers don't follow that standard.
   * @defaultValue undefined
   */
  preload?: VideoProps['preload'];
  /**
   * Sets how the video element should handle CORS requests.
   * Accepts one of the following values:
   * - **"anonymous"**: The video element will send cross-origin requests with no credentials.
   *    This is the browser default and usually all you need for most purposes.
   * - **"use-credentials"**: The video element will send cross-origin requests with credentials.
   *
   * @defaultValue undefined
   */
  crossOrigin?: VideoProps['crossOrigin'];
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
   * @defaultValue undefined
   */
  controlsList?: VideoProps['controlsList'];
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
   * Style object to apply custom inlined styles to the component's container div element.
   * @defaultValue undefined
   */
  style?: React.CSSProperties;
  /**
   * Optional className to apply custom styling to the div element wrapping the `hoverOverlay` contents.
   * @defaultValue undefined
   */
  hoverOverlayWrapperClassName?: string;
  /**
   * Style object to apply custom inlined styles to the div element wrapping the `hoverOverlay` contents.
   * @defaultValue undefined
   */
  hoverOverlayWrapperStyle?: React.CSSProperties;
  /**
   * Optional className to apply custom styling to the div element wrapping the `pausedOverlay` contents.
   * @defaultValue undefined
   */
  pausedOverlayWrapperClassName?: string;
  /**
   * Style object to apply custom inlined styles to the div element wrapping the `pausedOverlay` contents.
   * @defaultValue undefined
   */
  pausedOverlayWrapperStyle?: React.CSSProperties;
  /**
   * Optional className to apply custom styling to the div element wrapping the `loadingOverlay` contents.
   * @defaultValue undefined
   */
  loadingOverlayWrapperClassName?: string;
  /**
   * Style object to apply custom inlined styles to the div element wrapping the `loadingOverlay` contents.
   * @defaultValue undefined
   */
  loadingOverlayWrapperStyle?: React.CSSProperties;
  /**
   * React ref to forward to the video element rendered by HoverVideoPlayer.
   * @defaultValue null
   */
  videoRef?: React.Ref<HTMLVideoElement> | null;
  /**
   * Optional unique ID to apply to the video element.
   * This can be useful for scenarios where you need to manually access
   * and manipulate the video element via `getElementById`.
   * @defaultValue undefined
   */
  videoId?: string;
  /**
   * Optional className to apply custom styling to the video element.
   * @defaultValue undefined
   */
  videoClassName?: string;
  /**
   * Style object to apply custom inlined styles to the video element.
   * @defaultValue undefined
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
