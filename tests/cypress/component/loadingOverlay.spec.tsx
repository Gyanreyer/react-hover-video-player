import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { LoadingOverlay, makeMockVideoSrc } from '../utils';

describe('loadingOverlay', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('loading overlay fades in if the video is taking too long to load', () => {
    const videoSrc = makeMockVideoSrc({
      // Throttle loading the video to ensure we can step through its states as it loads
      throttleKbps: 1000,
    });

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        loadingOverlay={<LoadingOverlay />}
        loadingStateTimeout={123}
      />
    );

    cy.checkVideoPlaybackState('paused');

    // The loading overlay should be hidden
    cy.checkOverlayVisibilty({
      loading: false,
    });

    // Mouse over the container to start loading
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('loading');

    // The component's loadingStateTimeout duration is 123ms, so the loading overlay
    // should still be hidden when we tick forward 122ms.
    cy.tick(122);
    cy.checkOverlayVisibilty({
      loading: false,
    });

    // Ticking forward 1ms should reveal the loading overlay
    cy.tick(1);
    cy.checkOverlayVisibilty({
      loading: true,
    });

    // Wait for the video to finish playing
    cy.checkVideoPlaybackState('playing');
    // Loading overlay should be hidden
    cy.checkOverlayVisibilty({
      loading: false,
    });

    // Mouse out of the container to pause
    cy.triggerEventOnPlayer('mouseleave');
    // The video should pause right away
    cy.checkVideoPlaybackState('paused');

    // The loading overlay should still be hidden
    cy.checkOverlayVisibilty({
      loading: false,
    });
  });
});
