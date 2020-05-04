import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import PropSectionHeader from './shared/PropSectionHeader';
import { Type } from './shared/Highlights';

const overlayTransitionDurationDemoCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  // The overlay should take a full second to fade in and out
  overlayTransitionDuration={1000}
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

export default function OverlayTransitionDuration() {
  return (
    <>
      <PropSectionHeader
        propName="overlayTransitionDuration"
        types={['number']}
        defaultValue={400}
      />
      <p>
        <em>overlayTransitionDuration</em> accepts the <Type>number</Type>{' '}
        of milliseconds that it should take for the pausedOverlay and
        loadingOverlay to fade in and out.
      </p>
      <figure>
        <figcaption>
          After the user stops hovering on the player, the video will continue
          playing until the overlay has fully faded back in to provide the most
          seamless user experience possible.
        </figcaption>
        <LiveEditableCodeSection code={overlayTransitionDurationDemoCode} />
      </figure>
      <p>
        <em>
          <b>Note:</b> if no overlays are provided, the
          overlayTransitionDuration will be ignored.
        </em>
      </p>
      <p>
        This means that when the user stops hovering on the player, the video
        will be paused immediately with no delay.
      </p>
    </>
  );
}
