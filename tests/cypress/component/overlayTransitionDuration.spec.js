import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { PausedOverlay, LoadingOverlay, makeMockVideoSrc } from '../utils';
import {
  pausedOverlayWrapperSelector,
  loadingOverlayWrapperSelector,
} from '../constants';

describe('overlayTransitionDuration', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('Stop attempts take the amount of time set by overlayTransitionDuration prop if a pausedOverlay is provided', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        overlayTransitionDuration={900}
      />
    );

    // The transition duration on the paused overlay wrapper
    // should match the overlayTransitionDuration prop value
    cy.get(pausedOverlayWrapperSelector).should(
      'have.css',
      'transition-duration',
      '0.9s'
    );

    // Hover to start playing the video
    cy.triggerEventOnPlayer('mouseenter');

    // Wait for the video to finish loading and start playing
    cy.checkVideoPlaybackState('playing');
    cy.checkOverlayVisibilty({
      paused: false,
    });

    // Mouse out to stop the video
    cy.triggerEventOnPlayer('mouseleave');

    // The pause overlay should be visible/fading back in
    cy.checkOverlayVisibilty({
      paused: true,
    });

    // Make sure that the video doesn't get paused until the transition duration has fully elapsed
    // Advance timer just up to before the pause timeout should complete
    cy.tick(899);
    cy.checkVideoPlaybackState('playing');

    // Advance time by 1ms so the pause timeout can run
    cy.tick(1);
    cy.checkVideoPlaybackState('paused');
  });

  it('Stop attempts stop immediately if a pausedOverlay is not provided', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        loadingOverlay={<LoadingOverlay />}
        overlayTransitionDuration={900}
      />
    );

    // We shouldn't have a paused overlay at all
    cy.checkOverlayVisibilty({
      loading: false,
    });

    // The transition duration on the loading overlay wrapper
    // should match the overlayTransitionDuration prop value
    cy.get(loadingOverlayWrapperSelector).should(
      'have.css',
      'transition-duration',
      '0.9s'
    );

    // Hover to start playing the video
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    // Mouse out to stop the video
    cy.triggerEventOnPlayer('mouseleave');

    // The video should be paused right away with no timeout
    cy.checkVideoPlaybackState('paused');
  });
});
