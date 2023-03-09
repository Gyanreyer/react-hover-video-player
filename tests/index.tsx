import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HoverTargetTestPage from "./specs/hoverTarget";
import LoadingStateTimeoutTestPage from "./specs/loadingStateTimeout";
import OverlaysTestPage from "./specs/overlays";
import PlaybackTestPage from "./specs/playback";
import PlaybackRangeTestPage from "./specs/playbackRange";
import PlaybackStartDelayTestPage from "./specs/playbackStartDelay";
import SizingModeTestPage from "./specs/sizingMode";
import UnloadVideoOnPauseTestPage from "./specs/unloadVideoOnPause";
import VideoCaptionsTextPage from "./specs/videoCaptions";
import VideoSrcTestPage from "./specs/videoSrc";
import VideoSrcChangeTestPage from "./specs/videoSrcChange";

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/hoverTarget" element={<HoverTargetTestPage />} />
        <Route
          path="/loadingStateTimeout"
          element={<LoadingStateTimeoutTestPage />}
        />
        <Route path="/overlays" element={<OverlaysTestPage />} />
        <Route path="/playback" element={<PlaybackTestPage />} />
        <Route path="/playbackRange" element={<PlaybackRangeTestPage />} />
        <Route
          path="/playbackStartDelay"
          element={<PlaybackStartDelayTestPage />}
        />
        <Route path="/sizingMode" element={<SizingModeTestPage />} />
        <Route
          path="/unloadVideoOnPause"
          element={<UnloadVideoOnPauseTestPage />}
        />
        <Route path="/videoCaptions" element={<VideoCaptionsTextPage />} />
        <Route path="/videoSrc" element={<VideoSrcTestPage />} />
        <Route path="/videoSrcChange" element={<VideoSrcChangeTestPage />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
