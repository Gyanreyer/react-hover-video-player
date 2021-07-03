import { renderHoverVideoPlayer } from './utils';

// Tests props that are passed through to the video element
describe('Video props', () => {
  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('muted prop correctly sets muted attribute on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // muted is true by default
    });

    expect(videoElement.muted).toBe(true);

    // Re-render with the video unmuted
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', muted: false });
    expect(videoElement.muted).toBe(false);

    // Re-render with muted explicitly set to true
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', muted: true });
    expect(videoElement.muted).toBe(true);
  });

  test('volume prop correctly sets volume attribute on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // volume is 1 by default
    });

    expect(videoElement.volume).toBe(1);

    // Re-render with a different volume level
    rerenderWithProps({ videoSrc: 'fake/video-file.mp4', volume: 0.2 });
    expect(videoElement.volume).toBe(0.2);
  });

  test('loop prop correctly sets loop attribute on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // loop is true by default
    });

    expect(videoElement).toHaveAttribute('loop');

    // Re-render with looping disabled on the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      loop: false,
    });
    expect(videoElement).not.toHaveAttribute('loop');

    // Re-render with loop explicitly set to true on the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      loop: true,
    });
    expect(videoElement).toHaveAttribute('loop');
  });

  test('crossOrigin prop correctly sets crossorigin attribute on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
      // crossOrigin is 'anonymous' by default
    });

    expect(videoElement).toHaveAttribute('crossorigin', 'anonymous');

    // Re-render with looping disabled on the video
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      crossOrigin: 'use-credentials',
    });
    expect(videoElement).toHaveAttribute('crossorigin', 'use-credentials');
  });

  test('preload prop correctly sets preload attribute on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    expect(videoElement).not.toHaveAttribute('preload');

    // Re-render with preload set to 'metadata'
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      preload: 'metadata',
    });
    expect(videoElement).toHaveAttribute('preload', 'metadata');
  });

  test('controls prop correctly sets controls attribute on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    // The video's `controls` attribute should not be set by default
    expect(videoElement).not.toHaveAttribute('controls');

    // Re-render with `controls` set to true
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      controls: true,
    });
    // The video should have a `controls` attribute set
    expect(videoElement).toHaveAttribute('controls');
  });

  test('controlsList prop correctly sets controlslist attribute on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    // The video's `controlslist` attribute should not be set by default
    expect(videoElement).not.toHaveAttribute('controlslist');

    // Re-render with `controlsList` set to "nodownload"
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      controlsList: 'nodownload',
    });
    // The video should have a `controls` attribute set
    expect(videoElement).toHaveAttribute('controlslist', 'nodownload');
  });

  test('disableRemotePlayback prop correctly sets disableRemotePlayback property on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    // The video's `disableRemotePlayback` attribute should be set to true by default
    expect(videoElement.disableRemotePlayback).toBe(true);

    // Re-render with `disableRemotePlayback` set to false
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      disableRemotePlayback: false,
    });
    // The video should have `disableRemotePlayback` set to false
    expect(videoElement.disableRemotePlayback).toBe(false);
  });

  test('disablePictureInPicture prop correctly sets disablePictureInPicture property on video', () => {
    const { rerenderWithProps, videoElement } = renderHoverVideoPlayer({
      videoSrc: 'fake/video-file.mp4',
    });

    // The video's `disablePictureInPicture` attribute should be set to true by default
    expect(videoElement.disablePictureInPicture).toBe(true);

    // Re-render with `disablePictureInPicture` set to false
    rerenderWithProps({
      videoSrc: 'fake/video-file.mp4',
      disablePictureInPicture: false,
    });
    // The video should have `disablePictureInPicture` set to false
    expect(videoElement.disablePictureInPicture).toBe(false);
  });
});
