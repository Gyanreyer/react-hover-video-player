import React from 'react';

import styles from '../styles/LoadingOverlays.scss';

/**
 * @component LoadingSpinnerOverlay
 *
 * Renders a loading overlay for the HoverVideoPlayer which shows an animated rotating semi-circle spinner
 *
 * @param {number}  [spinnerDiameter=60] - The pixel width that the spinner circle should display at
 * @param {number}  [animationDuration=1000] - The duration in ms that it should take for the spinner circle to complete a single rotation
 * @param {bool}    [shouldAnimateStroke=true] - Whether the circle's outline stroke should be animated so that it appears to expand and contract
 * @param {bool}    [shouldShowDarkenedBackground=true] - Whether the loading overlay should have a semi-transparent background which darkens the contents behind it
 */
export const LoadingSpinnerOverlay = ({
  spinnerDiameter = 60,
  animationDuration = 1000,
  shouldAnimateStroke = true,
  shouldShowDarkenedBackground = true,
}) => {
  return (
    <div
      className={`${styles.Container} ${
        shouldShowDarkenedBackground ? styles.HasDarkenedBackground : ''
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.Spinner}
        style={{
          animationDuration: `${animationDuration}ms`,
        }}
        width={spinnerDiameter}
        height={spinnerDiameter}
      >
        <circle
          cx={10}
          cy={10}
          r={9}
          className={`${styles.SpinnerCircle} ${
            shouldAnimateStroke ? styles.ShouldAnimateStroke : ''
          }`}
          style={{
            animationDuration: `${animationDuration * 1.5}ms`,
          }}
        />
      </svg>
    </div>
  );
};
