import React from 'react';
import HoverVideoPlayer from '../../src/HoverVideoPlayer';

import { mp4VideoSrc, webmVideoSrc } from '../constants';

export default function VideoSrcTestPage(): JSX.Element {
  return (
    <div>
      <h1>videoSrc</h1>
      <HoverVideoPlayer videoSrc={mp4VideoSrc} data-testid="mp4-string-only" />
      <HoverVideoPlayer
        videoSrc={<source src={webmVideoSrc} type="video/webm" />}
        data-testid="webm-source-element-only"
      />
      <HoverVideoPlayer
        videoSrc={
          <>
            <source src={webmVideoSrc} type="video/webm" />
            <source src={mp4VideoSrc} type="video/mp4" />
          </>
        }
        data-testid="2-source-elements"
      />
    </div>
  );
}
