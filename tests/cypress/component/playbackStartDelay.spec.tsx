import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc, PausedOverlay } from '../utils';

describe('playbackStartDelay', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('correctly adds a delay between when the user hovers and when the video starts actually loading and playing', () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={videoSrc} playbackStartDelay={500} />);

    // Hover to start playing the video
    cy.triggerEventOnPlayer('mouseenter');

    // The video should still be paused even though the user is hovering on the player
    cy.checkVideoPlaybackState('paused');

    cy.log(
      'Tick to 1ms short of the playback start delay; the video should still be paused'
    );
    cy.tick(499);
    cy.checkVideoPlaybackState('paused');

    cy.log(
      'Tick one more ms to complete the playback start delay; the video should start loading and playing'
    );
    cy.tick(1);
    cy.checkVideoPlaybackState('loading');
    cy.checkVideoPlaybackState('playing');

    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');
  });

  it('cancels playback attempts if the user stops hovering before the delay timeout finishes', () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={videoSrc} playbackStartDelay={500} />);

    // Hover to start playing the video
    cy.triggerEventOnPlayer('mouseenter');

    // The video should still be paused even though the user is hovering on the player
    cy.checkVideoPlaybackState('paused');

    cy.log(
      'Tick to 1ms short of the playback start delay; the video should still be paused'
    );
    cy.tick(499);
    cy.checkVideoPlaybackState('paused');

    cy.log(
      "Stop hovering before the playback start delay's timeout was able to finish"
    );
    cy.triggerEventOnPlayer('mouseleave');

    cy.log(
      'Tick forward and arbitrary amount to prove the playback attempt was cancelled'
    );
    cy.tick(1000);

    cy.checkVideoPlaybackState('paused');
  });

  it('does not delay playback if the video is already playing', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        playbackStartDelay={500}
        pausedOverlay={<PausedOverlay />}
      />
    );

    // Hover to start playing the video
    cy.triggerEventOnPlayer('mouseenter');

    // The video should still be paused even though the user is hovering on the player
    cy.checkVideoPlaybackState('paused');

    cy.log('Tick 500ms to start playing the video');
    cy.tick(500);
    cy.checkVideoPlaybackState('playing');

    cy.triggerEventOnPlayer('mouseleave');

    cy.checkOverlayVisibilty({
      paused: true,
    });
    cy.checkVideoPlaybackState('playing');

    cy.triggerEventOnPlayer('mouseenter');

    cy.log(
      "Tick forward sufficiently so the pause timeout would run if it wasn't cancelled"
    );
    cy.tick(1000);

    cy.log('The video should still be playing with no changes');
    cy.checkVideoPlaybackState('playing');
    cy.checkOverlayVisibilty({
      paused: false,
    });
  });
});
