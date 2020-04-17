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
export const LoadingSpinnerOverlay = ({
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

// DotLoaderOverlay styles
const baseDotStyle = css`
  background-color: white;
  border-radius: 50%;

  &:last-child {
    margin-right: 0 !important;
  }
`;

const dotBounceAnimation = css`
  animation-name: dot-bounce-animation;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;

  @keyframes dot-bounce-animation {
    0% {
      transform: translate(0);
    }

    25% {
      transform: translateY(-60%);
    }

    50%,
    100% {
      transform: translate(0);
    }
  }
`;

const dotGrowAnimation = css`
  animation-name: dot-grow-animation;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  transform-origin: 50% 50%;

  @keyframes dot-grow-animation {
    0% {
      transform: scale(0);
    }

    40% {
      transform: scale(1);
    }

    80%,
    100% {
      transform: scale(0);
    }
  }
`;

const DOT_LOADER_ANIMATION_CLASSES = {
  bounce: dotBounceAnimation,
  grow: dotGrowAnimation,
};

const DotLoaderDot = ({
  animationType,
  animationDuration,
  dotSize,
  dotNumber,
}) => (
  <div
    className={cx(
      baseDotStyle,
      DOT_LOADER_ANIMATION_CLASSES[animationType.toLowerCase()]
    )}
    style={{
      animationDuration: `${animationDuration}ms`,
      animationDelay: `${dotNumber * animationDuration * 0.14}ms`,
      width: dotSize,
      height: dotSize,
      marginRight: dotSize * 0.75,
    }}
  />
);

/**
 * @component DotLoaderOverlay
 *
 * Renders a loading overlay for the HoverVideoPlayer which shows three dots in a line which can be
 * set to animate by growing/shrinking or bouncing up and down
 *
 * @param {string}  [animationType="grow"] - The type of animation the dots should use. Supported animation types:
 *                                           - "grow": Makes the dots grow/shrink
 *                                           - "bounce": Makes the dots bounce up and down
 * @param {number}  [animationDuration=1500] - The duration in ms that it should take for the animation to complete one cycle
 * @param {number}  [dotSize=18] - The pixel width/height that the dots should display at
 * @param {bool}    [shouldShowDarkenedBackground=true] - Whether the loading overlay should have a semi-transparent background which darkens the contents behind it
 * @param {string}  [className] - Custom className to apply to the loading overlay wrapper
 */
export const DotLoaderOverlay = ({
  animationType = 'grow',
  animationDuration = 1500,
  dotSize = 18,
  shouldShowDarkenedBackground = true,
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
    <DotLoaderDot
      animationType={animationType}
      animationDuration={animationDuration}
      dotSize={dotSize}
      dotNumber={1}
    />
    <DotLoaderDot
      animationType={animationType}
      animationDuration={animationDuration}
      dotSize={dotSize}
      dotNumber={2}
    />
    <DotLoaderDot
      animationType={animationType}
      animationDuration={animationDuration}
      dotSize={dotSize}
      dotNumber={3}
    />
  </div>
);
