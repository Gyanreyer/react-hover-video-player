import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

describe('videoRef prop', () => {
  it("exposes a valid ref to the player's video element", () => {
    const HoverVideoPlayerWithRef = () => {
      const videoRef: React.RefObject<HTMLVideoElement> = React.useRef();

      return (
        <>
          <button
            onClick={() => {
              // Toggle the video's playback rate between 1x and 2x speed
              const videoElement = videoRef.current;
              videoElement.playbackRate =
                videoElement.playbackRate === 1 ? 2 : 1;
            }}
            data-testid="toggle-playback-rate-button"
          >
            Toggle playback rate
          </button>
          <HoverVideoPlayer videoSrc={makeMockVideoSrc()} videoRef={videoRef} />
        </>
      );
    };

    mount(<HoverVideoPlayerWithRef />);

    cy.get(videoElementSelector).invoke('prop', 'playbackRate').should('eq', 1);

    cy.get('[data-testid="toggle-playback-rate-button"]').click();

    cy.get(videoElementSelector).invoke('prop', 'playbackRate').should('eq', 2);
  });
});
