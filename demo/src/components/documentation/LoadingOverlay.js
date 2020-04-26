import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import SectionHeading from '../SectionHeading';

const pausedOverlayExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  loadingOverlay={null
  }
/>`;

export default function LoadingOverlay() {
  return (
    <>
      <SectionHeading id="loadingOverlay">loadingOverlay</SectionHeading>
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
