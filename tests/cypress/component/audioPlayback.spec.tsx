import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

// BEWARE: running these tests in the interactive test runner can be perilous since
// any clicks around the UI can disrupt the assumptions these tests are making about
// the browser's autoplay policy
describe('attempting to play the video with audio should work as expected', () => {
  it('if the user has not interacted with the page, the video will initially start playing without sound until the user clicks on the page', () => {
    mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} muted={false} />);

    cy.triggerEventOnPlayer('mouseenter');

    // The video should start playing, but it will be muted
    cy.get(videoElementSelector).invoke('prop', 'muted').should('be.true');
    cy.checkVideoPlaybackState('playing');
    cy.get(videoElementSelector).invoke('prop', 'muted').should('be.true');

    // Click on the body to "interact" with the page for the first time
    cy.get('body').click();

    // The video should no longer be muted
    cy.get(videoElementSelector).invoke('prop', 'muted').should('be.false');
  });
});
