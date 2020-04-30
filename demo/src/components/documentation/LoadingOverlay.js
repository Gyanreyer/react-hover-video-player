import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import PropSectionHeader from './shared/PropSectionHeader';
import { Type } from './shared/Highlights';

const loadingOverlayExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
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
      <PropSectionHeader
        propName="loadingOverlay"
        types={['node']}
        defaultValue="null"
      />
      <p>
        <em>loadingOverlay</em> accepts a <Type>node</Type> which will be
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
