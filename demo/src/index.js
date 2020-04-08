import React from 'react';
import { render } from 'react-dom';

import HoverVideoPlayer, { LoadingSpinnerOverlay } from '../../src';

import styles from './styles.scss';

const galleryVideoSources = [
  [
    {
      src: 'video/react-hover-video-player-sample-video.webm',
      type: 'video/webm',
    },
    {
      src:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4',
    },
  ],
  'video/react-hover-video-player-sample-video.mp4',
  {
    src: 'video/react-hover-video-player-sample-video.webm',
    type: 'video/webm',
  },
];

const GalleryVideo = ({ videoSrc }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <a
      href="#top"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <HoverVideoPlayer
        isFocused={isFocused}
        pausedOverlay={
          <div className={styles.PausedOverlay}>
            Check out these butterflies
          </div>
        }
        loadingStateOverlay={<LoadingSpinnerOverlay />}
        videoSrc={videoSrc}
        style={{
          maxWidth: 400,
        }}
      />
    </a>
  );
};

const Demo = () => (
  <div id="top">
    <h1>Example Video Gallery</h1>
    <div className={styles.GalleryGrid}>
      {galleryVideoSources.map((videoSrc) => (
        <React.Fragment key={videoSrc.src || videoSrc}>
          <GalleryVideo videoSrc={videoSrc} />
        </React.Fragment>
      ))}
    </div>
  </div>
);
export default Demo;

render(<Demo />, document.querySelector('#demo'));
