# React Hover Video Player

[![npm version](https://badgen.net/npm/v/react-hover-video-player)](https://www.npmjs.com/package/react-hover-video-player)
[![minzipped size](https://badgen.net/bundlephobia/minzip/react-hover-video-player)](https://bundlephobia.com/result?p=react-hover-video-player)
[![code coverage](https://codecov.io/gh/Gyanreyer/react-hover-video-player/branch/master/graph/badge.svg)](https://codecov.io/gh/Gyanreyer/react-hover-video-player)
[![build status](https://travis-ci.com/Gyanreyer/react-hover-video-player.svg?branch=master)](https://travis-ci.com/Gyanreyer/react-hover-video-player.svg?branch=master)

# [Docs 📚](https://react-hover-video-player.dev/)

A React component that makes it dead easy to set up a video that plays on hover.

## Features 💡
- Supports both mouse and touch screen interactions
- Easily add an overlay such as a thumbnail image to show while the video is paused
- Easily add a loading state overlay to show while the video is attempting to play
- No dependencies
- Super simple


## Quick Start 🏃
### Installation
`npm install react-hover-video-player`

### Basic Setup
```javascript
import HoverVideoPlayer from 'react-hover-video-player';

function MyComponent () {
  return (
    <HoverVideoPlayer
      videoSrc="path-to/your-video.mp4"
      pausedOverlay={<img src="thumbnail-image.jpg" alt="" />}
      loadingOverlay={<div className="loading-spinner" />}
    />
  );
}
```