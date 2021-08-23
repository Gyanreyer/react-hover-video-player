import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';
import {
  makeMockVideoSrc,
  HoverVideoPlayerWrappedWithFocusToggleButton,
} from '../utils';
import { videoElementSelector } from '../constants';

describe('unloadVideoOnPaused prop', () => {
  it("unloads the video's sources while it is paused when set to true", () => {
    const videoSrc = makeMockVideoSrc({
      throttleKbps: 1000,
    });

    mount(<HoverVideoPlayer videoSrc={videoSrc} unloadVideoOnPaused />);

    cy.checkVideoPlaybackState('paused');

    // The video should not have a source
    cy.get(videoElementSelector).should('not.have.descendants', 'source');
    cy.get(videoElementSelector)
      .invoke('prop', 'readyState')
      .should('equal', HTMLVideoElement.HAVE_NOTHING);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('equal', '');
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    // Mouse over to start playing
    cy.triggerEventOnPlayer('mouseenter');

    // Wait for the video to start playing
    cy.checkVideoPlaybackState('playing');

    // The video should now have a source set and loaded
    cy.get(videoElementSelector).should(
      'have.descendants',
      `source[src="${videoSrc}"]`
    );
    cy.get(videoElementSelector)
      .invoke('prop', 'readyState')
      .should('be.gte', HTMLVideoElement.HAVE_FUTURE_DATA);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('equal', `${window.location.origin}${videoSrc}`);
    // Wait for the video to play for at least .2s
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.greaterThan', 0.2);

    // Mouse out to pause
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    // The source should have been unloaded
    cy.get(videoElementSelector).should('not.have.descendants', 'source');
    cy.get(videoElementSelector)
      .invoke('prop', 'readyState')
      .should('equal', HTMLVideoElement.HAVE_NOTHING);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);
    // The currentSrc will not be cleared even though the video is unloaded
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('equal', `${window.location.origin}${videoSrc}`);

    cy.triggerEventOnPlayer('mouseenter');

    // The video should have been restored to the point it was at previously
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.greaterThan', 0.2);
    // The time should have been updated before the video finished loading/started playing
    cy.checkVideoPlaybackState('loading');

    // Let the video's play promise resolve
    cy.checkVideoPlaybackState('playing');
  });

  it('does not restore previous time when restartOnPaused is true', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        unloadVideoOnPaused
        restartOnPaused
      />
    );

    // Mouse over to start playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    // Wait for the video to play for at least .2s
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.greaterThan', 0.2);

    // Mouse out to pause
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    // The source should have been unloaded so the time is set to 0
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    // Mouse over to start playing again
    cy.triggerEventOnPlayer('mouseenter');
    // The video's time should still be 0
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    // Let the video's play promise resolve
    cy.checkVideoPlaybackState('playing');
  });

  it('unloaded video is able to play immediately if focused prop is initially set to true', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayerWrappedWithFocusToggleButton
        videoSrc={videoSrc}
        unloadVideoOnPaused
        focused
      />
    );

    // The video should have a source from the start because we're trying to play ASAP
    cy.get(videoElementSelector).should(
      'have.descendants',
      `source[src="${videoSrc}"]`
    );
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('equal', `${window.location.origin}${videoSrc}`);

    // The video should start playing immediately
    cy.checkVideoPlaybackState(
      'playing',
      'The video should start playing right away'
    );

    cy.get('[data-testid="toggle-focus-button"]').click();

    cy.checkVideoPlaybackState('paused');

    // The source should have been removed
    cy.get(videoElementSelector).should('not.have.descendants', 'source');
    // The readyState should be reset to HAVE_NOTHING
    cy.get(videoElementSelector)
      .invoke('prop', 'readyState')
      .should('equal', HTMLVideoElement.HAVE_NOTHING);

    // The video should successfully load and play again when we toggle focused back to true
    cy.get('[data-testid="toggle-focus-button"]').click();
    cy.checkVideoPlaybackState('playing');
  });

  it('does not unload the video until any pending play attempt is resolved', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc({
          throttleKbps: 1000,
        })}
        unloadVideoOnPaused
      />
    );

    cy.checkVideoPlaybackState('paused');

    cy.get(videoElementSelector).should('not.have.descendants', 'source');
    cy.get(videoElementSelector)
      .invoke('prop', 'readyState')
      .should('equal', HTMLVideoElement.HAVE_NOTHING);

    // Mouse over the video to get it to start loading
    cy.triggerEventOnPlayer('mouseenter');

    cy.checkVideoPlaybackState('loading');
    cy.get(videoElementSelector).should('have.descendants', 'source');

    cy.triggerEventOnPlayer('mouseleave');

    cy.log(
      'the video should still be loading even if it is no longer being hovered over'
    );
    cy.checkVideoPlaybackState('loading');
    cy.get(videoElementSelector).should('have.descendants', 'source');

    cy.checkVideoPlaybackState('paused');
    cy.get(videoElementSelector).should('not.have.descendants', 'source');
    cy.get(videoElementSelector)
      .invoke('prop', 'readyState')
      .should('equal', HTMLVideoElement.HAVE_NOTHING);
  });
});
