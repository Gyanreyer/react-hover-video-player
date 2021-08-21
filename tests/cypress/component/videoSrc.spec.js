import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';

import { makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

describe('Video sources are formatted and rendered correctly from the videoSrc prop', () => {
  it('takes a single url string for videoSrc', () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={videoSrc} />);

    cy.get(videoElementSelector)
      .children()
      .should('have.length', 1)
      .first()
      .should('have.attr', 'src', videoSrc)
      .should('not.have.attr', 'type');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);
  });

  it('takes an array of url strings for videoSrc', () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={['this-path-404s.mp4', videoSrc]} />);

    cy.get(videoElementSelector)
      .children()
      .should('have.length', 2)
      .first()
      .should('have.attr', 'src', 'this-path-404s.mp4')
      .should('not.have.attr', 'type');

    cy.get(videoElementSelector)
      .children()
      .eq(1)
      .should('have.attr', 'src', videoSrc)
      .should('not.have.attr', 'type');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);
  });

  it('takes an array of VideoSource objects for videoSrc', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={[
          {
            src: 'this-path-404s.mp4',
            type: 'video/fake',
          },
          { src: videoSrc, type: 'video/mp4' },
        ]}
      />
    );

    cy.get(videoElementSelector)
      .children()
      .should('have.length', 2)
      .first()
      .should('have.attr', 'src', 'this-path-404s.mp4')
      .should('have.attr', 'type', 'video/fake');

    cy.get(videoElementSelector)
      .children()
      .eq(1)
      .should('have.attr', 'src', videoSrc)
      .should('have.attr', 'type', 'video/mp4');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);
  });

  it('adds a correctly constructed media fragment identifier to the video src if only playbackRangeStart is set', () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={videoSrc} playbackRangeStart={1.2} />);

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}#t=1.2`);
  });

  it('adds a correctly constructed media fragment identifier to the video src if only playbackRangeEnd is set', () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={videoSrc} playbackRangeEnd={2.5} />);

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}#t=,2.5`);
  });

  it('adds a correctly constructed media fragment identifier to the video src if both playbackRangeStart and playbackRangeEnd are set', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={videoSrc}
        playbackRangeStart={1}
        playbackRangeEnd={2.5}
      />
    );

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}#t=1,2.5`);
  });

  it('logs an error if no value is provided for the videoCaptions prop', () => {
    // Spy on console.error so we can check that it is being called correctly
    cy.spy(console, 'error').as('consoleError');

    mount(<HoverVideoPlayer />);

    cy.get(videoElementSelector).should('not.have.descendants', 'source');

    cy.get('@consoleError').should(
      'have.been.calledWith',
      "Error: 'videoSrc' prop is required for HoverVideoPlayer component"
    );
  });

  it('logs an error if an invalid value is provided for the videoCaptions prop', () => {
    // Spy on console.error so we can check that it is being called correctly
    cy.spy(console, 'error').as('consoleError');

    mount(<HoverVideoPlayer videoSrc={{ bad: 'value' }} />);

    cy.get(videoElementSelector).should('not.have.descendants', 'source');

    cy.get('@consoleError').should(
      'have.been.calledWith',
      "Error: invalid value provided to HoverVideoPlayer prop 'videoSrc':",
      { bad: 'value' }
    );
  });
});
