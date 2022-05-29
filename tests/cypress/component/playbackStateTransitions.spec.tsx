import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { PausedOverlay, LoadingOverlay, makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

describe('The video player transitions between states as expected', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('an attempt to play the video will correctly interrupt any attempts to pause it', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
      />
    );

    cy.checkVideoPlaybackState('paused');

    // The paused overlay should be visible but the loading overlay should not
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Mouse over the video and wait for it to start playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });

    // Mouse out to pause the video again
    cy.triggerEventOnPlayer('mouseleave');

    // The paused overlay should be fading back in
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // The component's overlayTransition duration should be the default 400ms,
    // so the video should still be playing when we tick forward 399ms.
    cy.tick(399);
    cy.checkVideoPlaybackState(
      'playing',
      'the video should still be playing because overlayTransitionDuration has not elapsed'
    );

    // Mouse back over the player. This should cancel the pause attempt
    // that's currently pending
    cy.triggerEventOnPlayer('mouseenter');

    // Both overlays should be hidden again
    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });

    cy.tick(500);
    cy.checkVideoPlaybackState(
      'playing',
      'the video should still be playing because the pause timeout was cancelled'
    );
  });

  it.only('pausing the video will correctly interrupt an active attempt to play the video', () => {
    const videoSrc = makeMockVideoSrc({
      throttleKbps: 200,
    });

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
        overlayTransitionDuration={5}
        loadingStateTimeout={10}
      />
    );

    cy.log('Mouse over the video and wait for it to start playing');
    cy.triggerEventOnPlayer('mouseenter');

    cy.checkVideoPlaybackState('loading');
    cy.checkOverlayVisibilty({
      paused: true,
      loading: true,
    });

    cy.log('Mouse out to interrupt the playback attempt');
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    cy.log('The video should be paused instead of loading now');
    cy.checkVideoPlaybackState('paused');

    cy.log('The video should not have loaded enough to play');
    cy.get(videoElementSelector)
      .invoke('prop', 'readyState')
      .should('be.lt', HTMLMediaElement.HAVE_FUTURE_DATA);

    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });
  });

  it('the video correctly handles states when the video ends without looping', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
        loop={false}
      />
    );

    cy.get(videoElementSelector).invoke('prop', 'loop').should('be.false');
    cy.get(videoElementSelector).invoke('prop', 'ended').should('be.false');

    // Get the video playing right away
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');
    // The paused overlay should be visible but the loading overlay should not
    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });

    // Advance the video's time to well past the end
    cy.get(videoElementSelector).invoke('prop', 'currentTime', 10);

    // video.ended should be true to indicate the video has ended
    cy.get(videoElementSelector).invoke('prop', 'ended').should('be.true');
    cy.get(videoElementSelector).invoke('prop', 'paused').should('be.true');

    // The overlays should still be hidden even though the video isn't actually playing
    // because the user hasn't moused out
    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });

    // Properly mouse out to make the paused overlay visibile again
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState(
      'playing',
      'playback should resume successfully after the video is ended'
    );

    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });
  });
});
