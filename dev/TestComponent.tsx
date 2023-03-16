import React from "react";
import { css } from "emotion";

import HoverVideoPlayer from "../src";
import LoadingSpinnerOverlay from "./utils/LoadingSpinnerOverlay";
import ComponentProfiler from "./utils/ComponentProfiler";

interface TestComponentProps {
  videoSrc: string;
  thumbnailImageSrc: string;
}

/**
 * Do all of your testing on this component!
 * It is wrapped with a ComponentProfiler component by default,
 * which will log out render times each time the component re-renders.
 *
 * You may modify this file however you want for testing,
 * but your changes should not be committed. If you think your changes should be committed,
 * please contact the maintainer.
 */
const TestComponent = ({
  videoSrc,
  thumbnailImageSrc,
}: TestComponentProps): JSX.Element => {
  return (
    <ComponentProfiler profilerID={videoSrc}>
      {/* TEST COMPONENT HERE */}
      <HoverVideoPlayer
        videoSrc={<source src={videoSrc} />}
        pausedOverlay={
          <img
            src={thumbnailImageSrc}
            alt=""
            className={css`
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
          />
        }
        loadingOverlay={<LoadingSpinnerOverlay />}
        className={css`
          padding-top: 75%;
        `}
        sizingMode="container"
        preload="none"
        unloadVideoOnPaused
        restartOnPaused
      />
    </ComponentProfiler>
  );
};

export default TestComponent;
