import React from "react";

import HoverVideoPlayer from "../../../src/HoverVideoPlayer";

import { mp4VideoSrc } from "../../constants";

const PausedOverlay = (props: React.ComponentPropsWithoutRef<"div">) => (
  <div {...props}>Paused</div>
);

export default function SizingModeTestPage(): JSX.Element {
  return (
    <div
      style={{
        width: 400,
      }}
    >
      <h1>sizingMode</h1>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        pausedOverlayWrapperClassName="paused-overlay-wrapper"
        pausedOverlay={
          <PausedOverlay
            style={{
              background: "blue",
            }}
          />
        }
        data-testid="hvp:sizingMode-video"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        pausedOverlayWrapperClassName="paused-overlay-wrapper"
        pausedOverlay={
          <PausedOverlay
            style={{
              background: "blue",
              width: 200,
              height: 200,
            }}
          />
        }
        sizingMode="overlay"
        data-testid="hvp:sizingMode-overlay"
      />
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        style={{
          width: 123,
          height: 456,
        }}
        pausedOverlayWrapperClassName="paused-overlay-wrapper"
        pausedOverlay={
          <PausedOverlay
            style={{
              background: "blue",
            }}
          />
        }
        sizingMode="container"
        data-testid="hvp:sizingMode-container"
      />
    </div>
  );
}
