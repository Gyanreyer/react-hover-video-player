import {
  videoElementSelector,
  pausedOverlayWrapperSelector,
  loadingOverlayWrapperSelector,
  hoverOverlayWrapperSelector,
  playerContainerSelector,
} from '../constants';

Cypress.Commands.add('triggerEventOnPlayer', (event) =>
  cy.get(playerContainerSelector).trigger(event)
);

Cypress.Commands.add('checkOverlayVisibilty', ({ paused, loading, hover }) => {
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
});

Cypress.Commands.add(
  'checkVideoPlaybackState',
  (
    expectedPlaybackState,
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
          .should('be.gte', HTMLVideoElement.HAVE_FUTURE_DATA);

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
          .should('be.lessThan', HTMLVideoElement.HAVE_FUTURE_DATA);

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
