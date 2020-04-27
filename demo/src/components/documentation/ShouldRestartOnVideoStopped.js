import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import PropSectionHeader from './shared/PropSectionHeader';
import { Type } from './shared/Highlights';

const shouldRestartExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  shouldRestartOnVideoStopped
/>`;

export default function ShouldRestartOnVideoStopped() {
  return (
    <>
      <PropSectionHeader
        propName="shouldRestartOnVideoStopped"
        types={['boolean']}
        defaultValue="false"
      />
      <figure>
        <figcaption>
          <em>shouldRestartOnVideoStopped</em> accepts a <Type>boolean</Type>{' '}
          value which will toggle whether the video should reset to the start
          every time it pauses after the user stops hovering.
        </figcaption>
        <LiveEditableCodeSection code={shouldRestartExampleCode} />
      </figure>
    </>
  );
}
