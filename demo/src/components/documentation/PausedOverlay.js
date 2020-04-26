import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import SectionHeading from '../SectionHeading';

const pausedOverlayExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  pausedOverlay={
    <img
      src="image/butterflies_demo_thumbnail.jpg"
      alt=""
      style={{
        display: "block",
        width: "100%",
      }}
    />
  }
/>`;

export default function PausedOverlay() {
  return (
    <>
      <SectionHeading id="pausedOverlay">pausedOverlay</SectionHeading>
      <p>
        <em>pausedOverlay</em> accepts a node which will be rendered on top of
        the video while it is in a paused state.
      </p>
      <figure>
        <figcaption>
          This makes it easy to display a thumbnail image over the video which
          will fade out when it starts playing.
        </figcaption>
        <LiveEditableCodeSection code={pausedOverlayExampleCode} />
      </figure>
    </>
  );
}
