import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import {
  makeMockVideoSrc,
  HoverOverlay,
  PausedOverlay,
  LoadingOverlay,
} from '../utils';
import {
  videoElementSelector,
  playerContainerSelector,
  hoverOverlayWrapperSelector,
  pausedOverlayWrapperSelector,
  loadingOverlayWrapperSelector,
} from '../constants';

describe('Sets style-related props on component elements correctly', () => {
  it('sets style attributes on player container element', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        className="player-container-classname"
        style={{
          width: 100,
        }}
      />
    );

    cy.get(playerContainerSelector)
      .should('have.class', 'player-container-classname')
      .should('have.css', 'width', '100px');
  });

  it('sets style attributes on the hover overlay wrapper element', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        hoverOverlay={<HoverOverlay />}
        hoverOverlayWrapperClassName="hover-overlay-classname"
        hoverOverlayWrapperStyle={{
          width: 300,
        }}
      />
    );

    cy.get(hoverOverlayWrapperSelector)
      .should('have.class', 'hover-overlay-classname')
      .should('have.css', 'width', '300px');
  });

  it('sets style attributes on the paused overlay wrapper element', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        pausedOverlay={<PausedOverlay />}
        pausedOverlayWrapperClassName="paused-overlay-classname"
        pausedOverlayWrapperStyle={{
          width: 200,
        }}
      />
    );

    cy.get(pausedOverlayWrapperSelector)
      .should('have.class', 'paused-overlay-classname')
      .should('have.css', 'width', '200px');
  });

  it('sets style attributes on the loading overlay wrapper element', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        loadingOverlay={<LoadingOverlay />}
        loadingOverlayWrapperClassName="loading-overlay-classname"
        loadingOverlayWrapperStyle={{
          width: 100,
        }}
      />
    );

    cy.get(loadingOverlayWrapperSelector)
      .should('have.class', 'loading-overlay-classname')
      .should('have.css', 'width', '100px');
  });

  it('sets style attributes on the video element', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        videoId="video-id"
        videoClassName="video-classname"
        videoStyle={{
          width: 400,
        }}
      />
    );

    cy.get(videoElementSelector)
      .should('have.id', 'video-id')
      .should('have.class', 'video-classname')
      .should('have.css', 'width', '400px');
  });
});
