// Enumerates states that the video can be in
export const VIDEO_STATE = {
  paused: 'paused',
  loading: 'loading',
  playing: 'playing',
};

// Enumerates states that the hover player can be in
export const HOVER_PLAYER_STATE = {
  paused: 'paused',
  loading: 'loading',
  playing: 'playing',
};

// Enumerates sizing modes which define how the player's contents should be sized relative to each other
export const SIZING_MODES = {
  // Everything should be sized based on the paused overlay's dimensions - the video element will expand to fill that space
  overlay: 'overlay',
  // Everything should be sized based on the video element's dimensions - the overlays will expand to cover the video
  video: 'video',
  // Everything should be sized based on the player's outer container div - the overlays and video will all expand to cover
  // the container
  container: 'container',
  // Manual mode does not apply any special styling and allows the developer to exercise full control
  // over how everything should be sized - this means you will likely need to provide your own custom styling for
  // both the paused overlay and the video element
  manual: 'manual',
};

// CSS styles to make some contents in the player expand to fill the container
export const expandToFillContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

// Styles to apply to the paused overlay wrapper and video element for different sizing modes
export const pausedOverlayWrapperSizingStyles = {
  [SIZING_MODES.overlay]: {
    position: 'relative',
  },
  [SIZING_MODES.video]: expandToFillContainerStyle,
  [SIZING_MODES.container]: expandToFillContainerStyle,
  [SIZING_MODES.manual]: null,
};

export const videoSizingStyles = {
  [SIZING_MODES.overlay]: expandToFillContainerStyle,
  [SIZING_MODES.video]: {
    display: 'block',
    width: '100%',
  },
  [SIZING_MODES.container]: expandToFillContainerStyle,
  [SIZING_MODES.manual]: null,
};
