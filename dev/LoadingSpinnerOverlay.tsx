import React from 'react';
import { css, cx } from 'emotion';

// Shared styles
const loadingOverlayWrapper = css`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const darkenedBackground = css`
  background-color: rgba(0, 0, 0, 0.7);
`;

// LoadingSpinnerOverlay styles
const animateStroke = css`
  animation-name: spinner-stroke-animation;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;

  @keyframes spinner-stroke-animation {
    0%,
    20% {
      stroke-dashoffset: 54;
      transform: rotate(0);
    }

    60%,
    80% {
      stroke-dashoffset: 14;
      transform: rotate(45deg);
    }

    100% {
      stroke-dashoffset: 54;
      transform: rotate(360deg);
    }
  }
`;

interface LoadingSpinnerOverlayProps {
  spinnerDiameter?: number;
  animationDuration?: number;
  shouldAnimateStroke?: boolean;
  shouldShowDarkenedBackground?: boolean;
  shouldShowSemiTransparentRing?: boolean;
  strokeColor?: string;
  className?: string;
}

/**
 * @component LoadingSpinnerOverlay
 *
 * Renders a loading overlay for the HoverVideoPlayer which shows an animated rotating semi-circle spinner
 *
 * @param {number}  [spinnerDiameter=60] - The pixel width that the spinner circle should display at
 * @param {number}  [animationDuration=1000] - The duration in ms that it should take for the spinner circle to complete a single rotation
 * @param {bool}    [shouldAnimateStroke=true] - Whether the circle's outline stroke should be animated so that it appears to expand and contract
 * @param {bool}    [shouldShowDarkenedBackground=true] - Whether the loading overlay should have a semi-transparent background which darkens the contents behind it
 * @param {bool}    [shouldShowSemiTransparentRing=false] - Whether the spinner should have a semi-transparent circle behind the main animated stroke
 * @param {string}  [strokeColor="#ffffff"] - The color to apply to the spinner circle's stroke
 * @param {string}  [className] - Custom className to apply to the loading overlay wrapper
 */
const LoadingSpinnerOverlay: React.FC<LoadingSpinnerOverlayProps> = ({
  spinnerDiameter = 60,
  animationDuration = 1000,
  shouldAnimateStroke = true,
  shouldShowDarkenedBackground = true,
  shouldShowSemiTransparentRing = false,
  strokeColor = '#ffffff',
  className = '',
}) => (
  <div
    className={cx(
      loadingOverlayWrapper,
      {
        [darkenedBackground]: shouldShowDarkenedBackground,
      },
      className
    )}
  >
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={css`
        animation-name: spinner-rotate-animation;
        animation-timing-function: linear;
        animation-iteration-count: infinite;

        @keyframes spinner-rotate-animation {
          0% {
            transform: rotate(45deg);
          }
          100% {
            transform: rotate(405deg);
          }
        }
      `}
      style={{
        animationDuration: `${animationDuration}ms`,
      }}
      width={spinnerDiameter}
      height={spinnerDiameter}
    >
      <circle
        cx={12}
        cy={12}
        r={10}
        className={cx(
          css`
            fill: transparent;
            stroke-width: 2px;
            stroke-dasharray: 57;
            stroke-linecap: round;
            transform-origin: 50% 50%;
            stroke-dashoffset: 18;
            z-index: 1;
          `,
          {
            [animateStroke]: shouldAnimateStroke,
          }
        )}
        style={{
          animationDuration: `${animationDuration * 1.5}ms`,
          stroke: strokeColor,
        }}
      />
      {shouldShowSemiTransparentRing && (
        <circle
          cx={12}
          cy={12}
          r={10}
          className={cx(
            css`
              fill: transparent;
              stroke-width: 2px;
              opacity: 0.2;
              z-index: 0;
            `
          )}
          style={{
            stroke: strokeColor,
          }}
        />
      )}
    </svg>
  </div>
);

export default LoadingSpinnerOverlay;
