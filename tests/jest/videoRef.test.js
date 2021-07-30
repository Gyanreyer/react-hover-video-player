import React from 'react';
import { render, screen } from '@testing-library/react';

// This is being mapped in the jest config files so we can alternate between
// running tests off of the development version (../src) of the component or
// the built production version (../es)
// eslint-disable-next-line import/no-unresolved
import HoverVideoPlayer from 'react-hover-video-player';

describe('videoRef', () => {
  afterEach(() => {
    // No errors should be logged in any of these tests
    expect(console.error).not.toHaveBeenCalled();
  });

  test("correctly forwards HoverVideoPlayer's video element to the videoRef prop", () => {
    let videoRefValue;

    function PlayerWithVideoRef() {
      const videoRef = React.useRef();

      React.useEffect(() => {
        videoRefValue = videoRef.current;
      }, []);

      return <HoverVideoPlayer videoSrc="fake-video.mp4" videoRef={videoRef} />;
    }

    const { container } = render(<PlayerWithVideoRef />);
    expect(container).toMatchSnapshot();

    expect(videoRefValue).toBe(screen.getByTestId('video-element'));
  });
});
