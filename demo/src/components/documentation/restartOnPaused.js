import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import PropSectionHeader from './shared/PropSectionHeader';
import { Type } from './shared/Highlights';

const shouldRestartExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  restartOnPaused
/>`;

export default function RestartOnPaused() {
  return (
    <>
      <PropSectionHeader
        propName="restartOnPaused"
        types={['boolean']}
        defaultValue="false"
      />
      <figure>
        <figcaption>
          <em>restartOnPaused</em> accepts a <Type>boolean</Type> value which
          will toggle whether the video should reset to the start every time it
          pauses after the user stops hovering.
        </figcaption>
        <LiveEditableCodeSection code={shouldRestartExampleCode} />
      </figure>
    </>
  );
}
