import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import PropSectionHeader from './shared/PropSectionHeader';
import { Type } from './shared/Highlights';

const pausedOverlayExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  pausedOverlay={
    <img
      src="image/butterflies_demo_thumbnail.jpg"
      alt=""
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  }
/>`;

export default function PausedOverlay() {
  return (
    <>
      <PropSectionHeader
        propName="pausedOverlay"
        types={['node']}
        defaultValue="null"
      />
      <p>
        <em>pausedOverlay</em> accepts a <Type>node</Type> which will be
        rendered on top of the video while it is in a paused state.
      </p>
      <figure>
        <figcaption>
          This makes it easy to display a thumbnail image over the video which
          will fade out when it starts playing.
        </figcaption>
        <LiveEditableCodeSection code={pausedOverlayExampleCode} />
      </figure>
      <p>
        The{' '}
        <em>
          <a
            href="#overlayFadeTransitionDuration"
            className="always-underlined"
          >
            overlayFadeTransitionDuration
          </a>
        </em>{' '}
        prop allows you to set how long it should take for the overlay to fade
        out when the video starts playing and fade back in when it stops
        playing.
      </p>
    </>
  );
}
