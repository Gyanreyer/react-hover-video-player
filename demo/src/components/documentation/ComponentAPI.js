import React from 'react';
import { css } from 'emotion';

import SectionHeading from '../SectionHeading';
import VideoSrc from './VideoSrc';
import PausedOverlay from './PausedOverlay';
import LoadingOverlay from './LoadingOverlay';
import OverlayFadeTransitionDuration from './OverlayFadeTransitionDuration';
import LoadingStateTimeoutDuration from './LoadingStateTimeoutDuration';

export default function ComponentAPI() {
  return (
    <>
      <SectionHeading
        id="component-api"
        isMajorSectionHeading
        className={css`
          margin: 0;
        `}
      >
        Component API
      </SectionHeading>
      <section
        className={css`
          margin-left: 10px;

          p,
          figure {
            margin-left: 8px;
          }

          h3 {
            margin: 20px 0 8px;

            :first-of-type {
              margin-top: 0;
            }
          }
        `}
      >
        <VideoSrc />
        <PausedOverlay />
        <LoadingOverlay />
        <OverlayFadeTransitionDuration />
        <LoadingStateTimeoutDuration />
      </section>
    </>
  );
}
