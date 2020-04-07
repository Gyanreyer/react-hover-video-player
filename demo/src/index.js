import React from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';

import HoverVideoPreview, { LoadingSpinnerOverlay } from '../../src';

const galleryVideoSources = [
  [
    {
      src: 'video/react-hover-video-preview-sample-video.webm',
      type: 'video/webm',
    },
    {
      src: 'video/react-hover-video-preview-sample-video.mp4',
      type: 'video/mp4',
    },
  ],
  'video/react-hover-video-preview-sample-video.mp4',
  {
    src: 'video/react-hover-video-preview-sample-video.webm',
    type: 'video/webm',
  },
];

const GalleryVideo = ({ videoSrc }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <a
      href="/hello"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <HoverVideoPreview
        isFocused={isFocused}
        previewOverlay={
          <div
            className={css`
              color: white;
              background-color: red;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
            `}
          >
            Check out these butterflies
          </div>
        }
        loadingStateOverlay={<LoadingSpinnerOverlay />}
        videoSrc={videoSrc}
        className={css`
          max-width: 400px;
        `}
      />
    </a>
  );
};

const Demo = () => (
  <div>
    <h1>Example Video Gallery</h1>
    <div
      className={css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 16px;
      `}
    >
      {galleryVideoSources.map((videoSrc) => (
        <GalleryVideo videoSrc={videoSrc} />
      ))}
    </div>
  </div>
);
export default Demo;

render(<Demo />, document.querySelector('#demo'));
