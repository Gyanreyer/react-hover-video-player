import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';
import ReactMarkdown from 'react-markdown';
import useFetch, { Provider } from 'use-http';

import Heading from './components/MarkdownHeading';
import { InlineCode, CodeBlock } from './components/MarkdownCodeSnippet';
import Link from './components/MarkdownLink';
import TableOfContentsSideBar from './components/TableOfContentsSideBar';
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
  link: Link,
};

/**
 * Extracts the "Table of Contents" section from the README markdown
 * so it can be rendered separately in the sidebar
 *
 * @param {string} rawMarkdown
 */
function extractTableOfContentsFromMarkdown(rawMarkdown) {
  // Convert markdown to lower-case so we can safely make comparisons without worrying about casing
  const lowerCaseRawMarkdown = rawMarkdown.toLowerCase();

  const tableOfContentsStartIndex = lowerCaseRawMarkdown.indexOf(
    '## table of contents'
  );
  const tableOfContentsEndIndex = lowerCaseRawMarkdown.indexOf('## what it is');

  return {
    tableOfContentsMarkdown: rawMarkdown.substr(
      tableOfContentsStartIndex,
      tableOfContentsEndIndex - tableOfContentsStartIndex
    ),
    mainContentMarkdown:
      rawMarkdown.substr(0, tableOfContentsStartIndex) +
      rawMarkdown.substr(tableOfContentsEndIndex),
  };
}

function MarkdownContents() {
  // Fetch the README file's contents so we can display it
  const { data: rawMarkdown } = useFetch(
    '/README.md',
    {
      // We're going to use suspense so we can show a placeholder loading spinner
      // while the file is being fetched
      suspense: true,
    },
    []
  );

  React.useEffect(() => {
    // When the markdown has been loaded, if the url has a hash in it make sure we scroll
    // the corresponding section into view
    if (rawMarkdown && window.location.hash) {
      const scrollTargetElement = document.querySelector(window.location.hash);

      if (scrollTargetElement) scrollTargetElement.scrollIntoView();
    }
  }, [rawMarkdown]);

  if (rawMarkdown) {
    const {
      tableOfContentsMarkdown,
      mainContentMarkdown,
    } = extractTableOfContentsFromMarkdown(rawMarkdown);

    return (
      <>
        <TableOfContentsSideBar markdown={tableOfContentsMarkdown} />
        <div>
          <ReactMarkdown
            source={mainContentMarkdown}
            renderers={markdownRenderers}
          />
        </div>
      </>
    );
  }

  return null;
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
