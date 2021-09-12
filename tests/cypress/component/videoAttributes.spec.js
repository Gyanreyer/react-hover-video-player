import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';
import { videoElementSelector } from '../constants';

describe('Sets attributes on the video element correctly', () => {
  describe('loop', () => {
    it('sets loop to true by default', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector).should('have.attr', 'loop');
      cy.get(videoElementSelector).invoke('prop', 'loop').should('be.true');
    });

    it('sets loop to false if the loop prop is set to false', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} loop={false} />);

      cy.get(videoElementSelector).should('not.have.attr', 'loop');
      cy.get(videoElementSelector).invoke('prop', 'loop').should('be.false');
    });

    it('sets loop to false if a playback range is set', () => {
      mount(
        <HoverVideoPlayer
          videoSrc={makeMockVideoSrc()}
          loop
          playbackRangeStart={1}
          playbackRangeEnd={2}
        />
      );

      cy.get(videoElementSelector).should('not.have.attr', 'loop');
      cy.get(videoElementSelector).invoke('prop', 'loop').should('be.false');
    });
  });

  describe('preload', () => {
    it('does not set preload by default', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector).should('not.have.attr', 'preload');
      // The video's preload property defaults to "metadata" in chrome when the attribute is not set
      cy.get(videoElementSelector)
        .invoke('prop', 'preload')
        .should('eq', 'metadata');
    });

    it('sets preload on the video when the preload prop is set', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} preload="none" />);

      cy.get(videoElementSelector).should('have.attr', 'preload', 'none');
      cy.get(videoElementSelector)
        .invoke('prop', 'preload')
        .should('eq', 'none');
    });
  });

  describe('crossOrigin', () => {
    it('sets crossOrigin to anonymous by default', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector).should(
        'have.attr',
        'crossorigin',
        'anonymous'
      );
      cy.get(videoElementSelector)
        .invoke('prop', 'crossOrigin')
        .should('eq', 'anonymous');
    });

    it('sets crossorigin on the video when the crossOrigin prop is set', () => {
      mount(
        <HoverVideoPlayer
          videoSrc={makeMockVideoSrc()}
          preload="none"
          crossOrigin="use-credentials"
        />
      );

      cy.get(videoElementSelector).should(
        'have.attr',
        'crossorigin',
        'use-credentials'
      );
      cy.get(videoElementSelector)
        .invoke('prop', 'crossOrigin')
        .should('eq', 'use-credentials');
    });
  });

  describe('controls', () => {
    it('does not set the controls attribute by default', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector).should('not.have.attr', 'controls');
      cy.get(videoElementSelector)
        .invoke('prop', 'controls')
        .should('be.false');
    });

    it('sets controls attribute when the controls prop is true', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} controls />);

      cy.get(videoElementSelector).should('have.attr', 'controls');
      cy.get(videoElementSelector).invoke('prop', 'controls').should('be.true');
    });
  });

  describe('controlsList', () => {
    it('does not set the controlsList attribute by default', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector).should('not.have.attr', 'controlsList');
      cy.get(videoElementSelector)
        .invoke('prop', 'controlsList')
        .should('be.empty');
    });

    it('sets controls attribute when the controls prop is true', () => {
      mount(
        <HoverVideoPlayer
          videoSrc={makeMockVideoSrc()}
          controlsList="nodownload nofullscreen"
        />
      );

      cy.get(videoElementSelector).should(
        'have.attr',
        'controlsList',
        'nodownload nofullscreen'
      );
      cy.get(videoElementSelector)
        .invoke('prop', 'controlsList')
        .should((controlsList) => {
          expect(controlsList[0]).to.equal('nodownload');
          expect(controlsList[1]).to.equal('nofullscreen');
        });
    });
  });

  describe('muted', () => {
    it('should set muted to true on the video by default', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector).invoke('prop', 'muted').should('be.true');
    });

    it('should set muted to false on the video if the muted prop is set to false', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} muted={false} />);

      cy.get(videoElementSelector).invoke('prop', 'muted').should('be.false');
    });
  });

  describe('volume', () => {
    it("the video's volume should be set to 1 by default", () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector).invoke('prop', 'volume').should('eq', 1);
    });

    it('should set a muted attribute on the video if the muted prop is set to true', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} volume={0.76} />);

      cy.get(videoElementSelector).invoke('prop', 'volume').should('eq', 0.76);
    });
  });

  describe('disableRemotePlayback', () => {
    it('should set disableRemotePlayback to true on the video by default', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector)
        .invoke('prop', 'disableRemotePlayback')
        .should('be.true');
    });

    it('should set disableRemotePlayback to false on the video is the prop is set to false', () => {
      mount(
        <HoverVideoPlayer
          videoSrc={makeMockVideoSrc()}
          disableRemotePlayback={false}
        />
      );

      cy.get(videoElementSelector)
        .invoke('prop', 'disableRemotePlayback')
        .should('be.false');
    });
  });

  describe('disablePictureInPicture', () => {
    it('should set disablePictureInPicture to true on the video by default', () => {
      mount(<HoverVideoPlayer videoSrc={makeMockVideoSrc()} />);

      cy.get(videoElementSelector)
        .invoke('prop', 'disablePictureInPicture')
        .should('be.true');
    });

    it('should set disablePictureInPicture to false on the video is the prop is set to false', () => {
      mount(
        <HoverVideoPlayer
          videoSrc={makeMockVideoSrc()}
          disablePictureInPicture={false}
        />
      );

      cy.get(videoElementSelector)
        .invoke('prop', 'disablePictureInPicture')
        .should('be.false');
    });
  });
});
