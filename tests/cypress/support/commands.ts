import {
  videoElementSelector,
  pausedOverlayWrapperSelector,
  loadingOverlayWrapperSelector,
  hoverOverlayWrapperSelector,
  playerContainerSelector,
} from '../constants';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Fires an event on the player's container.
       *
       * @param {string} eventName   The name of the type of event to fire, ie 'mouseenter'
       */
      triggerEventOnPlayer(eventName: string): Chainable<Element>;

      /**
       * Checks the visibility status of the pausedOverlay, loadingOverlay, and/or hoverOverlay.
       *
       * @param {Object} expectedOverlayVisibilityStatus  An object describing the expected visibility statuses of each
       *                    overlay. For instance, if you expect the pausedOverlay to be visible, provide `paused: true`,
       *                    or if you expect it to be hidden, provide `paused: false`.
       *                    If an overlay is not set and therefore should not be rendered at all, simply exclude
       *                    the overlay's property altogether.
       */
      checkOverlayVisibilty(expectedOverlayVisibilityStatus: {
        paused?: boolean;
        loading?: boolean;
        hover?: boolean;
      });

      /**
       *
       * @param expectedPlaybackState
       * @param message
       */
      checkVideoPlaybackState(expectedPlaybackState: string, message?: string);
    }
  }
}

Cypress.Commands.add(
  'triggerEventOnPlayer',
  (eventName: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get(playerContainerSelector).trigger(eventName)
);

Cypress.Commands.add(
  'checkOverlayVisibilty',
  ({
    paused,
    loading,
    hover,
  }: {
    paused?: boolean;
    loading?: boolean;
    hover?: boolean;
  }) => {
    if (paused === undefined) {
      cy.log('There should not be a paused overlay');
      cy.get(pausedOverlayWrapperSelector).should('not.exist');
    } else {
      cy.log(`The paused overlay should be ${paused ? 'visible' : 'hidden'}`);
      cy.get(pausedOverlayWrapperSelector).should(
        'have.css',
        'opacity',
        paused ? '1' : '0'
      );
    }

    if (loading === undefined) {
      cy.log('There should not be a loading overlay');
      cy.get(loadingOverlayWrapperSelector).should('not.exist');
    } else {
      cy.log(`The loading overlay should be ${loading ? 'visible' : 'hidden'}`);
      cy.get(loadingOverlayWrapperSelector).should(
        'have.css',
        'opacity',
        loading ? '1' : '0'
      );
    }

    if (hover === undefined) {
      cy.log('There should not be a hover overlay');
      cy.get(hoverOverlayWrapperSelector).should('not.exist');
    } else {
      cy.log(`The hover overlay should be ${hover ? 'visible' : 'hidden'}`);
      cy.get(hoverOverlayWrapperSelector).should(
        'have.css',
        'opacity',
        hover ? '1' : '0'
      );
    }
  }
);

Cypress.Commands.add(
  'checkVideoPlaybackState',
  (
    expectedPlaybackState: string,
    message = `the video should be ${expectedPlaybackState}`
  ) => {
    cy.log(message);

    expect(['playing', 'loading', 'paused', 'ended']).to.include(
      expectedPlaybackState
    );

    switch (expectedPlaybackState) {
      case 'playing':
        // The video should not be paused or ended
        cy.get(videoElementSelector)
          .invoke('prop', 'paused')
          .should('be.false');
        cy.get(videoElementSelector).invoke('prop', 'ended').should('be.false');

        // The video's readyState should be HAVE_FUTURE_DATA or greater.
        cy.get(videoElementSelector)
          .invoke('prop', 'readyState')
          .should('be.gte', HTMLMediaElement.HAVE_FUTURE_DATA);

        break;
      case 'loading':
        // The video should not be paused or ended
        cy.get(videoElementSelector)
          .invoke('prop', 'paused')
          .should('be.false');
        cy.get(videoElementSelector).invoke('prop', 'ended').should('be.false');

        // The video's readyState should be less than HAVE_FUTURE_DATA
        cy.get(videoElementSelector)
          .invoke('prop', 'readyState')
          .should('be.lessThan', HTMLMediaElement.HAVE_FUTURE_DATA);

        break;
      case 'paused':
        // The video should be paused but not ended
        cy.get(videoElementSelector).invoke('prop', 'paused').should('be.true');
        cy.get(videoElementSelector).invoke('prop', 'ended').should('be.false');
        break;
      case 'ended':
      default:
        // The video should be ended and paused
        cy.get(videoElementSelector).invoke('prop', 'ended').should('be.true');
        cy.get(videoElementSelector).invoke('prop', 'paused').should('be.true');
    }
  }
);
