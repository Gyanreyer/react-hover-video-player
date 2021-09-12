import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

describe('Caption tracks are formatted and rendered correctly from the videoCaptions prop', () => {
  beforeEach(() => {
    cy.intercept('GET', '/captions.vtt', {
      fixture: 'captions.vtt',
    });
    cy.intercept('GET', '/captions-ga.vtt', {
      fixture: 'captions-ga.vtt',
    });
  });

  it('formats a single VideoCaptionsTrack object correctly', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        videoCaptions={{
          src: '/captions.vtt',
          srcLang: 'en',
          label: 'English',
          // The caption track should be visible by default
          default: true,
        }}
      />
    );

    cy.get(videoElementSelector)
      .children('track')
      .should('have.length', 1)
      .first()
      .should('have.attr', 'src', '/captions.vtt')
      .should('have.attr', 'srclang', 'en')
      .should('have.attr', 'label', 'English')
      .should('have.attr', 'default');

    cy.get(videoElementSelector)
      .invoke('prop', 'textTracks')
      .should('have.length', 1)
      .should(([track]) => {
        expect(track.mode).to.equal('showing');
        expect(track.kind).to.equal('captions');
        expect(track.activeCues).to.have.length(
          0,
          'There should not be any active caption cues yet'
        );
        expect(track.cues).to.have.length(3);
        const [cue1, cue2, cue3] = track.cues;

        expect(cue1.startTime).to.equal(0.5);
        expect(cue1.endTime).to.equal(3);
        expect(cue1.text).to.equal('This is some caption text');

        expect(cue2.startTime).to.equal(4);
        expect(cue2.endTime).to.equal(6.5);
        expect(cue2.text).to.equal('I hope you can read it...');

        expect(cue3.startTime).to.equal(6.7);
        expect(cue3.endTime).to.equal(9);
        expect(cue3.text).to.equal(
          "...because otherwise that means this doesn't work"
        );
      });

    // Jump the video to 1 second in so the first caption cue should be showing now
    cy.get(videoElementSelector).invoke('prop', 'currentTime', 1);

    cy.get(videoElementSelector)
      .invoke('prop', 'textTracks')
      .should('have.length', 1)
      .should(([track]) => {
        // The first cue from the track should now be active
        const { activeCues } = track;
        expect(activeCues).to.have.length(1);
        expect(activeCues[0].text).to.equal('This is some caption text');
      });
  });

  it('formats an array of VideoCaptionsTrack objects correctly', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        videoCaptions={[
          {
            src: '/captions.vtt',
            srcLang: 'en',
            label: 'English',
            kind: 'captions',
          },
          {
            src: '/captions-ga.vtt',
            srcLang: 'ga',
            label: 'Gaelic (Irish)',
            kind: 'subtitles',
          },
        ]}
        controls
      />
    );

    cy.get(videoElementSelector).should(
      'have.descendants',
      'track[src="/captions.vtt"]'
    );
    cy.get(videoElementSelector).should(
      'have.descendants',
      'track[src="/captions-ga.vtt"]'
    );

    cy.get(videoElementSelector).should(([videoElement]) => {
      const { textTracks } = videoElement;

      expect(textTracks).to.have.length(2);
      const [track1, track2] = textTracks;

      // Neither track should be active
      expect(track1.mode).to.equal('disabled');
      expect(track2.mode).to.equal('disabled');

      // Ensure track1 is constructed correctly
      expect(track1.activeCues).to.be.null;
      expect(track1.kind).to.equal('captions');

      // Ensure track2 is constructed correctly
      expect(track2.activeCues).to.be.null;
      expect(track2.kind).to.equal('subtitles');
    });

    cy.get(videoElementSelector).then(([videoElement]) => {
      // Programmatically simulate selecting the second captions track
      const [, track2] = videoElement.textTracks;
      track2.mode = 'showing';
    });

    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    // Play the video to 1 second in and then pause so the first caption
    // cue should be showing now
    cy.get(videoElementSelector)
      .invoke('prop', 'currentTime')
      .should('be.gte', 1);
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    // The irish language subtitles should be active in the video
    cy.get(videoElementSelector).should(([videoElement]) => {
      const [, track2] = videoElement.textTracks;

      expect(track2.mode).to.equal('showing');
      expect(track2.activeCues).to.have.length(1);
      const [cue] = track2.activeCues;

      expect(cue.text).to.equal('Seo roinnt téacs fotheidil');
    });
  });

  it('logs an error if an invalid value is provided for the videoCaptions prop', () => {
    const videoSrc = makeMockVideoSrc();

    // Spy on console.error so we can check that it is being called correctly
    cy.spy(console, 'error').as('consoleError');

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        videoCaptions={{
          wrong: 'value',
        }}
      />
    );

    cy.get(videoElementSelector).should('not.have.descendants', 'track');

    cy.get('@consoleError').should(
      'have.been.calledWith',
      "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
      {
        wrong: 'value',
      }
    );
  });
});
