import React from 'react';
import { render } from '@testing-library/react';
import { matchers } from 'jest-emotion';
import '@testing-library/jest-dom/extend-expect';

import { LoadingSpinnerOverlay } from '../src';

// Extend expect with emotion styling tests
expect.extend(matchers);

describe('LoadingSpinnerOverlay', () => {
  test('animationDuration prop sets duration on animations correctly', () => {
    const { container } = render(
      <LoadingSpinnerOverlay animationDuration={300} />
    );

    expect(container).toMatchSnapshot();

    const svgElement = container.querySelector('svg');
    const circleElement = container.querySelector('circle');

    expect(svgElement.style.animationDuration).toBe('300ms');
    // The circle element's animation duration should be 1.5x the svg's duration
    expect(circleElement.style.animationDuration).toBe('450ms');
  });

  test('shouldAnimateStroke prop applies animation to circle element correctly', () => {
    // shouldAnimateStroke is true by default
    const { container, rerender } = render(<LoadingSpinnerOverlay />);

    expect(container).toMatchSnapshot();

    const circleElement = container.querySelector('circle');

    expect(circleElement).toHaveStyleRule(
      'animation-name',
      'spinner-stroke-animation'
    );

    rerender(<LoadingSpinnerOverlay shouldAnimateStroke={false} />);

    expect(container).toMatchSnapshot();

    expect(circleElement).not.toHaveStyleRule(
      'animation-name',
      'spinner-stroke-animation'
    );
  });

  test('shouldShowDarkenedBackground prop adds darkened background to overlay correctly', () => {
    // shouldShowDarkenedBackground is true by default
    const { container, rerender } = render(<LoadingSpinnerOverlay />);

    expect(container).toMatchSnapshot();

    const overlayWrapperElement = container.querySelector('div');

    expect(overlayWrapperElement).toHaveStyleRule(
      'background-color',
      'rgba(0,0,0,0.7)'
    );

    rerender(<LoadingSpinnerOverlay shouldShowDarkenedBackground={false} />);

    expect(container).toMatchSnapshot();

    expect(overlayWrapperElement).not.toHaveStyleRule('background-color');
  });
});
