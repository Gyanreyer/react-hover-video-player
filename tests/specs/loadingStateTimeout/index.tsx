import React from "react";
import HoverVideoPlayer from "../../../src/HoverVideoPlayer";

import { mp4VideoSrc, webmVideoSrc } from "../../constants";

export default function LoadingStateTimeoutTestPage(): JSX.Element {
  return (
    <div>
      <h1>loadingStateTimeout</h1>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        loadingStateTimeout={0}
        loadingOverlayWrapperClassName="loading-overlay-wrapper"
        loadingOverlay={
          <div
            style={{
              background: "yellow",
            }}
          >
            Loading
          </div>
        }
        style={{
          aspectRatio: "16/9",
          background: "red",
        }}
        preload="none"
        data-testid="hvp:lst-0"
      />
      <HoverVideoPlayer
        videoSrc={webmVideoSrc}
        loadingOverlayWrapperClassName="loading-overlay-wrapper"
        loadingOverlay={
          <div
            style={{
              background: "yellow",
            }}
          >
            Loading
          </div>
        }
        style={{
          aspectRatio: "16/9",
          background: "red",
        }}
        preload="none"
        data-testid="hvp:lst-200"
      />
    </div>
  );
}
