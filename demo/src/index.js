import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';
import ReactMarkdown from 'react-markdown';
import useFetch, { Provider } from 'use-http';

import Heading from './components/MarkdownHeading';
import { InlineCode, CodeBlock } from './components/MarkdownCodeSnippet';
import NavigationLinkList from './components/NavigationLinkList';
import LoadingSpinnerOverlay from './components/LoadingSpinnerOverlay';
import HoverVideoPlayer from '../../src';
import { breakpoints } from './constants/sharedStyles';

import './DevPlayground';

// Custom renderers allow us to define how react-markdown should render various things
const markdownRenderers = {
  heading: Heading,
  inlineCode: InlineCode,
  code: CodeBlock,
  image: ({ alt, src }) => {
    if (alt === 'demo') {
      // Replace the demo gif with a live demo component
      return (
        <HoverVideoPlayer
          videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          pausedOverlay={
            <img
              src="image/big_buck_bunny_thumbnail.jpg"
              alt=""
              className={css`
                width: 100%;
                height: 100%;
              `}
            />
          }
          loadingOverlay={<LoadingSpinnerOverlay />}
          className={css`
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

            margin: 12px 0;
          `}
        />
      );
    }

    return <img alt={alt} src={src} />;
  },
};

function MarkdownContents() {
  // Fetch the README file's contents so we can display it
  const { data: markdown } = useFetch(
    '/README.md',
    {
      // We're going to use suspense so we can show a placeholder loading spinner
      // while the file is being fetched
      suspense: true,
    },
    []
  );

  return markdown ? (
    <>
      <NavigationLinkList markdown={markdown} />
      <div>
        <ReactMarkdown source={markdown} renderers={markdownRenderers} />
      </div>
    </>
  ) : null;
}

export default function Demo() {
  return (
    <main
      className={css`
        margin: 0 auto;
        max-width: 85%;

        ${breakpoints.medium} {
          max-width: 90%;
        }
      `}
    >
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 4fr 1fr;
          grid-column-gap: 48px;

          ${breakpoints.medium} {
            grid-template-columns: 1fr auto;
          }

          ${breakpoints.small} {
            display: block;
          }
        `}
      >
        <Provider>
          <Suspense
            fallback={
              <LoadingSpinnerOverlay
                className={css`
                  position: fixed;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                `}
                shouldShowDarkenedBackground={false}
              />
            }
          >
            <MarkdownContents />
          </Suspense>
        </Provider>
      </div>
    </main>
  );
}

const demoPageContainer = document.getElementById(
  'react-hover-video-player-demo'
);

if (demoPageContainer) {
  render(<Demo />, demoPageContainer);
}
