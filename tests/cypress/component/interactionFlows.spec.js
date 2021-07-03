import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';

import { PausedOverlay, LoadingOverlay, makeMockVideoSrc } from '../utils';

describe('Handles interactions correctly', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('mouseEnter and mouseLeave events take the video through its play and pause flows correctly', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
      />
    );

    cy.validateVideoSrc(videoSrc);
    cy.checkVideoPlaybackState('paused');

    // The paused overlay should be visible but the loading overlay should not
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Mouse over the container to start loading/playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('loading');

    // The component's loadingStateTimeout duration should be the default 200ms,
    // so the loading overlay should still be hidden when we tick forward 199ms.
    cy.tick(199);
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Ticking forward 1ms should reveal the loading overlay
    cy.tick(1);
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
    cy.videoElement().should((videoElement) =>
      expect(videoElement.currentTime).to.be.greaterThan(0)
    );

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
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
      />
    );

    cy.validateVideoSrc(videoSrc);
    cy.checkVideoPlaybackState('paused');

    // The paused overlay should be visible but the loading overlay should not
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Touch the container to start loading/playing
    cy.triggerEventOnPlayer('touchstart');
    cy.checkVideoPlaybackState('loading');

    // The component's loadingStateTimeout duration should be the default 200ms,
    // so the loading overlay should still be hidden when we tick forward 199ms.
    cy.tick(199);
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Ticking forward 1ms should reveal the loading overlay
    cy.tick(1);
    cy.checkOverlayVisibilty({
      paused: true,
      loading: true,
    });

    // The video should successfully finish loading and start playing
    cy.checkVideoPlaybackState('playing');
    // Both overlays should be hidden
    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });

    // The video's time should have advanced if it's playing
    cy.videoElement().should((videoElement) =>
      expect(videoElement.currentTime).to.be.greaterThan(0)
    );

    // Touch an element inside the container and tick forward enough
    // where the video would be paused if this event was erroneously
    // counted as a touch outside of the player
    cy.get('[data-testid="video-element"]').trigger('touchstart');
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

  it('an attempt to play the video will correctly interrupt any attempts to pause it', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
      />
    );

    cy.validateVideoSrc(videoSrc);
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

  it('an attempt to play the video when it is already loading will be handled correctly', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
      />
    );

    cy.validateVideoSrc(videoSrc);
    cy.checkVideoPlaybackState('paused');

    // The paused overlay should be visible but the loading overlay should not
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Mouse over the video to get it to start loading
    cy.triggerEventOnPlayer('mouseenter');

    cy.checkVideoPlaybackState('loading');
    cy.tick(200);
    cy.checkOverlayVisibilty({
      paused: true,
      loading: true,
    });

    cy.triggerEventOnPlayer('mouseleave');
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // We should not run a pause timeout when the video is still in a loading state
    cy.tick(500);
    cy.checkVideoPlaybackState(
      'loading',
      'the video should still be loading even if it is no longer being hovered over'
    );

    cy.triggerEventOnPlayer('mouseenter');

    // Wait 1ms so we can give the component a moment to re-render with its updated state
    cy.wait(1);

    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    // Tick forward enough for the loading state timeout to elapse
    cy.tick(200);
    cy.checkOverlayVisibilty({
      paused: true,
      loading: true,
    });

    cy.checkVideoPlaybackState('loading', 'the video should still be loading');
    cy.checkVideoPlaybackState(
      'playing',
      'the video should finish loading and play'
    );
  });

  it('pausing the video will correctly interrupt an active attempt to play the video', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        pausedOverlay={<PausedOverlay />}
        loadingOverlay={<LoadingOverlay />}
      />
    );

    cy.validateVideoSrc(videoSrc);

    // Mouse over the video and wait for it to start playing
    cy.triggerEventOnPlayer('mouseenter');

    cy.checkVideoPlaybackState('loading');
    cy.tick(200);
    cy.checkOverlayVisibilty({
      paused: true,
      loading: true,
    });

    cy.triggerEventOnPlayer('mouseleave');
    cy.checkOverlayVisibilty({
      paused: true,
      loading: false,
    });

    cy.checkVideoPlaybackState('loading');
    // Wait for the video to finish loading
    cy.videoElement().should((videoElement) => {
      expect(videoElement.readyState).to.be.gte(
        3,
        "The video's readyState should be HAVE_FUTURE_DATA or greater."
      );
    });
    // The video should have been transitioned into a paused state
    cy.checkVideoPlaybackState('paused');

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

    cy.validateVideoSrc(videoSrc);

    cy.videoElement().should('have.property', 'loop', false);
    cy.videoElement().should('have.property', 'ended', false);

    // Get the video playing right away
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');
    // The paused overlay should be visible but the loading overlay should not
    cy.checkOverlayVisibilty({
      paused: false,
      loading: false,
    });

    // Advance the video's time to the end
    cy.videoElement()
      .should((videoElement) => {
        expect(videoElement.readyState).to.be.gte(4);
      })
      .then((videoElement) => {
        videoElement.currentTime = videoElement.duration;
      });

    // video.ended should be true to indicate the video has ended
    cy.videoElement().should('have.property', 'ended', true);
    cy.videoElement().should('have.property', 'paused', true);

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
