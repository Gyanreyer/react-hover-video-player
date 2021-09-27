import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import {
  HoverVideoPlayerWrappedWithFocusToggleButton,
  makeMockVideoSrc,
} from '../utils';

describe('focused prop', () => {
  it('the video can be played and paused through the focused prop', () => {
    mount(
      <HoverVideoPlayerWrappedWithFocusToggleButton
        videoSrc={makeMockVideoSrc()}
        disableDefaultEventHandling
      />
    );

    cy.checkVideoPlaybackState(
      'paused',
      'The video should initially be paused'
    );
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState(
      'paused',
      'Mousing over the player should not have done anything'
    );

    cy.get('[data-testid="toggle-focus-button"]').click();
    cy.checkVideoPlaybackState(
      'playing',
      'The video should be toggled to start playing'
    );

    cy.get('[data-testid="toggle-focus-button"]').click();
    cy.checkVideoPlaybackState(
      'paused',
      'The video should be toggled back to a paused state'
    );
  });

  it('the video starts playing immediately if the focused prop is true', () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={videoSrc} focused />);

    cy.checkVideoPlaybackState(
      'playing',
      'The video should start playing without any interaction'
    );
  });
});
