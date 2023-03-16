import React from "react";
import HoverVideoPlayer from "../../../src/HoverVideoPlayer";

import { mp4VideoSrc, captionsSrc, gaelicSubtitlesSrc } from "../../constants";

export default function VideoCaptionsTestPage(): JSX.Element {
  return (
    <div>
      <h1>videoCaptions</h1>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        videoCaptions={
          <track
            src={captionsSrc}
            srcLang="en"
            label="English"
            kind="captions"
            default
          />
        }
        data-testid="hvp:one-caption-track"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        videoCaptions={
          <>
            <track
              src={captionsSrc}
              srcLang="en"
              label="English"
              kind="captions"
            />
            <track
              src={gaelicSubtitlesSrc}
              srcLang="ga"
              label="Gaelic (Irish)"
              kind="subtitles"
            />
          </>
        }
        data-testid="hvp:multiple-caption-tracks"
      />
    </div>
  );
}
