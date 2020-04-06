import React from 'react';
import { css } from 'emotion';

export const LoadingSpinnerOverlay = ({
  spinnerRadius = 30,
  strokeWidth = 4,
}) => {
  const spinnerDiameter = spinnerRadius * 2;
  const spinnerRadiusWithStroke = spinnerRadius - strokeWidth / 2;
  const spinnerCircumference = 2 * spinnerRadiusWithStroke * Math.PI;

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);

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

          animation: 1s linear infinite spinner-rotate-animation;

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

            animation: 2s ease-in-out infinite spinner-stroke-animation;

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
