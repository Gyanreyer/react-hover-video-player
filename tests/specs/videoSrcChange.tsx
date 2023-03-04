import React from 'react';

import HoverVideoPlayer from '../../src/HoverVideoPlayer';

import { mp4VideoSrc, webmVideoSrc } from '../constants';

const sourceOptions = {
  mp4String: mp4VideoSrc,
  webmString: webmVideoSrc,
  mp4SourceElement: <source src={mp4VideoSrc} type="video/mp4" />,
  webmSourceElement: <source src={webmVideoSrc} type="video/webm" />,
};

export default function VideoSrcChangeTestPage(): JSX.Element {
  const [selectedVideoSrc, setSelectedVideoSrc] =
    React.useState<keyof typeof sourceOptions>('mp4String');

  return (
    <div>
      <h1>videoSrcChange</h1>
      <form>
        {Object.keys(sourceOptions).map((key) => (
          <label key={key}>
            <input
              checked={selectedVideoSrc === key}
              type="radio"
              name="videoSrc"
              id={key}
              value={key}
              onChange={(e) =>
                setSelectedVideoSrc(e.target.value as typeof selectedVideoSrc)
              }
            />
            {key}
          </label>
        ))}
      </form>
      <HoverVideoPlayer videoSrc={sourceOptions[selectedVideoSrc]} />
    </div>
  );
}
