import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

describe('Playback works as expected when only playbackRangeStart is set', () => {
  it('behaves correctly when loop is true and restartOnPaused is false', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        playbackRangeStart={8.7}
        // loop is true by default
        // restartOnPaused is false by default
      />
    );

    cy.checkVideoPlaybackState(
      'paused',
      'The video should initially be paused'
    );
    // The video's time should initially be at 0s
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 0);

    cy.triggerEventOnPlayer('mouseenter');

    // The video should now be set to the start of its playback range
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 8.7);

    cy.checkVideoPlaybackState(
      'playing',
      'The video should start playing after mousing over it'
    );

    // The video should play through to the end of its duration
    cy.get(videoElementSelector).should(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];
      expect(videoElement.currentTime).to.equal(videoElement.duration);
    });

    // The video should loop back the start of its playback range
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.closeTo', 8.7, 0.03);

    cy.checkVideoPlaybackState(
      'playing',
      'The video should still be playing after looping'
    );

    // The video's time should play through to the end
    cy.get(videoElementSelector).should(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];
      expect(videoElement.currentTime).to.equal(videoElement.duration);
    });

    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.closeTo', 8.7, 0.03);

    cy.checkVideoPlaybackState(
      'playing',
      'The video should still be playing after looping a second time'
    );

    // Mouse out of the container to pause
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');
  });

  it('behaves correctly when loop is false and restartOnPaused is true', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        playbackRangeStart={8.7}
        loop={false}
        restartOnPaused
      />
    );

    cy.checkVideoPlaybackState('paused');

    // The video should initially be set to the start of its playback range
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 8.7);

    // Mouse over the container to start loading/playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    // The video should play through to the end of its duration
    cy.get(videoElementSelector).should(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];
      expect(videoElement.currentTime).to.equal(videoElement.duration);
    });

    cy.checkVideoPlaybackState('ended');

    cy.triggerEventOnPlayer('mouseleave');

    cy.checkVideoPlaybackState('paused');

    // The video should be reset to the start of the playback range when the user mouses out
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 8.7);

    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    // The video should play through to the end of its duration again
    cy.get(videoElementSelector).should(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];
      expect(videoElement.currentTime).to.equal(videoElement.duration);
    });

    cy.checkVideoPlaybackState('ended');
  });

  it('behaves correctly when loop and restartOnPaused are both false', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        playbackRangeStart={8.7}
        loop={false}
        // restartOnPaused is false by default
      />
    );

    cy.checkVideoPlaybackState('paused');

    // The video should initially be set to the start of its playback range
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 8.7);

    // Mouse over the container to start loading/playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    // The video should play through to the end of its duration
    cy.get(videoElementSelector).should(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];
      expect(videoElement.currentTime).to.equal(videoElement.duration);
    });

    cy.checkVideoPlaybackState('ended');

    cy.triggerEventOnPlayer('mouseleave');

    cy.checkVideoPlaybackState('ended');

    // The video should still be stuck at the end of its duration
    cy.get(videoElementSelector).should(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];
      expect(videoElement.currentTime).to.equal(videoElement.duration);
    });

    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState(
      'ended',
      'The video should stay stuck at the end'
    );

    // The video should still be at the end of its duration
    cy.get(videoElementSelector).should(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];
      expect(videoElement.currentTime).to.equal(videoElement.duration);
    });
  });

  it('keeps the video inside the playback range', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        playbackRangeStart={8.7}
        loop={false}
        // restartOnPaused is false by default
      />
    );

    cy.log(
      'The video should initially be set to the start of the playback range'
    );
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 8.7);

    cy.log(
      "Attempt to set the video's time to before the start of the playback range"
    );
    cy.get(videoElementSelector).invoke('prop', 'currentTime', 0);

    cy.log(
      'The video should have been set back to the start of the playback range'
    );
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('equal', 8.7);
  });
});
