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

    cy.get(videoElementSelector).children().should('have.length', 0);
    cy.get(videoElementSelector).should('have.attr', 'src', videoSrc);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);
  });

  it('takes an array of VideoSource objects for videoSrc', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayer
        videoSrc={
          <>
            <source src="this-path-404s.mp4" type="video/fake" />
            <source src={videoSrc} type="video/mp4" />
          </>
        }
      />
    );
    cy.get(videoElementSelector).should('not.have.attr', 'src');

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

  it('reloads correctly if a single string videoSrc changes', () => {
    const videoSrc1 = makeMockVideoSrc();
    const videoSrc2 = makeMockVideoSrc();

    mount(
      <HoverVideoPlayerWithToggleVideoSrcButton
        videoSrc1={videoSrc1}
        videoSrc2={videoSrc2}
      />
    );

    cy.get(videoElementSelector).then(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];

      const onVideoReloaded = cy.stub().as('onVideoReloaded');
      videoElement.addEventListener('emptied', onVideoReloaded);
    });

    // The src is set as an attribute, not via child <source> elements
    cy.get(videoElementSelector).children().should('have.length', 0);

    // The first videoSrc should be loaded
    cy.get(videoElementSelector).should('have.attr', 'src', videoSrc1);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc1}`);

    cy.get('@onVideoReloaded').should('not.have.been.called');

    cy.window().then((win) => {
      window.dispatchEvent(new win.Event('hvp:switchVideoSrc'));
    });

    cy.get('@onVideoReloaded').should('have.been.calledOnce');

    // The second videoSrc should be loaded
    cy.get(videoElementSelector).should('have.attr', 'src', videoSrc2);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc2}`);
  });

  it('waits until the video is paused to reload if a string src changes while playing', () => {
    const videoSrc1 = makeMockVideoSrc();
    const videoSrc2 = makeMockVideoSrc();

    mount(
      <HoverVideoPlayerWithToggleVideoSrcButton
        videoSrc1={videoSrc1}
        videoSrc2={videoSrc2}
      />
    );

    cy.get(videoElementSelector).then(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];

      const onVideoLoaded = cy.stub().as('onVideoLoaded');
      videoElement.addEventListener('emptied', onVideoLoaded);
    });

    // The src is set as an attribute, not via child <source> elements
    cy.get(videoElementSelector).children().should('have.length', 0);

    cy.log('The first videoSrc should be loaded initially');
    cy.get(videoElementSelector).should('have.attr', 'src', videoSrc1);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc1}`);

    cy.get('@onVideoLoaded').should('not.have.been.called');

    cy.log('Start playing the video');
    cy.triggerEventOnPlayer('mouseenter');
    cy.checkVideoPlaybackState('playing');

    cy.log('video.load() was called in the process of playing the video');
    cy.get('@onVideoLoaded').should('to.have.been.calledOnce');

    cy.window().then((win) => {
      window.dispatchEvent(new win.Event('hvp:switchVideoSrc'));
    });

    cy.get(videoElementSelector).should('have.attr', 'src', videoSrc1);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc1}`);

    cy.log('Pause the video');
    cy.triggerEventOnPlayer('mouseleave');
    cy.checkVideoPlaybackState('paused');

    cy.get('@onVideoLoaded').should('have.been.calledOnce');

    cy.get(videoElementSelector).should('have.attr', 'src', videoSrc2);
    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc2}`);
  });

  it('reloads correctly if a set of <source> tags changes', () => {
    const videoSrc1 = makeMockVideoSrc();
    const videoSrc2 = makeMockVideoSrc();

    const videoSrcArray1 = (
      <>
        <source src={videoSrc1} type="video/mp4" />
      </>
    );

    const videoSrcArray2 = (
      <>
        <source src={videoSrc2} type="video/mp4" />
        <source src={videoSrc1} type="video/mp4" />
      </>
    );

    mount(
      <HoverVideoPlayerWithToggleVideoSrcButton
        videoSrc1={videoSrcArray1}
        videoSrc2={videoSrcArray2}
      />
    );

    cy.get(videoElementSelector).then(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];

      const onVideoReloaded = cy.stub().as('onVideoReloaded');
      videoElement.addEventListener('emptied', onVideoReloaded);
    });

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

    cy.window().then((win) => {
      window.dispatchEvent(new win.Event('hvp:switchVideoSrc'));
    });

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

    mount(
      <HoverVideoPlayerWithToggleVideoSrcButton
        // videoSrc1 and videoSrc2 are deeply equal but not referentially equal
        videoSrc1={<source src={videoSrc} type="video/mp4" />}
        videoSrc2={<source type="video/mp4" src={videoSrc} />}
      />
    );

    cy.get(videoElementSelector).then(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];

      const onVideoReloaded = cy.stub().as('onVideoReloaded');
      videoElement.addEventListener('emptied', onVideoReloaded);
    });

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);

    cy.window().then((win) => {
      window.dispatchEvent(new win.Event('hvp:switchVideoSrc'));
    });

    cy.get('@onVideoReloaded').should('not.have.been.called');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);
  });

  it('reloads if the videoSrc changes from a string to a <source> tag and vice versa', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <HoverVideoPlayerWithToggleVideoSrcButton
        // videoSrc1 and videoSrc2 are the same source, but in different formats
        videoSrc1={videoSrc}
        videoSrc2={<source src={videoSrc} type="video/mp4" />}
      />
    );

    cy.get(videoElementSelector).then(($video: JQuery<HTMLVideoElement>) => {
      const videoElement = $video[0];

      const onVideoReloaded = cy.stub().as('onVideoReloaded');
      videoElement.addEventListener('emptied', onVideoReloaded);
    });

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);

    cy.window().then((win) => {
      window.dispatchEvent(new win.Event('hvp:switchVideoSrc'));
    });

    cy.get('@onVideoReloaded').should('have.been.calledOnce');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);

    cy.window().then((win) => {
      window.dispatchEvent(new win.Event('hvp:switchVideoSrc'));
    });

    cy.get('@onVideoReloaded').should('have.been.calledTwice');

    cy.get(videoElementSelector)
      .invoke('prop', 'currentSrc')
      .should('eq', `${window.location.origin}${videoSrc}`);
  });
});
