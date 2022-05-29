import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { PausedOverlay, LoadingOverlay, makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

describe('Handles mouse and touch events correctly', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('mouseEnter and mouseLeave events take the video through its play and pause flows correctly', () => {
    const videoSrc = makeMockVideoSrc({
      // Throttle loading the video to ensure we can step through its states as it loads
      throttleKbps: 1000,
    });

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
        loadingStateTimeout={50}
      />
    );

    cy.checkVideoPlaybackState('paused');

    // The paused overlay should be visible but the loading overlay should not
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Mouse over the container to start loading/playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('loading');

    cy.log(
      'The loading overlay should still be hidden until the loadingStateTimeout has elapsed'
    );
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    cy.log('The loading overlay should fade in');

    cy.wait(50);

    cy.checkOverlayVisibilty({
      paused: true,
      loading: true,
    });

    cy.checkVideoPlaybackState('playing');
    // Both overlays should be hidden
    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });

    // The video's time should have advanced if it's playing
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.greaterThan', 0);

    // Mouse out of the container to pause
    cy.triggerEventOnPlayer('mouseleave');

    // The paused overlay should be fading back in
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // The component's overlayTransitionDuration should be the default 400ms,
    // so the video should still be playing when we tick forward 399ms.
    cy.tick(399);
    cy.checkVideoPlaybackState(
      'playing',
      'the video should still be playing until the overlayTransitionDuration has elapsed'
    );

    // Ticking forward one more ms should pause the video
    cy.tick(1);
    cy.checkVideoPlaybackState(
      'paused',
      'the video should be paused after the overlayTransitionDuration has elapsed'
    );
  });

  it('touch events take the video through its play and pause flows correctly', () => {
    const videoSrc = makeMockVideoSrc({
      throttleKbps: 1000,
    });

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
        loadingStateTimeout={50}
      />
    );

    cy.checkVideoPlaybackState('paused');

    // The paused overlay should be visible but the loading overlay should not
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Touch the container to start loading/playing
    cy.triggerEventOnPlayer('touchstart');
    cy.checkVideoPlaybackState('loading');

    cy.log(
      'The loading overlay should still be hidden until the loadingStateTimeout has elapsed'
    );
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    cy.log('The loading overlay should fade in');
    cy.wait(50);

    cy.checkOverlayVisibilty({
      paused: true,
      loading: true,
    });

    cy.log('The video should successfully finish loading and start playing');

    cy.checkVideoPlaybackState('playing');
    // Both overlays should be hidden
    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });

    // The video's time should have advanced if it's playing
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.greaterThan', 0);

    // Touch an element inside the container and tick forward enough
    // where the video would be paused if this event was erroneously
    // counted as a touch outside of the player
    cy.get(videoElementSelector).trigger('touchstart');
    cy.tick(400);
    cy.checkVideoPlaybackState(
      'playing',
      'the video should still be playing after touching an element inside the player container'
    );

    // Touch outside of the container for real
    cy.document().then((doc) => {
      doc.body.dispatchEvent(
        new TouchEvent('touchstart', {
          bubbles: true,
        })
      );
    });

    // The paused overlay should be fading back in
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // The component's overlayTransitionDuration should be the default 400ms,
    // so the video should still be playing when we tick forward 399ms.
    cy.tick(399);
    cy.checkVideoPlaybackState(
      'playing',
      'the video should still be playing until the overlayTransitionDuration has elapsed'
    );

    // Ticking forward one more ms should pause the video
    cy.tick(1);
    cy.checkVideoPlaybackState(
      'paused',
      'the video should be paused after the overlayTransitionDuration has elapsed'
    );
  });
});
