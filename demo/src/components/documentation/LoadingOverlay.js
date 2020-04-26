import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import SectionHeading from '../SectionHeading';

const loadingOverlayExampleCode = `<HoverVideoPlayer
  // For demonstration purposes, this videoSrc does not exist so
  // the player should just get stuck in a loading state
  videoSrc="nonexistent-video.mp4"
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

export default function LoadingOverlay() {
  return (
    <>
      <SectionHeading id="loadingOverlay">loadingOverlay</SectionHeading>
      <p>
        <b>type:</b> <type>node</type> | <b>default:</b> <value>null</value>
      </p>
      <p>
        <em>loadingOverlay</em> accepts a <type>node</type> which will be
        rendered on top of the video while it is loading.
      </p>
      <figure>
        <figcaption>
          This allows you to display a custom loading state if you would like to
          provide a better experience for users on slower connections who may
          not be able to play the video right away.
        </figcaption>
        <LiveEditableCodeSection code={loadingOverlayExampleCode} />
      </figure>
      <p>
        The{' '}
        <em>
          <a href="#loadingStateTimeoutDuration" className="always-underlined">
            loadingStateTimeoutDuration
          </a>
        </em>{' '}
        prop allows you to set how long the player should wait before showing a
        loading state if the video is not able to play immediately.
      </p>
    </>
  );
}
