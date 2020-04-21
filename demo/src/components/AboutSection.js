import React from 'react';
import { css } from 'emotion';

import HoverVideoPlayer from '../../../src';
import LoadingSpinnerOverlay from './LoadingSpinnerOverlay';
import { breakpoints } from '../constants/sharedStyles';

export function AboutSection() {
  return (
    <section
      className={css`
        display: flex;
        margin-bottom: 48px;

        ${breakpoints.medium} {
          flex-direction: column-reverse;
        }
      `}
    >
      <div>
        <h2>What it is</h2>
        <p>
          A React component that makes it dead easy to set up a video that plays
          on hover.
        </p>
        <h2
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
          <li>Supports both mouse and touch screen interactions</li>
          <li>
            Easily add an overlay such as a thumbnail image to show while the
            video is paused
          </li>
          <li>
            Easily add a loading state overlay to show while the video is
            attempting to play
          </li>
          <li>
            Styled using <a href="https://emotion.sh/">emotion</a> CSS-in-JS
            library
          </li>
        </ul>
      </div>
      <HoverVideoPlayer
        videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        pausedOverlay={
          <img
            src="image/big_buck_bunny_thumbnail.png"
            alt=""
            className={css`
              display: block;
              width: 100%;
            `}
          />
        }
        loadingOverlay={<LoadingSpinnerOverlay />}
        className={css`
          flex: 1;
          margin: 0 0 auto 72px;

          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

          ${breakpoints.medium} {
            margin: 0 0 24px 0;
            max-width: 720px;
          }
        `}
      />
    </section>
  );
}
