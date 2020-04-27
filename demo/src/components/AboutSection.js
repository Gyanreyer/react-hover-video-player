import React from 'react';
import { css } from 'emotion';

import HoverVideoPlayer from '../../../src';
import LoadingSpinnerOverlay from './LoadingSpinnerOverlay';
import SectionHeading from './SectionHeading';

export function AboutSection() {
  return (
    <section>
      <HoverVideoPlayer
        videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        pausedOverlay={
          <img
            src="image/big_buck_bunny_thumbnail.jpg"
            alt=""
            className={css`
              display: block;
              width: 100%;
            `}
          />
        }
        loadingOverlay={<LoadingSpinnerOverlay />}
        className={css`
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

          margin: 0 0 12px 0;
          max-width: 640px;
        `}
      />
      <div>
        <SectionHeading id="about" isMajorSectionHeading>
          What it is
        </SectionHeading>
        <p>
          A React component that makes it dead easy to set up a video that plays
          on hover.
        </p>
        <SectionHeading id="features" isMajorSectionHeading>
          Features
        </SectionHeading>
        <ul
          className={css`
            padding-inline-start: 24px;
            margin: 0 0 12px;
            line-height: 24px;
          `}
        >
          <li>Robust support for both mouse and touchscreen interactions</li>
          <li>Easily add custom thumbnails and loading state overlays</li>
          <li>Lightning fast</li>
          <li>No dependencies</li>
          <li>Simple and easy to customize</li>
        </ul>
      </div>
    </section>
  );
}
