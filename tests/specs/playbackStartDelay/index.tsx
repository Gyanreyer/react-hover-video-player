import React from "react";
import HoverVideoPlayer from "../../../src/HoverVideoPlayer";

import { mp4VideoSrc } from "../../constants";

export default function PlaybackStartDelayTestPage(): JSX.Element {
  return (
    <div>
      <h1>playbackStartDelay</h1>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        playbackStartDelay={200}
        loadingOverlayWrapperClassName="loading-overlay-wrapper"
        loadingOverlay={<div>loading</div>}
        overlayTransitionDuration={100}
        preload="none"
        data-testid="hvp"
      />
    </div>
  );
}
