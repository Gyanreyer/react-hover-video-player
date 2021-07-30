// Custom cypress commands for common operations performed in our integration tests
Cypress.Commands.add('videoElement', () =>
  cy
    .get('[data-testid="hover-video-player-container"]')
    .children('video')
    // Wrap the video element so it can be chained with other cypress commands
    // and return it from this command's promise
    // This means we can now safely do things like cy.videoElement().should("have.property", "paused", false)
    .then(([videoElement]) => cy.wrap(videoElement))
);

Cypress.Commands.add('validateVideoSrc', (videoSrc) =>
  cy
    .videoElement()
    .should(
      'have.property',
      'currentSrc',
      `${window.location.origin}${videoSrc}`
    )
);

Cypress.Commands.add('triggerEventOnPlayer', (event) =>
  cy.get('[data-testid="hover-video-player-container"]').trigger(event)
);

Cypress.Commands.add('checkOverlayVisibilty', ({ paused, loading }) => {
  cy.get('[data-testid="hover-video-player-container"]')
    .children('[data-testid="paused-overlay-wrapper"]')
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

  cy.get('[data-testid="hover-video-player-container"]')
    .children('[data-testid="loading-overlay-wrapper"]')
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
  (expectedPlaybackState, contextMessage) => {
    expect(['playing', 'loading', 'paused']).to.include(expectedPlaybackState);

    const errorMessageContext = ` (${
      contextMessage || `the video should be ${expectedPlaybackState}`
    })`;

    return cy.videoElement().should((videoElement) => {
      switch (expectedPlaybackState) {
        case 'playing':
          assert.isFalse(
            videoElement.paused,
            'the video should not be paused' + errorMessageContext
          );
          assert.isFalse(
            videoElement.ended,
            'the video should not be ended' + errorMessageContext
          );

          assert.isAtLeast(
            videoElement.readyState,
            3,
            "The video's readyState should be HAVE_FUTURE_DATA or greater." +
              errorMessageContext
          );
          break;
        case 'loading':
          assert.isFalse(
            videoElement.paused,
            'the video should not be paused' + errorMessageContext
          );
          assert.isFalse(
            videoElement.ended,
            'the video should not be ended' + errorMessageContext
          );

          assert.isBelow(
            videoElement.readyState,
            3,
            "The video's readyState should be less than HAVE_FUTURE_DATA" +
              errorMessageContext
          );
          break;
        case 'paused':
        default:
          assert.isTrue(
            videoElement.paused || videoElement.ended,
            'the video should be either paused or ended' + errorMessageContext
          );
      }
    });
  }
);
