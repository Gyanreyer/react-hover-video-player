import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { expectVideoHasCorrectAttributes } from '../utils';
import HoverVideoPlayer from '../../src';

describe('Handles valid videoSrc prop values correctly', () => {
  test('correctly handles receiving a string for the videoSrc prop', () => {
    const { container } = render(
      <HoverVideoPlayer videoSrc="/fake/video-file.mp4" />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const videoSources = videoElement.querySelectorAll('source');
    expect(videoSources).toHaveLength(1);
    expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.mp4');
    expect(videoSources[0]).not.toHaveAttribute('type');
  });

  test('correctly handles receiving an array of strings for the videoSrc prop', () => {
    const { container } = render(
      <HoverVideoPlayer
        videoSrc={['/fake/video-file.webm', '/fake/video-file.mp4']}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const videoSources = videoElement.querySelectorAll('source');
    expect(videoSources).toHaveLength(2);
    expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
    expect(videoSources[0]).not.toHaveAttribute('type');
    expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.mp4');
    expect(videoSources[1]).not.toHaveAttribute('type');
  });

  test('correctly handles receiving a valid object for the videoSrc prop', () => {
    const { container } = render(
      <HoverVideoPlayer
        videoSrc={{ src: '/fake/video-file.mp4', type: 'video/mp4' }}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const videoSources = videoElement.querySelectorAll('source');
    expect(videoSources).toHaveLength(1);
    expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.mp4');
    expect(videoSources[0]).toHaveAttribute('type', 'video/mp4');
  });

  test('correctly handles receiving an array of objects for the videoSrc prop', () => {
    const { container } = render(
      <HoverVideoPlayer
        videoSrc={[
          { src: '/fake/video-file.webm', type: 'video/webm' },
          { src: '/fake/video-file.mp4', type: 'video/mp4' },
        ]}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const videoSources = videoElement.querySelectorAll('source');
    expect(videoSources).toHaveLength(2);
    expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
    expect(videoSources[0]).toHaveAttribute('type', 'video/webm');
    expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.mp4');
    expect(videoSources[1]).toHaveAttribute('type', 'video/mp4');
  });

  test('correctly handles receiving an array with a mix of strings and objects for the videoSrc prop', () => {
    const { container } = render(
      <HoverVideoPlayer
        videoSrc={[
          '/fake/video-file.webm',
          { src: '/fake/video-file.avi' },
          { src: '/fake/video-file.mp4', type: 'video/mp4' },
        ]}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const videoSources = videoElement.querySelectorAll('source');
    expect(videoSources).toHaveLength(3);
    expect(videoSources[0]).toHaveAttribute('src', '/fake/video-file.webm');
    expect(videoSources[0]).not.toHaveAttribute('type');
    expect(videoSources[1]).toHaveAttribute('src', '/fake/video-file.avi');
    expect(videoSources[1]).not.toHaveAttribute('type');
    expect(videoSources[2]).toHaveAttribute('src', '/fake/video-file.mp4');
    expect(videoSources[2]).toHaveAttribute('type', 'video/mp4');
  });
});

describe('Handles invalid videoSrc prop values correctly', () => {
  let originalConsoleError;

  beforeEach(() => {
    // Mock the console.error function so we can verify that an error was logged correctly
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test('correctly handles not receiving a videoSrc prop', () => {
    const { container } = render(<HoverVideoPlayer />);

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const videoSources = videoElement.querySelectorAll('source');
    expect(videoSources).toHaveLength(0);

    // Should have logged an error warning that the 'videoSrc' prop is required
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "Error: 'videoSrc' prop is required for HoverVideoPlayer component"
    );
  });

  test('correctly handles receiving a single invalid value for the videoSrc prop', () => {
    const { container } = render(<HoverVideoPlayer videoSrc={100} />);

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const videoSources = videoElement.querySelectorAll('source');
    expect(videoSources).toHaveLength(0);

    // Should have logged an error warning that the 'videoSrc' prop is required
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "Error: invalid value provided to HoverVideoPlayer prop 'videoSrc':",
      100
    );
  });

  test('correctly handles receiving an invalid value in an array for the videoSrc prop', () => {
    const { container } = render(
      <HoverVideoPlayer
        videoSrc={[
          'valid-video-file.webm',
          false,
          { src: 'valid-video-file.mp4', type: 'video/mp4' },
        ]}
      />
    );

    expect(container).toMatchSnapshot();

    const videoElement = container.querySelector('video');
    expectVideoHasCorrectAttributes(videoElement);

    const videoSources = videoElement.querySelectorAll('source');
    expect(videoSources).toHaveLength(2);
    expect(videoSources[0]).toHaveAttribute('src', 'valid-video-file.webm');
    expect(videoSources[0]).not.toHaveAttribute('type');
    expect(videoSources[1]).toHaveAttribute('src', 'valid-video-file.mp4');
    expect(videoSources[1]).toHaveAttribute('type', 'video/mp4');

    // Should have logged an error warning that the 'videoSrc' prop is required
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "Error: invalid value provided to HoverVideoPlayer prop 'videoSrc':",
      false
    );
  });
});
