import {
  videoElementSelector,
  pausedOverlayWrapperSelector,
  loadingOverlayWrapperSelector,
  playerContainerSelector,
} from '../constants';

Cypress.Commands.add('triggerEventOnPlayer', (event) =>
  cy.get(playerContainerSelector).trigger(event)
);

Cypress.Commands.add('checkOverlayVisibilty', ({ paused, loading }) => {
  cy.get(playerContainerSelector)
    .children(pausedOverlayWrapperSelector)
    .should(([pausedOverlay]) => {
      if (paused === undefined) {
        assert.notExists(
          pausedOverlay,
          'There should not be a loading overlay'
        );
      } else {
        assert.strictEqual(
          pausedOverlay.style.opacity,
          paused ? '1' : '0',
          `The paused overlay should be ${paused ? 'visible' : 'hidden'}`
        );
      }
    });

  cy.get(playerContainerSelector)
    .children(loadingOverlayWrapperSelector)
    .should(([loadingOverlay]) => {
      if (loading === undefined) {
        assert.notExists(
          loadingOverlay,
          'There should not be a loading overlay'
        );
      } else {
        assert.strictEqual(
          loadingOverlay.style.opacity,
          loading ? '1' : '0',
          `The loading overlay should be ${loading ? 'visible' : 'hidden'}`
        );
      }
    });
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
