import { renderHoverVideoPlayer } from './utils';

describe('videoCaptions prop', () => {
  describe('Handles valid videoCaptions prop values correctly', () => {
    afterEach(() => {
      // No errors should be logged in any of these tests
      expect(console.error).not.toHaveBeenCalled();
    });

    test('correctly handles receiving a valid object for the videoCaptions prop', () => {
      const { videoElement } = renderHoverVideoPlayer({
        videoSrc: '/fake/video-file.mp4',
        videoCaptions: {
          src: '/fake/captions-file-en.vtt',
          srcLang: 'en',
          label: 'English',
        },
      });

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(1);
      expect(videoTracks[0]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[0]).toHaveAttribute(
        'src',
        '/fake/captions-file-en.vtt'
      );
      expect(videoTracks[0]).toHaveAttribute('srclang', 'en');
      expect(videoTracks[0]).toHaveAttribute('label', 'English');
    });

    test('correctly handles receiving an array of objects for the videoCaptions prop', () => {
      const { videoElement } = renderHoverVideoPlayer({
        videoSrc: '/fake/video-file.mp4',
        videoCaptions: [
          {
            src: '/fake/captions-file-en.vtt',
            srcLang: 'en',
            label: 'English',
          },
          {
            src: '/fake/captions-file-fr.vtt',
            srcLang: 'fr',
            label: 'French',
          },
          {
            src: '/fake/captions-file-de.vtt',
            srcLang: 'de',
            label: 'German',
          },
        ],
      });

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(3);
      expect(videoTracks[0]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[0]).toHaveAttribute(
        'src',
        '/fake/captions-file-en.vtt'
      );
      expect(videoTracks[0]).toHaveAttribute('srclang', 'en');
      expect(videoTracks[0]).toHaveAttribute('label', 'English');

      expect(videoTracks[1]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[1]).toHaveAttribute(
        'src',
        '/fake/captions-file-fr.vtt'
      );
      expect(videoTracks[1]).toHaveAttribute('srclang', 'fr');
      expect(videoTracks[1]).toHaveAttribute('label', 'French');

      expect(videoTracks[2]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[2]).toHaveAttribute(
        'src',
        '/fake/captions-file-de.vtt'
      );
      expect(videoTracks[2]).toHaveAttribute('srclang', 'de');
      expect(videoTracks[2]).toHaveAttribute('label', 'German');
    });
  });

  describe('Handles invalid videoCaptions prop values correctly', () => {
    beforeEach(() => {
      // Mock console.error's implementation as a noop so that it won't get logged as an actual error
      console.error.mockImplementation(() => {});
    });
    afterEach(() => {
      console.error.mockReset();
    });

    test('correctly handles receiving a single invalid value for the videoCaptions prop', () => {
      const { videoElement } = renderHoverVideoPlayer({
        videoSrc: 'fake/video-file.mp4',
        videoCaptions: false,
      });

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(0);

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
        false
      );
    });

    test('correctly handles receiving an invalid value in an array for the videoCaptions prop', () => {
      const { videoElement } = renderHoverVideoPlayer({
        videoSrc: 'fake/video-file.mp4',
        videoCaptions: [
          {
            src: '/fake/captions-file-en.vtt',
            srcLang: 'en',
            label: 'English',
          },
          'bad-captions-file.vtt',
          100,
          {
            src: '/fake/captions-file-fr.vtt',
            srcLang: 'fr',
            label: 'French',
          },
        ],
      });

      const videoTracks = videoElement.querySelectorAll('track');
      expect(videoTracks).toHaveLength(2);
      expect(videoTracks[0]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[0]).toHaveAttribute(
        'src',
        '/fake/captions-file-en.vtt'
      );
      expect(videoTracks[0]).toHaveAttribute('srclang', 'en');
      expect(videoTracks[0]).toHaveAttribute('label', 'English');

      expect(videoTracks[1]).toHaveAttribute('kind', 'captions');
      expect(videoTracks[1]).toHaveAttribute(
        'src',
        '/fake/captions-file-fr.vtt'
      );
      expect(videoTracks[1]).toHaveAttribute('srclang', 'fr');
      expect(videoTracks[1]).toHaveAttribute('label', 'French');

      // Should have logged an error warning that the 'videoSrc' prop is required
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenNthCalledWith(
        1,
        "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
        'bad-captions-file.vtt'
      );
      expect(console.error).toHaveBeenNthCalledWith(
        2,
        "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
        100
      );
    });
  });
});
