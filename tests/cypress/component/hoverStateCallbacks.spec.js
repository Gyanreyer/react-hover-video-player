import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';

import { makeMockVideoSrc } from '../utils';

describe('onHoverStart and onHoverEnd callbacks', () => {
  it('Fires onHoverStart callback correctly', () => {
    const onHoverStart = cy.stub().as('onHoverStart');

    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        onHoverStart={onHoverStart}
      />
    );

    cy.get('@onHoverStart').should('not.have.been.called');

    // onHoverStart should be called once after a mouseenter event is fired
    cy.triggerEventOnPlayer('mouseenter');
    cy.get('@onHoverStart').should('have.been.calledOnce');

    // onHoverStart should not have be called after a mouseleave event
    cy.triggerEventOnPlayer('mouseleave');
    cy.get('@onHoverStart').should('have.been.calledOnce');

    cy.triggerEventOnPlayer('touchstart');
    cy.get('@onHoverStart').should('have.been.calledTwice');
  });

  it('Fires onHoverEnd callback correctly', () => {
    const onHoverEnd = cy.stub().as('onHoverEnd');

    mount(
      <HoverVideoPlayer videoSrc={makeMockVideoSrc()} onHoverEnd={onHoverEnd} />
    );

    cy.triggerEventOnPlayer('mouseenter');

    cy.get('@onHoverEnd').should('not.have.been.called');

    // onHoverEnd should be called once after a mouseleave event is fired
    cy.triggerEventOnPlayer('mouseleave');
    cy.get('@onHoverEnd').should('have.been.calledOnce');

    // onHoverEnd should not have be called after a touchstart event
    cy.triggerEventOnPlayer('touchstart');
    cy.get('@onHoverEnd').should('have.been.calledOnce');

    // Touch outside of the player to stop hovering
    cy.document().then((doc) => {
      doc.body.dispatchEvent(
        new TouchEvent('touchstart', {
          bubbles: true,
        })
      );
    });
    cy.get('@onHoverEnd').should('have.been.calledTwice');
  });

  it('Fires hover state callbacks correctly when both are provided', () => {
    const onHoverStart = cy.stub().as('onHoverStart');
    const onHoverEnd = cy.stub().as('onHoverEnd');

    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      />
    );

    cy.get('@onHoverStart').should('not.have.been.called');
    cy.get('@onHoverEnd').should('not.have.been.called');

    cy.triggerEventOnPlayer('mouseenter');

    // onHoverStart should have been called
    cy.get('@onHoverStart').should('have.been.calledOnce');
    // onHoverEnd should not have been called yet
    cy.get('@onHoverEnd').should('not.have.been.called');

    cy.triggerEventOnPlayer('mouseleave');

    // onHoverEnd should have been called
    cy.get('@onHoverEnd').should('have.been.calledOnce');
    // onHoverStart should not have been called a second time
    cy.get('@onHoverStart').should('have.been.calledOnce');
  });
});
