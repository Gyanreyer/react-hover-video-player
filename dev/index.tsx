import React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';

import TestComponent from './TestComponent';
import testVideos from './constants/testVideos';

const DevPage = (): JSX.Element => (
  <main
    className={css`
      margin: 0 32px;
    `}
  >
    <h1>REACT HOVER VIDEO PLAYER</h1>
    <div
      className={css`
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 24px;
      `}
    >
      {testVideos.map(({ videoSrc, thumbnailImageSrc }) => (
        <TestComponent
          key={videoSrc}
          videoSrc={videoSrc}
          thumbnailImageSrc={thumbnailImageSrc}
        />
      ))}
    </div>
  </main>
);

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

ReactDOM.render(<DevPage />, rootElement);

export default DevPage;
