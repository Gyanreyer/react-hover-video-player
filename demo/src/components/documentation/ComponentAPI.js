import React from 'react';
import { css } from 'emotion';

import VideoSrc from './VideoSrc';

export default function ComponentAPI() {
  return (
    <>
      <h2
        className={css`
          margin-top: 32px;
        `}
        id="component-api"
      >
        Component API
      </h2>
      <section
        className={css`
          margin-left: 10px;
          max-width: 640px;

          p,
          figure {
            margin-left: 8px;
          }
        `}
      >
        <VideoSrc />
      </section>
    </>
  );
}
