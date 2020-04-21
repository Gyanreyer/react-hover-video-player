import React from 'react';
import { css } from 'emotion';

import { breakpoints } from '../constants/sharedStyles';

export function Heading() {
  return (
    <header>
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
    </header>
  );
}
