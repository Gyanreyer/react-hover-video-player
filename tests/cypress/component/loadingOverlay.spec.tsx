import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { LoadingOverlay, makeMockVideoSrc } from '../utils';
import { loadingOverlayWrapperSelector } from '../constants';

describe('loadingOverlay', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('loading overlay fades in if the video is taking too long to load', () => {
    const videoSrc = makeMockVideoSrc({
      // Throttle loading the video to ensure we can step through its states as it loads
      throttleKbps: 800,
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
    cy.get(loadingOverlayWrapperSelector).should(
      'have.css',
      'transition-delay',
      '0s'
    );

    // Mouse over the container to start loading
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('loading');

    // The component's loadingStateTimeout duration is 123ms, so the loading overlay
    // should still be hidden for now
    cy.get(loadingOverlayWrapperSelector).should(
      'have.css',
      'transition-delay',
      '0.123s'
    );
    cy.checkOverlayVisibilty({
      loading: false,
    });

    // The overlay should fade in after the 123ms delay has elapsed
    cy.wait(123);

    cy.checkOverlayVisibilty({
      loading: true,
    });

    // Wait for the video to finish playing
    cy.checkVideoPlaybackState('playing');
    cy.get(loadingOverlayWrapperSelector).should(
      'have.css',
      'transition-delay',
      '0s'
    );
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
