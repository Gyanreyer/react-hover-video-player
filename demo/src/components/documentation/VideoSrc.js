import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import DocSectionHeading from './DocSectionHeading';

const singleVideoSrcExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
/>`;

const multipleVideoSrcExampleCode = `<HoverVideoPlayer
  videoSrc={[
    { src: 'video/butterflies.webm', type: 'video/webm' },
    { src: 'video/butterflies.mp4', type: 'video/mp4' },
  ]}
/>`;

export default function VideoSrc() {
  return (
    <>
      <DocSectionHeading id="videoSrc" isRequired>
        videoSrc
      </DocSectionHeading>
      <p>
        <em>videoSrc</em> accepts one or multiple values descibing the video
        source file(s) that should be used for the video player.
      </p>
      <p className="required-message">* this prop is required</p>
      <figure>
        <figcaption>
          If you only have <em>one video source</em>, you can simply provide the
          URL path to the video file as a string
        </figcaption>
        <LiveEditableCodeSection code={singleVideoSrcExampleCode} />
      </figure>
      <figure>
        <figcaption>
          If you would like to use <em>multiple video sources</em>, you can
          provide all of them in an array of objects which include each source
          file&#39;s URL and{' '}
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#Audio_and_video_types">
            MIME type
          </a>
        </figcaption>
        <LiveEditableCodeSection code={multipleVideoSrcExampleCode} />
      </figure>
      <p>
        <em>
          <b>Tip</b>: If you use multiple video sources, make sure to order them
          by file size from smallest to largest.
        </em>
      </p>
      <p>
        When you provide multiple sources for a video, the browser will always
        pick the first format in the list that it supports and just go with that
        rather than checking if one would load faster than another.
      </p>
    </>
  );
}
