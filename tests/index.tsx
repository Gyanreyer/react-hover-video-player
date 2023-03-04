import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PlaybackTestPage from './specs/playback';
import VideoSrcTestPage from './specs/videoSrc';
import VideoSrcChangeTestPage from './specs/videoSrcChange';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/playback" element={<PlaybackTestPage />} />
        <Route path="/videoSrc" element={<VideoSrcTestPage />} />
        <Route path="/videoSrcChange" element={<VideoSrcChangeTestPage />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
