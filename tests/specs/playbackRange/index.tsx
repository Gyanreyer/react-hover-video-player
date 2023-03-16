import React from "react";
import HoverVideoPlayer from "../../../src/HoverVideoPlayer";

import { mp4VideoSrc } from "../../constants";

export default function PlaybackRangeTestPage(): JSX.Element {
  return (
    <div>
      <h1>playbackRange</h1>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        playbackRangeStart={9.5}
        data-testid="hvp:startOnly-loop"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        playbackRangeStart={9.5}
        loop={false}
        restartOnPaused
        data-testid="hvp:startOnly-restart"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        playbackRangeEnd={0.5}
        data-testid="hvp:endOnly-loop"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        playbackRangeEnd={0.5}
        loop={false}
        restartOnPaused
        data-testid="hvp:endOnly-restart"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        playbackRangeStart={1}
        playbackRangeEnd={1.5}
        data-testid="hvp:startAndEnd-loop"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        playbackRangeStart={1}
        playbackRangeEnd={1.5}
        loop={false}
        restartOnPaused
        data-testid="hvp:startAndEnd-restart"
      />
    </div>
  );
}
