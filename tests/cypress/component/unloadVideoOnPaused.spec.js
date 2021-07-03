import React, { useState } from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';
import { makeMockVideoSrc } from '../utils';

describe('unloadVideoOnPaused', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it("unloadVideoOnPaused prop unloads the video's sources while it is paused when set to true", () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={videoSrc} unloadVideoOnPaused />);

    cy.checkVideoPlaybackState('paused');

    // The video should not have a source
    cy.videoElement().should((videoElement) => {
      expect(videoElement).to.not.have.descendants('source');
      expect(videoElement.readyState).to.equal(
        0,
        'The readyState should be HAVE_NOTHING'
      );
      expect(videoElement.currentSrc).to.equal('');
      expect(videoElement.currentTime).to.equal(0);
    });

    // Mouse over to start playing
    cy.triggerEventOnPlayer('mouseenter');

    // Wait for the video to start playing
    cy.checkVideoPlaybackState('playing');

    // The video should now have a source set and loaded
    cy.videoElement().should((videoElement) => {
      expect(videoElement).to.have.descendants(`source[src="${videoSrc}"]`);
      expect(videoElement.readyState).to.be.gte(
        3,
        'The readyState should be at least HAVE_FUTURE_DATA'
      );
      expect(videoElement.currentSrc).to.equal(
        `${window.location.origin}${videoSrc}`
      );
    });

    cy.videoElement().should((videoElement) => {
      // Wait for the video to play for at least .2s
      expect(videoElement.currentTime).to.be.greaterThan(0.2);
    });

    // Mouse out to pause
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    // The source should have been unloaded
    cy.videoElement().should((videoElement) => {
      expect(videoElement).to.not.have.descendants('source');
      expect(videoElement.readyState).to.equal(
        0,
        'The readyState should be reset to HAVE_NOTHING'
      );
      expect(videoElement.currentTime).to.equal(0);
    });

    cy.triggerEventOnPlayer('mouseenter');

    cy.videoElement().should((videoElement) => {
      expect(videoElement.currentTime).to.be.greaterThan(
        0.2,
        'The video should have been restored to a later point in the video'
      );
      expect(videoElement.readyState).to.be.lessThan(
        3,
        'The video is not loaded enough to play yet'
      );
    });

    // Let the video's play promise resolve
    cy.checkVideoPlaybackState('playing');
  });

  it('unloadVideoOnPaused prop does not restore previous time when restartOnPaused is true', () => {
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

    cy.videoElement().should((videoElement) => {
      // Wait for the video to play for at least .2s
      expect(videoElement.currentTime).to.be.greaterThan(0.2);
    });

    // Mouse out to pause
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    // The source should have been unloaded
    cy.videoElement().should((videoElement) => {
      expect(videoElement.currentTime).to.equal(0);
    });

    // Mouse over to start playing again
    cy.triggerEventOnPlayer('mouseenter');
    // The video's time should still be 0
    cy.videoElement().should((videoElement) => {
      expect(videoElement.currentTime).to.equal(0);
    });

    // Let the video's play promise resolve
    cy.checkVideoPlaybackState('playing');
  });

  it('unloaded video is able to play immediately if focused prop is initially set to true', () => {
    const videoSrc = makeMockVideoSrc();

    const HoverVideoPlayerWrappedWithFocusToggleButton = () => {
      const [isFocused, setIsFocused] = useState(true);

      return (
        <>
          <button
            onClick={() => setIsFocused(!isFocused)}
            data-testid="toggle-focus-button"
          >
            Toggle focus
          </button>
          <HoverVideoPlayer
            videoSrc={videoSrc}
            unloadVideoOnPaused
            focused={isFocused}
          />
        </>
      );
    };

    mount(<HoverVideoPlayerWrappedWithFocusToggleButton />);

    // The video should have a source from the start because we're trying to play ASAP
    cy.videoElement().should((videoElement) => {
      expect(videoElement).to.have.descendants(`source[src="${videoSrc}"]`);
      expect(videoElement.currentSrc).to.equal(
        `${window.location.origin}${videoSrc}`
      );
    });

    // The video should start playing immediately
    cy.checkVideoPlaybackState('playing');

    cy.get('[data-testid="toggle-focus-button"]').click();

    cy.checkVideoPlaybackState('paused');

    cy.videoElement().should((videoElement) => {
      expect(videoElement).to.not.have.descendants('sources');
      expect(videoElement.readyState).to.equal(
        0,
        'The readyState should be reset to HAVE_NOTHING'
      );
    });

    // The video should successfully load and play again when we toggle focused back to true
    cy.get('[data-testid="toggle-focus-button"]').click();
    cy.checkVideoPlaybackState('playing');
  });
});
