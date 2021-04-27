import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// This is being mapped in the jest config files so we can alternate between
// running tests off of the development version (../src) of the component or
// the built production version (../es)
// eslint-disable-next-line import/no-unresolved
import HoverVideoPlayer from 'react-hover-video-player';

import { prepareVideoElementForTests, advanceVideoTime } from './utils';

describe('hoverTargetRef', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
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

    render(<PlayerWithCustomHoverTargetFunctionalComponent />);

    const playerContainer = screen.getByTestId('hover-video-player-container');
    const customHoverTarget = screen.getByTestId('test-hover-target');

    const videoElement = screen.getByTestId('video-element');
    // Hook up mocked video element behavior so we can test it easier
    prepareVideoElementForTests(videoElement);

    fireEvent.mouseEnter(playerContainer);
    fireEvent.touchStart(playerContainer);
    // Interactions should be ignored on player's container since a custom hover target is set
    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();

    // Interactions with the custom hover target should start and stop the video
    fireEvent.focus(customHoverTarget);

    // The video should load and play
    expect(videoElement).toBeLoading();
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    // Blur event should be ignored on the player's container
    fireEvent.blur(playerContainer);
    expect(videoElement).toBePlaying();

    // Blur event on the hover target should stop the video
    fireEvent.blur(customHoverTarget);
    // The video should be paused immediately because there's no pause overlay
    expect(videoElement).toBePaused();
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

    render(<PlayerWithCustomHoverTargetClassComponent />);

    const playerContainer = screen.getByTestId('hover-video-player-container');
    const customHoverTarget = screen.getByTestId('test-hover-target');

    const videoElement = screen.getByTestId('video-element');
    // Hook up mocked video element behavior so we can test it easier
    prepareVideoElementForTests(videoElement);

    fireEvent.mouseEnter(playerContainer);
    fireEvent.touchStart(playerContainer);
    // Interactions should be ignored on player's container since a custom hover target is set
    expect(videoElement.play).not.toHaveBeenCalled();
    expect(videoElement).toBePaused();

    // Interactions with the custom hover target should start and stop the video
    fireEvent.focus(customHoverTarget);

    // The video should load and play
    expect(videoElement).toBeLoading();
    advanceVideoTime(300);
    expect(videoElement).toBePlaying();

    // Blur event should be ignored on the player's container
    fireEvent.blur(playerContainer);
    expect(videoElement.pause).not.toHaveBeenCalled();
    expect(videoElement).toBePlaying();

    // Blur event on the hover target should stop the video
    fireEvent.blur(customHoverTarget);
    // The video should be paused immediately because there's no pause overlay
    expect(videoElement.pause).toHaveBeenCalledTimes(1);
    expect(videoElement).toBePaused();
  });
});
