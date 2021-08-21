import { useMemo } from 'react';
import { VideoSource, VideoSrcProp } from '../HoverVideoPlayer.types';

/**
 * @function  formatVideoSrc
 *
 * Hook takes the videoSrc prop and formats it as a standardized array of VideoSource objects which can be used to render
 * <source> elements for the video
 *
 * @param {VideoSrcProp}  videoSrc - Source(s) to format into VideoSource objects so they can be added to the video player.
 * @param {number}  playbackRangeStart - The earliest time in seconds that we should start loading the video from.
 *                                        This will be enforced by using a #t media fragment identifier to tell the browser to only
 *                                        load the video starting from this time.
 *                                        If not provided, we will load from the start of the video.
 * @param {number}  playbackRangeEnd - The maximum time in seconds that we should load the video to.
 *                                        This will be enforced by using a #t media fragment identifier to tell the browser to only
 *                                        load the video up to this time.
 *                                        If not provided, we will load to the end of the video.
 *
 * @returns {VideoSource[]} Array of formatted VideoSource objects which can be used to render <source> elements for the video
 */
export default function useFormatVideoSrc(
  videoSrc: VideoSrcProp,
  playbackRangeStart?: number,
  playbackRangeEnd?: number
): VideoSource[] {
  return useMemo(() => {
    const formattedVideoSources = [];

    if (videoSrc == null) {
      // A videoSrc value is required in order to make the video player work
      console.error(
        "Error: 'videoSrc' prop is required for HoverVideoPlayer component"
      );
    } else {
      // Make sure we can treat the videoSrc value as an array
      const rawVideoSources = Array.isArray(videoSrc) ? videoSrc : [videoSrc];

      // Parse our video source values into an array of VideoSource objects that can be used to render sources for the video
      for (
        let i = 0, numSources = rawVideoSources.length;
        i < numSources;
        i += 1
      ) {
        const source = rawVideoSources[i];

        const hasPlaybackRangeStart = playbackRangeStart !== null;
        const hasPlaybackRangeEnd = playbackRangeEnd !== null;

        // Construct a media fragment identifier string to append to the video's URL to ensure
        // we only load the portion of the video that we need for the provided playback range
        // (see here for more details: https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery#specifying_playback_range)
        const playbackRangeMediaFragmentIdentifier =
          hasPlaybackRangeStart || hasPlaybackRangeEnd
            ? // If we have a playback range defined, construct a #t media fragment identifier string
              // This identifier follows the format `#t=[starttime][,endtime]` and will tell the browser to only load the video file
              // within this defined time range.
              // This helps save us from loading some unneeded data when we only need whatever is within the playback range!
              `#t=${hasPlaybackRangeStart ? playbackRangeStart : ''}${
                hasPlaybackRangeEnd ? `,${playbackRangeEnd}` : ''
              }`
            : '';

        if (typeof source === 'string') {
          // If the source is a string, it's an src URL so format it into a VideoSource object and add it to the array
          formattedVideoSources.push({
            src: `${source}${playbackRangeMediaFragmentIdentifier}`,
          });
        } else if (source && source.src) {
          // If the source is an object with an src, just add it to the array
          formattedVideoSources.push({
            src: `${source.src}${playbackRangeMediaFragmentIdentifier}`,
            type: source.type,
          });
        } else {
          // Log an error if one of the videoSrc values is invalid
          console.error(
            "Error: invalid value provided to HoverVideoPlayer prop 'videoSrc':",
            source
          );
        }
      }
    }

    return formattedVideoSources;
  }, [videoSrc, playbackRangeStart, playbackRangeEnd]);
}
