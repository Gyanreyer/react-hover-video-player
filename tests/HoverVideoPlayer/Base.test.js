import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { expectVideoHasCorrectAttributes } from '../utils';
import HoverVideoPlayer from '../../src';

describe('Handles video props correctly', () => {
  test('isVideoMuted prop correctly sets muted attribute on video', () => {
    const { container, rerender } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement, { muted: true });

    // Re-render with the video unmuted
    rerender(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" isVideoMuted={false} />
    );
    expectVideoHasCorrectAttributes(videoElement, { muted: false });
  });

  test('shouldShowVideoControls prop correctly sets controls attribute on video', () => {
    const { container, rerender } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement, { controls: false });

    // Re-render with controls enabled on the video
    rerender(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        shouldShowVideoControls
      />
    );
    expectVideoHasCorrectAttributes(videoElement, { controls: true });
  });

  test('shouldVideoLoop prop correctly sets loop attribute on video', () => {
    const { container, rerender } = render(
      <HoverVideoPlayer videoSrc="fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement, { loop: true });

    // Re-render with looping disabled on the video
    rerender(
      <HoverVideoPlayer
        videoSrc="fake/video-file.mp4"
        shouldVideoLoop={false}
      />
    );
    expectVideoHasCorrectAttributes(videoElement, { loop: false });
  });
});
