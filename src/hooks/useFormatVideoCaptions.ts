import { useMemo } from 'react';
import {
  VideoCaptionsTrack,
  VideoCaptionsProp,
} from '../HoverVideoPlayer.types';

/**
 * Hook takes the videoCaptions prop and formats it as a standardized array of VideoCaptionsTrack objects which can be used to render
 * <track> elements for the video
 *
 * @param {VideoCaptionsProp} videoCaptions - Captions track(s) to use for the video player for accessibility.
 *
 * @returns {VideoCaptionsTrack[]}  Array of formatted VideoCaptionsTrack objects which can be used to render <track> elements for the video
 */
export default function useFormatVideoCaptions(
  videoCaptions: VideoCaptionsProp
): VideoCaptionsTrack[] {
  return useMemo(() => {
    const formattedVideoCaptions = [];

    // If captions were provided, format them for use for the video
    if (videoCaptions != null) {
      // Make sure we can treat the videoCaptions value as an array
      const rawVideoCaptions = Array.isArray(videoCaptions)
        ? videoCaptions
        : [videoCaptions];

      // Parse our raw video captions values into an array of formatted VideoCaptionsTrack
      // objects that can be used to render caption tracks for the video
      for (
        let i = 0, numCaptions = rawVideoCaptions.length;
        i < numCaptions;
        i += 1
      ) {
        const captions = rawVideoCaptions[i];

        if (captions && captions.src) {
          formattedVideoCaptions.push({
            src: captions.src,
            srcLang: captions.srcLang,
            label: captions.label,
            kind: captions.kind || 'captions',
            default: Boolean(captions.default),
          });
        } else {
          // Log an error if one of the videoCaptions values is invalid
          console.error(
            "Error: invalid value provided to HoverVideoPlayer prop 'videoCaptions'",
            captions
          );
        }
      }
    }

    return formattedVideoCaptions;
  }, [videoCaptions]);
}
