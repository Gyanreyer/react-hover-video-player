import React from 'react';
import { css } from 'emotion';

import { breakpoints } from '../constants/sharedStyles';

export function Heading() {
  return (
    <header
      className={css`
        grid-column: 2 / 3;
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
        <a href="https://www.npmjs.com/package/react-hover-video-player">
          <img
            src="https://badgen.net/npm/v/react-hover-video-player"
            alt="npm version"
          />
        </a>
        <a href="https://bundlephobia.com/result?p=react-hover-video-player">
          <img
            src="https://badgen.net/bundlephobia/minzip/react-hover-video-player"
            alt="gzip size"
          />
        </a>
        <a href="https://codecov.io/gh/Gyanreyer/react-hover-video-player">
          <img
            src="https://codecov.io/gh/Gyanreyer/react-hover-video-player/branch/master/graph/badge.svg"
            alt="code coverage"
          />
        </a>
        <a href="https://travis-ci.com/Gyanreyer/react-hover-video-player.svg?branch=master">
          <img
            src="https://travis-ci.com/Gyanreyer/react-hover-video-player.svg?branch=master"
            alt="build status"
          />
        </a>
      </div>
    </header>
  );
}
