import React from 'react';
import { render } from 'react-dom';

import HoverVideoPreview, { LoadingSpinnerOverlay } from '../../src';

const Demo = () => (
  <div>
    <h1>react-hover-video-preview Demo</h1>
    <HoverVideoPreview
      previewOverlay={
        <div
          style={{
            color: 'white',
            backgroundColor: 'red',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          Check out these butterflies
        </div>
      }
      loadingStateOverlay={<LoadingSpinnerOverlay />}
      videoSrc={[
        {
          src: 'video/react-hover-video-preview-sample-video.webm',
          type: 'video/webm',
        },
        {
          src: 'video/react-hover-video-preview-sample-video.mp4',
          type: 'video/mp4',
        },
      ]}
      style={{ maxWidth: 400 }}
    />
  </div>
);
export default Demo;

render(<Demo />, document.querySelector('#demo'));
