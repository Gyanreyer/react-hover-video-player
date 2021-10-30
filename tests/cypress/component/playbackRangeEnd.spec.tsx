import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

describe('Playback works as expected when only playbackRangeEnd is set', () => {
  it('behaves correctly when loop is true and restartOnPaused is false', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        playbackRangeEnd={0.5}
        // loop is true by default
        // restartOnPaused is false by default
      />
    );

    cy.checkVideoPlaybackState('paused');

    // The video should initially be set to the start
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    // Mouse over the container to start loading/playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing', 'The video should start playing');

    cy.log('The video should play through to the end of its playback range');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.closeTo', 0.5, 0.03);

    cy.log('The video should loop back the start');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.closeTo', 0, 0.03);

    cy.checkVideoPlaybackState(
      'playing',
      'The video should still be playing after looping'
    );

    cy.log(
      'The video should play through to the end of its playback range again'
    );
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.closeTo', 0.5, 0.03);

    cy.log('The video should be looped back around to the start again');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.closeTo', 0, 0.03);

    cy.checkVideoPlaybackState(
      'playing',
      'The video should still be playing after looping a second time'
    );

    cy.log(
      'Setting the video to a time past the end of the playback range will loop it back to the start'
    );
    cy.get(videoElementSelector).invoke('prop', 'currentTime', 5);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.closeTo', 0, 0.03);

    // Mouse out of the container to pause
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');
  });

  it('behaves correctly when loop is false and restartOnPaused is true', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        playbackRangeEnd={0.5}
        loop={false}
        restartOnPaused
      />
    );

    cy.checkVideoPlaybackState('paused');

    cy.log('The video should initially be set to the start of the video');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    // Mouse over the container to start loading/playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    cy.log('The video should play through to the end of its duration');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0.5);

    cy.checkVideoPlaybackState('paused');

    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    cy.log(
      'The video should be reset to the start of the playback range when the user mouses out'
    );
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    cy.log('The video should play through to the end of its duration again');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0.5);

    cy.checkVideoPlaybackState('paused');
  });

  it('behaves correctly when loop and restartOnPaused are both false', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        playbackRangeEnd={0.5}
        loop={false}
        // restartOnPaused is false by default
      />
    );

    cy.checkVideoPlaybackState('paused');

    cy.log('The video should initially be set to the start of the video');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    cy.log('Mouse over the container to start loading/playing');
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    cy.log('The video should play through to the end of its playback range');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0.5);

    cy.checkVideoPlaybackState('paused');

    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    cy.log('The video should still be stuck at the end of its duration');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0.5);

    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState(
      'paused',
      'The video should stay paused because it is stuck at the end and restartOnPaused is false'
    );

    cy.log('The video should still be at the end of its duration');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0.5);

    cy.log(
      'Setting the video to a time past the end of the playback range will keep the time clamped to the end time'
    );
    cy.get(videoElementSelector).invoke('prop', 'currentTime', 5);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0.5);
  });
});
