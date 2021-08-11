import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';

import { makeMockVideoSrc, PausedOverlay } from '../utils';
import { videoElementSelector } from '../constants';

describe('Playback works as expected when a playback range is set', () => {
  it('retains the video time before pausing if restartOnPaused is false', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        // restartOnPaused is false by default
      />
    );

    cy.checkVideoPlaybackState(
      'paused',
      'The video should initially be paused'
    );

    cy.log('The video should initially be set to the start');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    // Trigger the video to start playing
    cy.triggerEventOnPlayer('mouseenter');

    cy.log('Allow the video to play up to 1s in and then pause it');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.gte', 1);

    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.gte', 1);

    cy.triggerEventOnPlayer('mouseenter');

    cy.get(videoElementSelector, { timeout: 500 })
      .invoke('prop', 'currentTime')
      .should('be.gte', 1);
  });

  it('resets the video time to 0 after pausing if restartOnPaused is true', () => {
    mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} restartOnPaused />);

    cy.checkVideoPlaybackState(
      'paused',
      'The video should initially be paused'
    );

    cy.log('The video should initially be set to the start');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    // Trigger the video to start playing
    cy.triggerEventOnPlayer('mouseenter');

    cy.log('Allow the video to play up to 1s in and then pause it');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.gte', 1);

    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    cy.log('The video time should have been reset to the start after pausing');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    cy.triggerEventOnPlayer('mouseenter');

    cy.log('The video should play from the start again');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.closeTo', 0, 0.03);
  });

  it('if there is a paused overlay and restartOnPaused is true, only resets the video time to 0 after the overlay has faded back in', () => {
    cy.clock();

    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        restartOnPaused
        pausedOverlay={<PausedOverlay />}
      />
    );

    cy.checkVideoPlaybackState(
      'paused',
      'The video should initially be paused'
    );

    cy.log('The video should initially be set to the start');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    // Trigger the video to start playing
    cy.triggerEventOnPlayer('mouseenter');

    cy.log('Allow the video to play up to 1s in and then pause it');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.gte', 1);

    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('playing');

    // The paused overlay should be fading back in
    cy.checkOverlayVisibilty({
      paused: true,
    });

    cy.tick(399);
    cy.checkVideoPlaybackState('playing');

    cy.log(
      'The video time should not be reset yet because the paused overlay is still fading out'
    );
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.gte', 1);

    cy.tick(1);
    cy.checkVideoPlaybackState('paused');

    cy.log(
      'The video should be reset back to the start once the paused overlay has been faded out'
    );
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);
  });
});
