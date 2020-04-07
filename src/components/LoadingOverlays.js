import React from 'react';
import { css } from 'emotion';

/**
 * @component LoadingSpinnerOverlay
 *
 * Renders a loading overlay for the HoverVideoPlayer which shows an animated rotating semi-circle spinner
 *
 * @param {number}  [spinnerDiameter=60] - The pixel width that the spinner circle should display at
 * @param {number}  [strokeWidth=4] - The pixel width of the spinner circle's outline stroke
 * @param {number}  [animationDuration=1000] - The duration in ms that it should take for the spinner circle to complete a single rotation
 * @param {bool}    [shouldAnimateStroke=true] - Whether the circle's outline stroke should be animated so that it appears to expand and contract
 * @param {bool}    [shouldShowDarkenedBackground=true] - Whether the loading overlay should have a semi-transparent background which darkens the contents behind it
 */
export const LoadingSpinnerOverlay = ({
  spinnerDiameter = 60,
  strokeWidth = 4,
  animationDuration = 1000,
  shouldAnimateStroke = true,
  shouldShowDarkenedBackground = true,
}) => {
  const spinnerRadius = spinnerDiameter / 2;
  const spinnerRadiusWithStroke = spinnerRadius - strokeWidth / 2;
  const spinnerCircumference = 2 * spinnerRadiusWithStroke * Math.PI;

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        background-color: rgba(
          0,
          0,
          0,
          ${shouldShowDarkenedBackground ? 0.7 : 0}
        );

        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <svg
        viewBox={`0 0 ${spinnerDiameter} ${spinnerDiameter}`}
        xmlns="http://www.w3.org/2000/svg"
        className={css`
          width: ${spinnerDiameter}px;
          height: ${spinnerDiameter}px;

          animation: ${animationDuration}ms linear infinite
            spinner-rotate-animation;

          @keyframes spinner-rotate-animation {
            0% {
              transform: rotate(45deg);
            }
            100% {
              transform: rotate(405deg);
            }
          }
        `}
      >
        <circle
          cx={spinnerRadius}
          cy={spinnerRadius}
          r={spinnerRadiusWithStroke}
          className={css`
            fill: transparent;
            stroke: white;
            stroke-width: 4;
            stroke-dasharray: ${spinnerCircumference};
            stroke-linecap: round;
            transform-origin: 50% 50%;
            stroke-dashoffset: ${spinnerCircumference / 3};

            animation: ${shouldAnimateStroke
              ? `${animationDuration}ms ease-in-out infinite spinner-stroke-animation`
              : 'none'};

            @keyframes spinner-stroke-animation {
              0%,
              20% {
                stroke-dashoffset: ${spinnerCircumference * 0.99};
                transform: rotate(0);
              }

              60%,
              80% {
                stroke-dashoffset: ${spinnerCircumference / 4};
                transform: rotate(45deg);
              }

              100% {
                stroke-dashoffset: ${spinnerCircumference * 0.99};
                transform: rotate(360deg);
              }
            }
          `}
        />
      </svg>
    </div>
  );
};
