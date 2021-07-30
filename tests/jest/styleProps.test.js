import React from 'react';

import { renderHoverVideoPlayer } from './utils';

describe('Classes and styles', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('applies className and id props correctly', () => {
    const {
      rerenderWithProps,
      videoElement,
      playerContainer,
      pausedOverlayWrapper,
      loadingOverlayWrapper,
    } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
    });

    expect(playerContainer).not.toHaveClass();
    expect(pausedOverlayWrapper).not.toHaveClass();
    expect(loadingOverlayWrapper).not.toHaveClass();
    expect(videoElement.id).toBe('');
    expect(videoElement).not.toHaveClass();

    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      loadingOverlay: <div />,
      className: 'container-class',
      pausedOverlayWrapperClassName: 'paused-overlay-class',
      loadingOverlayWrapperClassName: 'loading-overlay-class',
      videoClassName: 'video-class',
      videoId: 'video-id',
    });

    expect(playerContainer).toHaveClass('container-class');
    expect(pausedOverlayWrapper).toHaveClass('paused-overlay-class');
    expect(loadingOverlayWrapper).toHaveClass('loading-overlay-class');
    expect(videoElement.id).toBe('video-id');
    expect(videoElement).toHaveClass('video-class');
  });
});

describe('sizingMode', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('sizingMode "video" sets correct styling on the player', () => {
    const { videoElement, pausedOverlayWrapper } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      // sizingMode is 'video' by default
    });

    expect(videoElement).toHaveStyle({
      position: '',
      display: 'block',
    });
    expect(pausedOverlayWrapper).toHaveStyle({ position: 'absolute' });
  });

  test('sizingMode "overlay" sets correct styling on the player', () => {
    const { videoElement, pausedOverlayWrapper } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      sizingMode: 'overlay',
    });

    expect(pausedOverlayWrapper).toHaveStyle({ position: 'relative' });
    expect(videoElement).toHaveStyle({ position: 'absolute' });
  });

  test('sizingMode "container" sets correct styling on the player', () => {
    const { videoElement, pausedOverlayWrapper } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      sizingMode: 'container',
    });

    expect(videoElement).toHaveStyle({ position: 'absolute' });
    expect(pausedOverlayWrapper).toHaveStyle({ position: 'absolute' });
  });

  test('sizingMode "manual" sets correct styling on the player', () => {
    const { videoElement, pausedOverlayWrapper } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      pausedOverlay: <div />,
      sizingMode: 'manual',
    });

    // Position styles should not be set on the video or paused overlay
    expect(videoElement.style.position).toBe('');
    expect(pausedOverlayWrapper.style.position).toBe('');
  });
});
