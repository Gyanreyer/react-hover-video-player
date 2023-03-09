import React from "react";
import HoverVideoPlayer from "../../../src/HoverVideoPlayer";

import { mp4VideoSrc, webmVideoSrc } from "../../constants";

const PausedOverlay = () => (
  <div
    style={{
      background: "red",
    }}
    data-testid="paused-overlay"
  >
    Paused
  </div>
);

const LoadingOverlay = () => (
  <div
    style={{
      background: "yellow",
    }}
    data-testid="loading-overlay"
  >
    Loading
  </div>
);

const HoverOverlay = () => (
  <div
    style={{
      background: "green",
    }}
    data-testid="hover-overlay"
  >
    Hovering
  </div>
);

export default function OverlaysTestPage(): JSX.Element {
  return (
    <div>
      <h1>overlays</h1>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        pausedOverlay={<PausedOverlay />}
        data-testid="paused-overlay-only"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        loadingOverlay={<LoadingOverlay />}
        preload="none"
        style={{
          aspectRatio: "16/9",
          width: 500,
        }}
        data-testid="loading-overlay-only"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        hoverOverlay={<HoverOverlay />}
        data-testid="hover-overlay-only"
      />
      <HoverVideoPlayer
        videoSrc={webmVideoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
        hoverOverlay={<HoverOverlay />}
        preload="none"
        style={{
          aspectRatio: "16/9",
          width: 500,
        }}
        data-testid="all-overlays"
      />
    </div>
  );
}
