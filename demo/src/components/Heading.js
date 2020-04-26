import React from 'react';
import { css, cx } from 'emotion';

import { breakpoints } from '../constants/sharedStyles';

const badges = [
  {
    name: 'npm version',
    linkUrl: 'https://www.npmjs.com/package/react-hover-video-player',
    badgeUrl: 'https://badgen.net/npm/v/react-hover-video-player',
  },
  {
    name: 'minzipped size',
    linkUrl: 'https://bundlephobia.com/result?p=react-hover-video-player',
    badgeUrl: 'https://badgen.net/bundlephobia/minzip/react-hover-video-player',
  },
  {
    name: 'code coverage',
    linkUrl: 'https://codecov.io/gh/Gyanreyer/react-hover-video-player',
    badgeUrl:
      'https://codecov.io/gh/Gyanreyer/react-hover-video-player/branch/master/graph/badge.svg',
  },
  {
    name: 'build status',
    linkUrl: 'https://travis-ci.com/github/Gyanreyer/react-hover-video-player',
    badgeUrl:
      'https://travis-ci.com/Gyanreyer/react-hover-video-player.svg?branch=master',
  },
];

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
        `}
      >
        {badges.map(({ name, linkUrl, badgeUrl }) => (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(
              'no-underline',
              css`
                margin-right: 8px;
              `
            )}
            key={name}
          >
            <img src={badgeUrl} alt={name} />
          </a>
        ))}
      </div>
    </header>
  );
}
