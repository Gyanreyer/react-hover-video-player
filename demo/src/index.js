import React from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';

import HoverVideoPlayer, { LoadingSpinnerOverlay } from '../../src';

const Demo = () => (
  <div id="top">
    <h1>Example Video Gallery</h1>
    <div
      className={css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
      `}
    >
      <HoverVideoPlayer
        videoSrc="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        shouldRestartOnVideoStopped={false}
        pausedOverlay={
          <img
            src="image/big_buck_bunny_thumbnail.png"
            alt="Big Buck Bunny"
            style={{ width: '100%' }}
          />
        }
        loadingOverlay={<LoadingSpinnerOverlay />}
        style={{
          maxWidth: 400,
        }}
      />
      <HoverVideoPlayer
        videoSrc={[
          {
            src: 'video/react-hover-video-player-sample-video.webm',
            type: 'video/webm',
          },
          'video/react-hover-video-player-sample-video.mp4',
        ]}
        loadingOverlay={<LoadingSpinnerOverlay />}
        style={{
          maxWidth: 400,
        }}
      />
    </div>
  </div>
);
export default Demo;

render(<Demo />, document.querySelector('#demo'));
