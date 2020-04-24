import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import DocSectionHeading from './DocSectionHeading';

const pausedOverlayExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  pausedOverlay={
    <img
      src="image/big_buck_bunny_thumbnail.png"
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
      <DocSectionHeading id="pausedOverlay">pausedOverlay</DocSectionHeading>
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
