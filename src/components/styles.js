import { css } from 'emotion';

// Set up our emotion CSS classes
const basePlayerContainerStyle = css`
  position: relative;
`;

const expandToCoverPlayerStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
`;

const basePausedOverlayStyle = css`
  position: relative;
  display: block;
  width: 100%;
  z-index: 1;
  pointer-events: none;

  /* By default the paused overlay should be set to fill its available width */
  > * {
    display: block;
    width: 100%;
  }
`;

const baseLoadingOverlayStyle = css`
  z-index: 2;
  pointer-events: none;
`;

const baseVideoStyle = css`
  width: 100%;
  display: block;
  object-fit: cover;
`;

export default {
  basePlayerContainerStyle,
  expandToCoverPlayerStyle,
  basePausedOverlayStyle,
  baseLoadingOverlayStyle,
  baseVideoStyle,
};
