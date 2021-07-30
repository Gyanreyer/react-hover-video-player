import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';

import { makeMockVideoSrc } from '../utils';

describe('hoverTarget prop', () => {
  beforeEach(() => {
    // Take manual control of timing so we can manually step through timeouts
    cy.clock();
  });

  it('works with a DOM node', () => {
    const videoSrc = makeMockVideoSrc();

    mount(<HoverVideoPlayer videoSrc={videoSrc} hoverTarget={document} />);

    cy.validateVideoSrc(videoSrc);

    cy.checkVideoPlaybackState('paused');

    cy.document().trigger('mouseenter');
    cy.checkVideoPlaybackState(
      'playing',
      'mousing over the document should start playback'
    );

    cy.document().trigger('mouseleave');
    cy.checkVideoPlaybackState(
      'paused',
      'mousing out of the document should pause the video'
    );
  });

  it('accepts a function that returns an element', () => {
    const videoSrc = makeMockVideoSrc();

    mount(
      <>
        <div
          data-testid="test-hover-target"
          style={{
            backgroundColor: 'red',
            padding: 8,
          }}
        >
          hover on me to play!
        </div>
        <HoverVideoPlayer
          videoSrc={videoSrc}
          hoverTarget={() =>
            document.querySelector('[data-testid="test-hover-target"]')
          }
        />
      </>
    );

    cy.validateVideoSrc(videoSrc);
    cy.checkVideoPlaybackState('paused');

    cy.get('[data-testid="test-hover-target"]').trigger('mouseenter');
    cy.checkVideoPlaybackState(
      'playing',
      'mousing over the hover target should start playback'
    );

    cy.get('[data-testid="test-hover-target"]').trigger('mouseleave');
    cy.checkVideoPlaybackState(
      'paused',
      'mousing out of the hover target should pause the video'
    );
  });

  it('accepts a React ref', () => {
    const videoSrc = makeMockVideoSrc();

    function PlayerWithCustomHoverTargetFunctionalComponent() {
      const hoverTargetRef = React.useRef();

      return (
        <>
          <div
            ref={hoverTargetRef}
            style={{
              backgroundColor: 'red',
              padding: 8,
            }}
            data-testid="test-hover-target"
          >
            hover on me to play!
          </div>
          <HoverVideoPlayer videoSrc={videoSrc} hoverTarget={hoverTargetRef} />
        </>
      );
    }

    mount(<PlayerWithCustomHoverTargetFunctionalComponent />);

    cy.validateVideoSrc(videoSrc);
    cy.checkVideoPlaybackState('paused');

    cy.get('[data-testid="test-hover-target"]').trigger('mouseenter');
    cy.checkVideoPlaybackState(
      'playing',
      'mousing over the hover target should start playing'
    );

    cy.get('[data-testid="test-hover-target"]').trigger('mouseleave');
    cy.checkVideoPlaybackState(
      'paused',
      'mousing out of the hover target should pause the video'
    );
  });
});
