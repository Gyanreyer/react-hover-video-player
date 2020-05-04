import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import PropSectionHeader from './shared/PropSectionHeader';
import { Type } from './shared/Highlights';

const loadingTimeoutDurationExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  // The player should show a loading state if the video is not able
  // to start playing after 10ms
  loadingStateTimeout={10}
  pausedOverlay={
    <img
      src="image/butterflies_demo_thumbnail.jpg"
      alt=""
      className="demo-thumbnail-image"
    />
  }
  loadingOverlay={
    <div className="demo-loading-overlay">
      Loading...
    </div>
  }
/>`;

export default function LoadingStateTimeout() {
  return (
    <>
      <PropSectionHeader
        propName="loadingStateTimeout"
        types={['number']}
        defaultValue={200}
      />
      <figure>
        <figcaption>
          <em>loadingStateTimeout</em> accepts the <Type>number</Type> of
          milliseconds that the player should wait before showing a loading
          state if the video is not able to play immediately.
        </figcaption>
        <LiveEditableCodeSection code={loadingTimeoutDurationExampleCode} />
      </figure>
    </>
  );
}
