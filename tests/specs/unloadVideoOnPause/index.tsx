import React from "react";

import HoverVideoPlayer from "../../../src/HoverVideoPlayer";

import { mp4VideoSrc } from "../../constants";

export default function UnloadVideoOnPauseTestPage(): JSX.Element {
  return (
    <div>
      <h1>unloadVideoOnPause</h1>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        unloadVideoOnPaused
        data-testid="hvp:stringSrc"
        style={{
          aspectRatio: "16 / 9",
          background: "blue",
        }}
      />
      <HoverVideoPlayer
        videoSrc={<source src={mp4VideoSrc} type="video/mp4" />}
        unloadVideoOnPaused
        data-testid="hvp:sourceElement"
        style={{
          aspectRatio: "16 / 9",
          background: "yellow",
        }}
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        unloadVideoOnPaused
        pausedOverlay={<div>hello!!!</div>}
        pausedOverlayWrapperClassName="paused-overlay-wrapper"
        data-testid="hvp:pausedOverlay"
        style={{
          aspectRatio: "16 / 9",
          background: "magenta",
        }}
      />
    </div>
  );
}
