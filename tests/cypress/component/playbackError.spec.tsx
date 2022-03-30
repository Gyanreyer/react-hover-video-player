import React from 'react';
import { mount, unmount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';

describe('handles playback errors', () => {
  it('If shouldSuppressPlaybackInterruptedErrors is true, does not log anything', () => {
    cy.spy(console, 'error').as('consoleError');

    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc({ throttleKbps: 1000 })}
        // shouldSuppressPlaybackInterruptedErrors is true by default
      />
    );

    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('loading');

    unmount();

    cy.get('@consoleError').should('not.have.been.called');
  });

  it('If shouldSuppressPlaybackInterruptedErrors is false, logs a warning if a play promise gets interrupted by the component being unmounted', () => {
    cy.spy(console, 'error').as('consoleError');

    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc({ throttleKbps: 1000 })}
        shouldSuppressPlaybackInterruptedErrors={false}
      />
    );

    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('loading');

    unmount();

    cy.get('@consoleError').should(
      'have.been.calledWithMatch',
      'HoverVideoPlayer: The play() request was interrupted by a call to pause().'
    );
  });
});
