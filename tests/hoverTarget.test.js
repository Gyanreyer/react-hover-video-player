import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// This is being mapped in the jest config files so we can alternate between
// running tests off of the development version (../src) of the component or
// the built production version (../es)
// eslint-disable-next-line import/no-unresolved
import HoverVideoPlayer from 'react-hover-video-player';

import {
  renderHoverVideoPlayer,
  prepareVideoElementForTests,
  advanceVideoTime,
} from './utils';

const testHoverTargetElement = (hoverTargetElement) => {
  const playerContainer = screen.getByTestId('hover-video-player-container');
  const videoElement = screen.getByTestId('video-element');

  fireEvent.mouseEnter(playerContainer);
  fireEvent.touchStart(playerContainer);
  // Interactions should be ignored on player's container since a custom hover target is set
  expect(videoElement.play).not.toHaveBeenCalled();
  expect(videoElement).toBePaused();

  // Interactions with the custom hover target should start and stop the video
  fireEvent.focus(hoverTargetElement);

  // The video should load and play
  expect(videoElement).toBeLoading();
  advanceVideoTime(300);
  expect(videoElement).toBePlaying();

  // Blur event should be ignored on the player's container
  fireEvent.blur(playerContainer);
  expect(videoElement).toBePlaying();

  // Blur event on the hover target should stop the video
  fireEvent.blur(hoverTargetElement);
  // The video should be paused immediately because there's no pause overlay
  expect(videoElement).toBePaused();
};

describe('hoverTarget', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('hoverTarget accepts a DOM node', () => {
    render(<div data-testid="test-hover-target" />);

    const hoverTargetElement = screen.getByTestId('test-hover-target');

    renderHoverVideoPlayer({
      videoSrc: 'fake-video.mp4',
      hoverTarget: hoverTargetElement,
    });

    testHoverTargetElement(hoverTargetElement);
  });

  test('hoverTarget accepts a function that returns an element', () => {
    render(<div data-testid="test-hover-target" />);

    renderHoverVideoPlayer({
      videoSrc: 'fake-video.mp4',
      hoverTarget: () => screen.getByTestId('test-hover-target'),
    });

    testHoverTargetElement(screen.getByTestId('test-hover-target'));
  });

  test('hoverTarget accepts a React ref', () => {
    function PlayerWithCustomHoverTargetFunctionalComponent() {
      const hoverTargetRef = React.useRef();

      return (
        <div>
          <a href="#test" ref={hoverTargetRef} data-testid="test-hover-target">
            Hovering on me will start the video!
          </a>
          <HoverVideoPlayer
            videoSrc="fake-video.mp4"
            hoverTarget={hoverTargetRef}
          />
        </div>
      );
    }

    const { container } = render(
      <PlayerWithCustomHoverTargetFunctionalComponent />
    );
    expect(container).toMatchSnapshot();

    const videoElement = screen.getByTestId('video-element');
    // Hook up mocked video element behavior so we can test it
    prepareVideoElementForTests(videoElement);

    testHoverTargetElement(screen.getByTestId('test-hover-target'));
  });

  test('logs errors if hoverTarget receives an invalid value', () => {
    const errorMessage =
      'HoverVideoPlayer was unable to add event listeners to a hover target. Please check your usage of the `hoverTarget` prop.';

    // Mock console.error's implementation as a noop so that it won't get logged as an actual error
    console.error.mockImplementation(() => {});

    expect(console.error).not.toHaveBeenCalled();

    const {
      rerenderWithProps,
      playerContainer,
      videoElement,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake-video.mp4',
      // hoverTarget received a function that doesn't return a valid Node
      hoverTarget: () => {
        const target = document;
      },
    });

    // An error should have been logged
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(errorMessage);

    // Interactions should be ignored on the player's container since a custom hover target is supposed to be set,
    // even if the hover target was invalid
    fireEvent.mouseEnter(playerContainer);
    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();

    // Reset console.error's calls so we can test again
    console.error.mockClear();

    expect(console.error).not.toHaveBeenCalled();

    rerenderWithProps({
      videoSrc: 'fake-video.mp4',
      // hoverTarget received a value with a completely invalid type
      hoverTarget: 'invalid value',
    });

    // An error should have been logged
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(errorMessage);

    // Interactions with the player container should still be ignored
    fireEvent.mouseEnter(playerContainer);
    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();

    // Reset console.error's calls so we can test again
    console.error.mockClear();

    expect(console.error).not.toHaveBeenCalled();

    rerenderWithProps({
      videoSrc: 'fake-video.mp4',
      // hoverTarget received a React ref that has not been attached to an element correctly
      hoverTarget: React.createRef(),
    });

    // An error should have been logged
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(errorMessage);

    // Interactions with the player container should still be ignored
    fireEvent.mouseEnter(playerContainer);
    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();

    console.error.mockReset();
  });
});

describe('hoverTargetRef', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
    console.warn.mockClear();
  });

  afterAll(() => {
    console.warn.mockRestore();
  });

  test('hoverTargetRef works correctly for a functional component', () => {
    function PlayerWithCustomHoverTargetFunctionalComponent() {
      const hoverTargetRef = React.useRef();

      return (
        <div>
          <a href="#test" ref={hoverTargetRef} data-testid="test-hover-target">
            Hovering on me will start the video!
          </a>
          <HoverVideoPlayer
            videoSrc="fake-video.mp4"
            hoverTargetRef={hoverTargetRef}
          />
        </div>
      );
    }

    const { container } = render(
      <PlayerWithCustomHoverTargetFunctionalComponent />
    );
    expect(container).toMatchSnapshot();

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      'The `hoverTargetRef` prop is deprecated in favor of `hoverTarget` and will be removed in the next major version of `react-hover-video-player`. To migrate, simply rename the prop to `hoverTarget` and it should continue working as intended.'
    );

    const videoElement = screen.getByTestId('video-element');
    // Hook up mocked video element behavior so we can test it easier
    prepareVideoElementForTests(videoElement);

    testHoverTargetElement(screen.getByTestId('test-hover-target'));
  });

  test('hoverTargetRef works correctly for a class component', () => {
    class PlayerWithCustomHoverTargetClassComponent extends React.Component {
      constructor(props) {
        super(props);

        this.hoverTarget = React.createRef();
      }

      render() {
        return (
          <div>
            <a
              href="#test"
              ref={this.hoverTarget}
              data-testid="test-hover-target"
            >
              Hovering on me will start the video!
            </a>
            <HoverVideoPlayer
              videoSrc="fake-video.mp4"
              hoverTargetRef={this.hoverTarget}
            />
          </div>
        );
      }
    }

    const { container } = render(<PlayerWithCustomHoverTargetClassComponent />);
    expect(container).toMatchSnapshot();

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      'The `hoverTargetRef` prop is deprecated in favor of `hoverTarget` and will be removed in the next major version of `react-hover-video-player`. To migrate, simply rename the prop to `hoverTarget` and it should continue working as intended.'
    );

    const videoElement = screen.getByTestId('video-element');
    // Hook up mocked video element behavior so we can test it easier
    prepareVideoElementForTests(videoElement);

    testHoverTargetElement(screen.getByTestId('test-hover-target'));
  });
});
