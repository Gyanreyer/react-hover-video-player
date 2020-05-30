/* eslint-disable no-console */
import React, { Profiler } from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';

import HoverVideoPlayer from '../../src';
import LoadingSpinnerOverlay from './components/LoadingSpinnerOverlay';

// Public test videos courtesy of https://gist.github.com/jsturgis/3b19447b304616f18657
const testVideos = [
  {
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailImageSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  },
  {
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailImageSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
  },
  {
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailImageSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
  },
  {
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailImageSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
  },
  {
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailImageSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
  },
  {
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailImageSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
  },
  {
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailImageSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
  },
  {
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailImageSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
  },
];

const averageRenderTimes = {
  original: {
    mount: {
      total: 0,
      average: 0,
    },
    update: {
      total: 0,
      average: 0,
    },
  },
  test: {
    mount: {
      total: 0,
      average: 0,
    },
    update: {
      total: 0,
      average: 0,
    },
  },
};

function onProfilerRender(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration // time spent rendering the committed update
) {
  const componentVersion = id.split('_')[0];
  averageRenderTimes[componentVersion][phase].total += 1;
  averageRenderTimes[componentVersion][phase].average +=
    (actualDuration - averageRenderTimes[componentVersion][phase].average) /
    averageRenderTimes[componentVersion][phase].total;

  console.log(
    `${componentVersion} | ${phase} | time: ${actualDuration}ms | new average: ${averageRenderTimes[componentVersion][phase].average}ms`
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
          <div
            className={css`
              border-radius: 4px;
              background-color: grey;
            `}
          >
            <Profiler
              id={`original_${videoSrc}`}
              key={`original_${videoSrc}`}
              onRender={onProfilerRender}
            >
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
          </div>
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
