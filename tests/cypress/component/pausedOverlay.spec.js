import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { PausedOverlay, makeMockVideoSrc } from '../utils';

describe('pausedOverlay', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('paused overlay fades in and out correctly as the video transitions through playback states', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        overlayTransitionDuration={123}
      />
    );

    cy.checkVideoPlaybackState('paused');

    // The paused overlay should be visible initially
    cy.checkOverlayVisibilty({
      paused: true,
    });

    // Mouse over the container to start loading
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('loading');

    // The paused overlay should remain visible while in a loading state
    cy.checkOverlayVisibilty({
      paused: true,
    });

    // Wait for the video to finish playing
    cy.checkVideoPlaybackState('playing');
    // Paused overlay should now be hidden
    cy.checkOverlayVisibilty({
      paused: false,
    });

    // Mouse out of the container to pause
    cy.triggerEventOnPlayer('mouseleave');
    // The video should not pause right away because the paused overlay needs
    // time to transition back in first
    cy.checkVideoPlaybackState('playing');

    // The paused overlay should be fading back in
    cy.checkOverlayVisibilty({
      paused: true,
    });

    // Our overlay transition duration is 123ms, so if we
    // tick forward 122ms, the video should still be playing
    cy.tick(122);
    cy.checkVideoPlaybackState('playing');
    // Ticking forward 1 more ms should pause the video
    cy.tick(1);
    cy.checkVideoPlaybackState('paused');

    // The paused overlay should still be hidden
    cy.checkOverlayVisibilty({
      paused: true,
    });
  });
});
