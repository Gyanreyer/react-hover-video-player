import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';

import { makeMockVideoSrc } from '../utils';
import {
  videoElementSelector,
  pausedOverlayWrapperSelector,
  loadingOverlayWrapperSelector,
  playerContainerSelector,
} from '../constants';

const videoAspectRatio = 16 / 9;

describe('sizingMode prop', () => {
  it("the player should be styled for the 'video' sizing mode by default", () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        videoStyle={{
          width: 200,
        }}
        pausedOverlay={
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'red',
            }}
            data-testid="paused-overlay"
          >
            PAUSED
          </div>
        }
        loadingOverlay={
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'yellow',
            }}
            data-testid="loading-overlay"
          >
            LOADING
          </div>
        }
      />
    );

    let videoElementHeight;

    cy.get(videoElementSelector).should(([videoElement]) => {
      expect(videoElement.readyState).to.be.gte(HTMLVideoElement.HAVE_METADATA);
      expect(videoElement).to.have.css('width', '200px');

      // The video's height should match the native aspect ratio
      // Since it's hard to perfectly predict how the browser will handle sub-pixels,
      // we'll just check that it's accurate wihin 5% of a pixel
      videoElementHeight = parseFloat(
        window.getComputedStyle(videoElement).height
      );
      expect(videoElementHeight).to.be.closeTo(200 / videoAspectRatio, 0.05);
    });

    cy.get(playerContainerSelector).should(([playerContainer]) => {
      expect(playerContainer).to.have.css('width', '200px');

      const playerContainerHeight = parseFloat(
        window.getComputedStyle(playerContainer).height
      );
      expect(playerContainerHeight).to.be.closeTo(videoElementHeight, 0.001);
    });
    cy.get(pausedOverlayWrapperSelector).should(([pausedOverlayWrapper]) => {
      expect(pausedOverlayWrapper).to.have.css('width', '200px');

      const pausedOverlayWrapperHeight = parseFloat(
        window.getComputedStyle(pausedOverlayWrapper).height
      );
      expect(pausedOverlayWrapperHeight).to.be.closeTo(
        videoElementHeight,
        0.001
      );
    });
    cy.get('[data-testid="paused-overlay"]').should(([pausedOverlay]) => {
      expect(pausedOverlay).to.have.css('width', '200px');

      const pausedOverlayHeight = parseFloat(
        window.getComputedStyle(pausedOverlay).height
      );
      expect(pausedOverlayHeight).to.be.closeTo(videoElementHeight, 0.001);
    });

    // The loading overlay should be sized to match the paused overlay's dimensions
    cy.get(loadingOverlayWrapperSelector).should(([loadingOverlayWrapper]) => {
      expect(loadingOverlayWrapper).to.have.css('width', '200px');

      const loadingOverlayWrapperHeight = parseFloat(
        window.getComputedStyle(loadingOverlayWrapper).height
      );
      expect(loadingOverlayWrapperHeight).to.be.closeTo(
        videoElementHeight,
        0.001
      );
    });
    cy.get('[data-testid="loading-overlay"]').should(([loadingOverlay]) => {
      expect(loadingOverlay).to.have.css('width', '200px');

      const loadingOverlayHeight = parseFloat(
        window.getComputedStyle(loadingOverlay).height
      );
      expect(loadingOverlayHeight).to.be.closeTo(videoElementHeight, 0.001);
    });
  });

  it("the player should be styled correctly for the 'overlay' sizing mode", () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        sizingMode="overlay"
        pausedOverlay={
          <div
            style={{
              width: 300,
              height: 100,
              backgroundColor: 'red',
            }}
            data-testid="paused-overlay"
          >
            PAUSED
          </div>
        }
        loadingOverlay={
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'yellow',
            }}
            data-testid="loading-overlay"
          >
            LOADING
          </div>
        }
      />
    );

    // The paused overlay should be sized correctly
    cy.get(pausedOverlayWrapperSelector)
      .should('have.css', 'width', '300px')
      .should('have.css', 'height', '100px');
    cy.get('[data-testid="paused-overlay"]')
      .should('have.css', 'width', '300px')
      .should('have.css', 'height', '100px');

    // The video element should be sized to match the paused overlay's dimensions
    cy.get(videoElementSelector)
      .should('have.css', 'width', '300px')
      .should('have.css', 'height', '100px');

    // The container should be sized to match the paused overlay's dimensions
    cy.get(playerContainerSelector)
      .should('have.css', 'width', '300px')
      .should('have.css', 'height', '100px');

    // The loading overlay should be sized to match the paused overlay's dimensions
    cy.get(loadingOverlayWrapperSelector)
      .should('have.css', 'width', '300px')
      .should('have.css', 'height', '100px');
    cy.get('[data-testid="loading-overlay"]')
      .should('have.css', 'width', '300px')
      .should('have.css', 'height', '100px');
  });

  it("the player should be styled correctly for the 'container' sizing mode", () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        sizingMode="container"
        style={{
          width: 100,
          height: 200,
        }}
        pausedOverlay={
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'red',
            }}
            data-testid="paused-overlay"
          >
            PAUSED
          </div>
        }
        loadingOverlay={
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'yellow',
            }}
            data-testid="loading-overlay"
          >
            LOADING
          </div>
        }
      />
    );

    // The container should be sized correctly
    cy.get(playerContainerSelector)
      .should('have.css', 'width', '100px')
      .should('have.css', 'height', '200px');

    // The video element should be sized to match the container's dimensions
    cy.get(videoElementSelector)
      .should('have.css', 'width', '100px')
      .should('have.css', 'height', '200px');

    // The paused overlay should be sized to match the container's dimensions
    cy.get(pausedOverlayWrapperSelector)
      .should('have.css', 'width', '100px')
      .should('have.css', 'height', '200px');
    cy.get('[data-testid="paused-overlay"]')
      .should('have.css', 'width', '100px')
      .should('have.css', 'height', '200px');

    // The loading overlay should be sized to match the container's dimensions
    cy.get(loadingOverlayWrapperSelector)
      .should('have.css', 'width', '100px')
      .should('have.css', 'height', '200px');

    cy.get('[data-testid="loading-overlay"]')
      .should('have.css', 'width', '100px')
      .should('have.css', 'height', '200px');
  });
});
