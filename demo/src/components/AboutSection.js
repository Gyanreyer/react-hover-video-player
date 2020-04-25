import React from 'react';
import { css } from 'emotion';

import HoverVideoPlayer from '../../../src';
import LoadingSpinnerOverlay from './LoadingSpinnerOverlay';

export function AboutSection() {
  return (
    <section
      className={css`
        margin-bottom: 48px;
      `}
    >
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

          margin: 0 0 24px 0;
        `}
      />
      <div>
        <h2 id="about">What it is</h2>
        <p>
          A React component that makes it dead easy to set up a video that plays
          on hover.
        </p>
        <h2
          id="features"
          className={css`
            margin-top: 24px;
          `}
        >
          Features
        </h2>
        <ul
          className={css`
            padding-inline-start: 24px;
            margin: 0;
            line-height: 24px;
          `}
        >
          <li>Robust support for both mouse and touchscreen interactions</li>
          <li>
            Easily add an overlay such as a thumbnail image to show while the
            video is paused
          </li>
          <li>
            Easily add a loading state overlay to show while the video is
            attempting to play
          </li>
          <li>No dependencies</li>
          <li>Simple and easy to customize</li>
        </ul>
      </div>
    </section>
  );
}
