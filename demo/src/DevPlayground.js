/* eslint-disable no-console */
import React, { Profiler } from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';

import HoverVideoPlayer from '../../src';
import LoadingSpinnerOverlay from './components/LoadingSpinnerOverlay';
import testVideos from './constants/testVideos';

function TestPlayer({ videoSrc, thumbnailImageSrc }) {
  const renderTiming = React.useRef();
  if (!renderTiming.current) {
    renderTiming.current = {
      averageRenderTime: 0,
      renderCount: 0,
    };
  }

  // Logs out helpful render timing info for performance measurements
  const onProfilerRender = React.useCallback(
    (
      id, // the "id" prop of the Profiler tree that has just committed
      phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
      actualDuration // time spent rendering the committed update
    ) => {
      if (phase === 'mount') {
        console.log(`${videoSrc} | MOUNT: ${actualDuration}ms`);
      } else {
        renderTiming.current.renderCount += 1;
        renderTiming.current.averageRenderTime +=
          (actualDuration - renderTiming.current.averageRenderTime) /
          renderTiming.current.renderCount;
        console.log(
          `${videoSrc} | UPDATE: ${actualDuration}ms | New average: ${renderTiming.current.averageRenderTime}ms`
        );
      }
    },
    [videoSrc]
  );

  return (
    <Profiler id={videoSrc} onRender={onProfilerRender}>
      {/* TEST COMPONENT HERE */}
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={
          <img
            src={thumbnailImageSrc}
            alt=""
            className={css`
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
          />
        }
        loadingOverlay={<LoadingSpinnerOverlay />}
        className={css`
          padding-top: 75%;
        `}
        sizingMode="container"
        unloadVideoOnPaused
      />
    </Profiler>
  );
}

// Use this component for testing out the component
export default function DevPlayground() {
  return (
    <main
      className={css`
        margin: 0 32px;
      `}
    >
      <h1>REACT HOVER VIDEO PLAYER</h1>
      <div
        className={css`
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 24px;
        `}
      >
        {testVideos.map(({ videoSrc, thumbnailImageSrc }) => (
          <TestPlayer
            key={videoSrc}
            videoSrc={videoSrc}
            thumbnailImageSrc={thumbnailImageSrc}
          />
        ))}
      </div>
    </main>
  );
}

const devPlaygroundContainer = document.getElementById(
  'react-hover-video-player-dev-playground'
);

if (devPlaygroundContainer) {
  render(<DevPlayground />, devPlaygroundContainer);
}
