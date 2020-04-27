import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import PropSectionHeader from './shared/PropSectionHeader';
import { Type } from './shared/Highlights';

const loadingTimeoutDurationExampleCode = `<HoverVideoPlayer
  // For demonstration purposes, this videoSrc does not exist so
  // the player should just get stuck in a loading state
  videoSrc="nonexistent-video.mp4"
  // The player should show a loading state if the video is not able
  // to start playing after 500ms
  loadingStateTimeoutDuration={500}
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

export default function LoadingStateTimeoutDuration() {
  return (
    <>
      <PropSectionHeader
        propName="loadingStateTimeoutDuration"
        types={['number']}
        defaultValue={200}
      />
      <figure>
        <figcaption>
          <em>loadingStateTimeoutDuration</em> accepts the <Type>number</Type>{' '}
          of milliseconds that the player should wait before showing a loading
          state if the video is not able to play immediately.{' '}
        </figcaption>
        <LiveEditableCodeSection code={loadingTimeoutDurationExampleCode} />
      </figure>
    </>
  );
}
