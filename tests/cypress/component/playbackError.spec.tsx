import React from 'react';
import { mount, unmount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';

describe('handles playback errors', () => {
  it('logs a warning if a play promise gets interrupted by the component being unmounted', () => {
    cy.spy(console, 'error').as('consoleError');

    mount(
      <HoverVideoPlayer videoSrc={makeMockVideoSrc({ throttleKbps: 1000 })} />
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
