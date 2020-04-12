import React from 'react';
import { render } from 'react-dom';
import { css, injectGlobal } from 'emotion';

import HoverVideoPlayer from '../../src';
import {
  LoadingSpinnerOverlay,
  DotLoaderOverlay,
} from '../../src/LoadingOverlays';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');

  body {
    font-family: 'Open Sans', sans-serif;
  }
`;

const Demo = () => (
  <div>
    <h1>react-hover-video-player</h1>
    <div
      className={css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
      `}
    >
      <HoverVideoPlayer
        videoSrc="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        className={css`
          max-width: 400px;
          margin: auto 0;
        `}
        pausedOverlay={
          <img
            src="image/big_buck_bunny_thumbnail.png"
            alt="Big Buck Bunny"
            style={{ display: 'block', width: '100%' }}
          />
        }
        loadingOverlay={<LoadingSpinnerOverlay />}
      />
      <HoverVideoPlayer
        videoSrc={[
          {
            src: 'video/react-hover-video-player-sample-video.webm',
            type: 'video/webm',
          },
          'video/react-hover-video-player-sample-video.mp4',
        ]}
        shouldRestartOnVideoStopped={false}
        loadingOverlay={<DotLoaderOverlay />}
        style={{
          maxWidth: 400,
        }}
      />
    </div>
  </div>
);
export default Demo;

render(<Demo />, document.getElementById('react-hover-video-player-demo'));
