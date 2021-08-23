import React from 'react';
import { mount } from '@cypress/react';
import HoverVideoPlayer from '../../../src';

import {
  HoverOverlay,
  HoverVideoPlayerWrappedWithFocusToggleButton,
  makeMockVideoSrc,
} from '../utils';
import { hoverOverlayWrapperSelector } from '../constants';

describe('hoverOverlay is applied correctly', () => {
  it('Shows the hoverOverlay when the video is played via a hover interaction', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc({ throttleKbps: 1000 })}
        hoverOverlay={<HoverOverlay />}
        overlayTransitionDuration={100}
      />
    );

    cy.checkOverlayVisibilty({ hover: false });

    // Hover to start playing the video
    cy.triggerEventOnPlayer('mouseenter');

    // The overlay should have faded in before the video starts playing
    cy.checkOverlayVisibilty({ hover: true });
    cy.checkVideoPlaybackState('loading');

    // The overlay should remain visible as the video is playing
    cy.checkVideoPlaybackState('playing');
    cy.checkOverlayVisibilty({ hover: true });

    // Mouse out to stop the video
    cy.triggerEventOnPlayer('mouseleave');
    // The hover overlay should be hidden again
    cy.checkOverlayVisibilty({ hover: false });

    cy.checkVideoPlaybackState('paused');
  });

  it('Shows the hoverOverlay when the video is played via the focused prop', () => {
    mount(
      <HoverVideoPlayerWrappedWithFocusToggleButton
        videoSrc={makeMockVideoSrc({ throttleKbps: 1000 })}
        hoverOverlay={<HoverOverlay />}
        overlayTransitionDuration={100}
      />
    );

    cy.checkOverlayVisibilty({ hover: false });

    // Toggle the focused prop to true to start the video
    cy.get('[data-testid="toggle-focus-button"]').click();

    // The overlay should have faded in before the video starts playing
    cy.checkOverlayVisibilty({ hover: true });
    cy.checkVideoPlaybackState('loading');

    // The overlay should remain visible as the video is playing
    cy.checkVideoPlaybackState('playing');
    cy.checkOverlayVisibilty({ hover: true });

    // Toggle the focused prop back to false to stop the video
    cy.get('[data-testid="toggle-focus-button"]').click();
    cy.checkOverlayVisibilty({ hover: false });

    cy.checkVideoPlaybackState('paused');
  });

  it('Applies custom style props to hoverOverlay wrapper', () => {
    mount(
      <HoverVideoPlayer
        videoSrc={makeMockVideoSrc()}
        hoverOverlay={<HoverOverlay />}
        hoverOverlayWrapperClassName="custom-hover-overlay-classname"
        hoverOverlayWrapperStyle={{
          backgroundColor: 'blue',
        }}
      />
    );

    cy.checkOverlayVisibilty({ hover: false });

    cy.get(hoverOverlayWrapperSelector).should(
      'have.css',
      'background-color',
      'rgb(0, 0, 255)'
    );
    cy.get(hoverOverlayWrapperSelector).should(
      'have.class',
      'custom-hover-overlay-classname'
    );
  });
});
