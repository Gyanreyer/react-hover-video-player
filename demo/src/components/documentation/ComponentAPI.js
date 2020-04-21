import React from 'react';
import { css, cx } from 'emotion';

import LiveEditableCodeSection from '../LiveEditableCodeSection';
import { breakpoints } from '../../constants/sharedStyles';

const documentationText = css`
  margin-left: 4px;
`;

const singleVideoSrcExampleCode = `<HoverVideoPlayer
  videoSrc="video/butterflies.mp4"
/>`;

const multipleVideoSrcExampleCode = `<HoverVideoPlayer
  videoSrc={[
    { src: 'video/butterflies.webm', type: 'video/webm' },
    { src: 'video/butterflies.mp4', type: 'video/mp4' },
  ]}
/>`;

export default function ComponentAPI() {
  return (
    <>
      <h2
        className={css`
          margin-top: 32px;
        `}
        id="component-api"
      >
        Component API
      </h2>
      <section
        className={css`
          margin-left: 12px;
          max-width: 640px;
        `}
      >
        <h3
          id="videoSrc"
          className={css`
            :hover,
            :focus-within {
              .required-message {
                opacity: 1;
              }
            }
          `}
        >
          <a href="#videoSrc">videoSrc</a>
          <span
            className={css`
              color: #ff6961;
              margin-left: 4px;
            `}
          >
            <span className="asterisk">*</span>
            <span
              className={cx(
                css`
                  display: inline-block;
                  vertical-align: super;
                  font-size: 12px;
                  margin: 0 0 0 3px;
                  opacity: 0;
                  transition: opacity 0.1s;

                  ${breakpoints.medium} {
                    opacity: 1;
                  }
                `,
                'required-message'
              )}
            >
              this prop is required
            </span>
          </span>
        </h3>

        <p className={documentationText}>
          <em>videoSrc</em> accepts a one or multiple values descibing the video
          source file(s) that should be used for the video player.
        </p>
        <figure>
          <figcaption className={documentationText}>
            If you only have <em>one video source</em>, you can simply provide
            the URL path to the video file as a string
          </figcaption>
          <LiveEditableCodeSection code={singleVideoSrcExampleCode} />
        </figure>
        <figure>
          <figcaption className={documentationText}>
            If you would like to use <em>multiple video sources</em>, you can
            provide all of them in an array of objects which include each source
            files&#39; URL and{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#Audio_and_video_types">
              MIME type
            </a>
          </figcaption>
          <LiveEditableCodeSection code={multipleVideoSrcExampleCode} />
        </figure>
        <p className={documentationText}>
          <em>
            <b>Tip</b>: If you use multiple video sources, make sure to order
            them by file size.
          </em>
        </p>
        <p className={documentationText}>
          When you provide multiple sources for a video, the browser will always
          pick the first format in the list that it supports and just go with
          that rather than checking if one would load faster than another.
        </p>
      </section>
    </>
  );
}
