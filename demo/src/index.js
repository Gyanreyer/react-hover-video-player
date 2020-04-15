import React from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import HoverVideoPlayer from '../../src';
import {
  LoadingSpinnerOverlay,
  DotLoaderOverlay,
} from '../../src/LoadingOverlays';
import { codeEditorTheme, pausedOverlayDemoCode } from './liveEditorConstants';
import { breakpoints } from './sharedStyles';

const Demo = () => (
  <div
    className={css`
      margin: 0 auto;
      max-width: 80%;

      ${breakpoints.medium} {
        max-width: 85%;
      }
    `}
  >
    <h1>React Hover Video Player</h1>
    <div
      className={css`
        margin-bottom: 24px;

        ${breakpoints.medium} {
          margin-bottom: 12px;
        }

        img {
          margin-right: 8px;
        }
      `}
    >
      <img
        src="https://travis-ci.org/Gyanreyer/react-hover-video-player.svg?branch=master"
        alt="build status"
      />
      <img
        src="https://badge.fury.io/js/react-hover-video-player.svg"
        alt="npm version"
      />
      <img
        src="https://codecov.io/gh/Gyanreyer/react-hover-video-player/branch/master/graph/badge.svg"
        alt="code coverage"
      />
      <img
        src="https://img.shields.io/bundlephobia/minzip/react-hover-video-player?label=gzip%20size"
        alt="gzip size"
      />
    </div>
    <section
      className={css`
        display: flex;
        margin-bottom: 24px;

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
        videoSrc="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        pausedOverlay={<img src="image/big_buck_bunny_thumbnail.png" alt="" />}
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
    <h2>Usage</h2>
    <div
      className={css`
        margin: 24px auto;
        border-radius: 4px;
        overflow: hidden;

        display: flex;

        ${breakpoints.medium} {
          margin: 12px 0 24px 0;
          max-width: 720px;

          flex-direction: column-reverse;
        }
      `}
    >
      <LiveProvider
        scope={{
          css,
          HoverVideoPlayer,
          LoadingSpinnerOverlay,
          DotLoaderOverlay,
        }}
        code={pausedOverlayDemoCode}
      >
        <div
          className={css`
            background-color: #1e1e1e;
            flex: 1;
          `}
        >
          <LiveEditor theme={codeEditorTheme} />
        </div>
        <div
          className={css`
            max-width: 480px;

            ${breakpoints.medium} {
              grid-row-start: 1;
              max-width: unset;
            }
          `}
        >
          <LiveError />
          <LivePreview />
        </div>
      </LiveProvider>
    </div>
  </div>
);
export default Demo;

render(<Demo />, document.getElementById('react-hover-video-player-demo'));
