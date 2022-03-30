import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import {
  makeMockVideoSrc,
  HoverVideoPlayerWithToggleVideoSrcButton,
} from '../utils';
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

  it('reloads correctly if a single string videoSrc changes', () => {
    const videoSrc1 = makeMockVideoSrc();
    const videoSrc2 = makeMockVideoSrc();
    const onVideoReloaded = cy.stub().as('onVideoReloaded');

    mount(
      <HoverVideoPlayerWithToggleVideoSrcButton
        videoSrc1={videoSrc1}
        videoSrc2={videoSrc2}
        onVideoReloaded={onVideoReloaded}
      />
    );

    cy.get(videoElementSelector)
      .children()
      .should('have.length', 1)
      .first()
      .should('have.attr', 'src', videoSrc1);

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc1}`);

    cy.get('@onVideoReloaded').should('not.have.been.called');

    cy.get('[data-testid="toggle-video-src-button"]').click();

    cy.get('@onVideoReloaded').should('have.been.calledOnce');

    cy.get(videoElementSelector)
      .children()
      .should('have.length', 1)
      .first()
      .should('have.attr', 'src', videoSrc2);

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc2}`);

    // Mouse over the container to start loading/playing
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    cy.get('[data-testid="toggle-video-src-button"]').click();

    // We shouldn't have reloaded yet because the video is still playing
    cy.get('@onVideoReloaded').should('have.been.calledOnce');

    // The <source> tag should have updated but the video element hasn't reloaded yet because it's still playing
    cy.get(videoElementSelector)
      .children()
      .should('have.length', 1)
      .first()
      .should('have.attr', 'src', videoSrc1);

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc2}`);

    // Mouse out to allow the video to pause and reload with the new source
    cy.triggerEventOnPlayer('mouseleave');

    cy.get('@onVideoReloaded').should('have.been.calledTwice');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc1}`);
  });

  it('reloads correctly if a videoSrc array changes', () => {
    const videoSrc1 = makeMockVideoSrc();
    const videoSrc2 = makeMockVideoSrc();
    const onVideoReloaded = cy.stub().as('onVideoReloaded');

    const videoSrcArray1 = [
      {
        src: videoSrc1,
        type: 'video/mp4',
      },
    ];

    const videoSrcArray2 = [
      {
        src: videoSrc2,
        type: 'video/mp4',
      },
      {
        src: videoSrc1,
        type: 'video/mp4',
      },
    ];

    mount(
      <HoverVideoPlayerWithToggleVideoSrcButton
        videoSrc1={videoSrcArray1}
        videoSrc2={videoSrcArray2}
        onVideoReloaded={onVideoReloaded}
      />
    );

    cy.get(videoElementSelector)
      .children()
      .should('have.length', 1)
      .first()
      .should('have.attr', 'src', videoSrc1)
      .should('have.attr', 'type', 'video/mp4');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc1}`);

    cy.get('@onVideoReloaded').should('not.have.been.called');

    cy.get('[data-testid="toggle-video-src-button"]').click();

    // video.load() should have been called after changing the source
    cy.get('@onVideoReloaded').should('have.been.calledOnce');

    cy.get(videoElementSelector)
      .children()
      .should('have.length', 2)
      .first()
      .should('have.attr', 'src', videoSrc2)
      .should('have.attr', 'type', 'video/mp4')
      .next()
      .should('have.attr', 'src', videoSrc1)
      .should('have.attr', 'type', 'video/mp4');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc2}`);
  });

  it('does not reload if the videoSrc changes but is deeply equal to the previous src', () => {
    const videoSrc = makeMockVideoSrc();
    const onVideoReloaded = cy.stub().as('onVideoReloaded');

    mount(
      <HoverVideoPlayerWithToggleVideoSrcButton
        // videoSrc1 and videoSrc2 are deeply equal but not referentially equal
        videoSrc1={{ src: videoSrc, type: 'video/mp4' }}
        videoSrc2={[{ type: 'video/mp4', src: `${videoSrc}` }]}
        onVideoReloaded={onVideoReloaded}
      />
    );

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);

    cy.get('[data-testid="toggle-video-src-button"]').click();

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);

    cy.get('@onVideoReloaded').should('not.have.been.called');
  });
});
