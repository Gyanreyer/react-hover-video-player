import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import PropSectionHeader from './shared/PropSectionHeader';
import { Type } from './shared/Highlights';

const loadingTimeoutDurationExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
  focused
/>`;

export default function Focused() {
  return (
    <>
      <PropSectionHeader
        propName="focused"
        types={['boolean']}
        defaultValue="false"
      />
      <figure>
        <figcaption>
          <em>focused</em> accepts a <Type>boolean</Type> value which, if true,
          will force the video player to play as if it is being hovered over,
          regardless of any user interactions it receives. This can be useful
          for scenarios where you may wish to implement custom behavior outside
          of standard mouse/touch interactions with the video player.
        </figcaption>
        <LiveEditableCodeSection code={loadingTimeoutDurationExampleCode} />
      </figure>
    </>
  );
}
