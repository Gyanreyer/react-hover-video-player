import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import SectionHeading from '../SectionHeading';

const overlayTransitionDurationDemoCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  // The overlay should take a full second to fade in and out
  overlayFadeTransitionDuration={1000}
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

export default function OverlayFadeTransitionDuration() {
  return (
    <>
      <SectionHeading id="overlayFadeTransitionDuration">
        overlayFadeTransitionDuration
      </SectionHeading>
      <p>
        <b>type:</b> <type>number</type> | <b>default:</b> <value>400</value>
      </p>
      <p>
        <em>overlayFadeTransitionDuration</em> accepts the <type>number</type>{' '}
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
          overlayFadeTransitionDuration will be ignored.
        </em>
      </p>
      <p>
        This means that when the user stops hovering on the player, the video
        will be paused immediately with no delay.
      </p>
    </>
  );
}
