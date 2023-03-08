import React from 'react';
import HoverVideoPlayer from '../../../src/HoverVideoPlayer';

import { mp4VideoSrc } from '../../constants';

export default function PlaybackTestPage(): JSX.Element {
  return (
    <div>
      <h1>playback</h1>
      <HoverVideoPlayer videoSrc={mp4VideoSrc} tabIndex={0} data-testid="hvp" />
    </div>
  );
}
