import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import HoverVideoPlayer from 'react-hover-video-player';
import { HoverVideoPlayerProps } from '../../src/HoverVideoPlayer.types';

interface MockVideoSrcOptions {
  /**
   * Maximum download speed in kbps to throttle how quickly the video file can load;
   * This allows us to ensure the video doesn't load too fast so we
   * can observe how it handles each step of the loading process
   *
   * @defaultValue 1000
   */
  throttleKbps?: number;
}

/**
 * Generates a mock video src URL and hooks it up to point to our test video file.
 *
 * We should do this for each test so we can ensure we always have a unique videoSrc url
 * that isn't cached by the browser. This helps us be confident that the flow of loading a
 * video will behave the same way for each test.
 *
 * @param {MockVideoSrcOptions} options - Options to customize how the mock video src will be set up/loaded
 *
 * @returns {string}  The mock path to the video asset which can be set on HoverVideoPlayer's `videoSrc` prop
 */
export const makeMockVideoSrc = ({
  throttleKbps,
}: MockVideoSrcOptions = {}): string => {
  const mockVideoAssetPath = `/BigBuckBunny-${uuidv4()}.mp4`;

  cy.fixture('BigBuckBunny.mp4', 'base64').then((videoAsset) => {
    const videoAssetByteSize = Math.floor(videoAsset.length * 0.75);

    return cy.intercept('GET', mockVideoAssetPath, {
      fixture: 'BigBuckBunny.mp4',
      throttleKbps,
      statusCode: 206,
      headers: {
        'accept-ranges': 'bytes',
        'Content-Length': `${videoAssetByteSize}`,
        'Content-Range': `bytes 0-${
          videoAssetByteSize - 1
        }/${videoAssetByteSize}`,
        'content-type': 'video/mp4',
      },
    });
  });

  return mockVideoAssetPath;
};

export function PausedOverlay(): JSX.Element {
  return (
    <div
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundColor: 'red',
      }}
    >
      PAUSED
    </div>
  );
}

export function LoadingOverlay(): JSX.Element {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'yellow',
      }}
    >
      LOADING
    </div>
  );
}

export function HoverOverlay(): JSX.Element {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 180, 180, 0.7)',
        color: 'white',
      }}
    >
      HOVERING
    </div>
  );
}

export function HoverVideoPlayerWrappedWithFocusToggleButton({
  focused,
  ...props
}: HoverVideoPlayerProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(focused);

  return (
    <>
      <button
        onClick={() => setIsFocused(!isFocused)}
        data-testid="toggle-focus-button"
      >
        Toggle focus
      </button>
      <HoverVideoPlayer focused={isFocused} {...props} />
    </>
  );
}
