import React from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a mock video src URL and hooks it up to point to our test video file.
 *
 * We should do this for each test so we can ensure we always have a unique videoSrc url
 * that isn't cached by the browser. This helps us be confident that the flow of loading a
 * video will behave the same way for each test.
 */
export const makeMockVideoSrc = (options = {}) => {
  const { throttleKbps = 1000 } = options;

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

export const PausedOverlay = () => (
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

export const LoadingOverlay = () => (
  <div
    style={{
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: 'yellow',
    }}
  >
    LOADING
  </div>
);
