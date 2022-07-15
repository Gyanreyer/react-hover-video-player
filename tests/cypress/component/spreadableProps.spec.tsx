import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from 'react-hover-video-player';

import { makeMockVideoSrc } from '../utils';
import { playerContainerSelector } from '../constants';

describe('Generic html attributes can be passed through tp the container div', () => {
  it('sets custom data-testid and id attributes on the container element', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        data-testid="custom-data-testid"
        id="video-player-id"
      />
    );

    // The default container selector's data-testid should have been overridden
    cy.get(playerContainerSelector).should('not.exist');

    cy.get('[data-testid="custom-data-testid"]')
      .should('exist')
      .should('have.attr', 'id', 'video-player-id');
  });
});
