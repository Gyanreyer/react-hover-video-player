import React from 'react';
import { render } from 'react-dom';

import HoverVideoPlayer, { LoadingSpinnerOverlay } from '../../src';

import styles from './styles.css';

const Demo = () => (
  <div id="top">
    <h1>Example Video Gallery</h1>
    <div className={styles.GalleryGrid}>
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
