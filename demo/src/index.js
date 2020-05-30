import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';
import ReactMarkdown from 'react-markdown';
import useFetch, { Provider } from 'use-http';

import Heading from './components/MarkdownHeading';
import { InlineCode, CodeBlock } from './components/MarkdownCodeSnippet';
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

/**
 * Recursively adds headings to the navigation links list while respecting how they
 * should be nested based on their levels relative to each other
 */
function addHeadingToList(headingToAdd, headingList) {
  const lastHeading = headingList[headingList.length - 1];

  if (lastHeading && lastHeading.level < headingToAdd.level) {
    // If the last heading has a lower level, that means this heading should be nested
    // under it and therefore added to its list of subHeadings
    addHeadingToList(headingToAdd, lastHeading.subHeadings);
  } else {
    // If this heading shouldn't be nested under the last one, just add it to the end of the list
    headingList.push(headingToAdd);
  }
}

/**
 * Recursively renders links for the navigation link list in the sidebar
 *
 * @param {string} id - The heading id to link to
 * @param {number} level - The heading level of the heading we're linking to
 * @param {string} label - The label text to display for the link
 * @param {object[]} subHeadings - Headings nested under the current heading we're making a link to
 */
function NavigationLink({ id, level, label, subHeadings }) {
  return (
    <>
      <li
        className={css`
          font-size: ${22 - level * 2}px;
          font-weight: ${level <= 2 ? 'bold' : 'normal'};
          margin: ${level <= 2 ? 6 : 2}px 0 1px;
        `}
      >
        <a href={`#${id}`}>{label}</a>
      </li>
      {/* If this heading link has subheadings, recursively render links for them */}
      {subHeadings.length > 0 && (
        <ul
          className={css`
            padding-left: 24px;
          `}
        >
          {subHeadings.map(
            ({
              id: subHeadingID,
              label: subHeadingLabel,
              subHeadings: subHeadingsubHeadings,
            }) => (
              <NavigationLink
                key={subHeadingID}
                id={subHeadingID}
                label={subHeadingLabel}
                subHeadings={subHeadingsubHeadings}
              />
            )
          )}
        </ul>
      )}
    </>
  );
}

/**
 * Renders a list of links to all of the document's section headings
 *
 * @param {string}  markdown - The raw markdown text to extract the section headings from
 */
function NavigationLinkList({ markdown }) {
  const markdownHeadings = React.useMemo(() => {
    // Break down the markdown contents by line
    const markdownLines = markdown.split('\n');

    return markdownLines.reduce((headings, line) => {
      // Get the heading hash string for the line if it starts with 2 or more hashes
      const [headingHashes] = line.match(/^#{2,}/g) || [];

      // If this line has heading hashes, let's make a navigation link for it
      if (headingHashes) {
        // Determine the heading's level based on how many hashes it has (ie, ## -> level == 2)
        // We will use this to determine how the links should be nested
        const headingLevel = headingHashes.length;

        const [headingTextContents] = line.split(/# +/g, 2).slice(-1);

        const headingIdSlug = headingTextContents
          .toLowerCase()
          .replace(/\W/g, '-');

        addHeadingToList(
          {
            id: headingIdSlug,
            label: headingTextContents,
            level: headingLevel,
            subHeadings: [],
          },
          headings
        );
      }

      return headings;
    }, []);
  }, [markdown]);

  return (
    <aside
      className={css`
        position: sticky;
        top: 24px;
        margin-top: 132px;

        /* Necessary in order to make position: sticky work for a child of a grid */
        align-self: flex-start;

        ${breakpoints.small} {
          display: none;
        }
      `}
    >
      <h3
        className={css`
          padding: 0;
          margin-bottom: 4px;
        `}
      >
        Navigation
      </h3>
      <ol
        className={css`
          margin: 0;
          padding-left: 24px;
        `}
      >
        {markdownHeadings.map(({ id, level, label, subHeadings }) => {
          return (
            <NavigationLink
              key={id}
              id={id}
              level={level}
              label={label}
              subHeadings={subHeadings}
            />
          );
        })}
      </ol>
    </aside>
  );
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
