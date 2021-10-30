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

    // The video should initially be unmuted
    cy.get(videoElementSelector).invoke('prop', 'muted').should('be.false');

    // Hover to start playing
    cy.triggerEventOnPlayer('mouseenter');

    // The video should start playing, but it will be muted because the browser
    // blocked playback with sound
    cy.checkVideoPlaybackState('playing');
    cy.get(videoElementSelector).invoke('prop', 'muted').should('be.true');

    // Perform a "real" click on the body so the browser will recognize it as a valid first
    // interaction with the page and therefore allow audio playback sto be unlocked
    cy.get('body').realClick();

    // The video should no longer be muted
    cy.get(videoElementSelector).invoke('prop', 'muted').should('be.false');
  });

  it('if the user has interacted with the page, the video will play with sound right away', () => {
    mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} muted={false} />);

    // The video should initially be unmuted
    cy.get(videoElementSelector).invoke('prop', 'muted').should('be.false');

    // Hover to start playing
    cy.triggerEventOnPlayer('mouseenter');

    // The video should start playing and still be unmuted
    cy.checkVideoPlaybackState('playing');
    cy.get(videoElementSelector).invoke('prop', 'muted').should('be.false');
  });
});
