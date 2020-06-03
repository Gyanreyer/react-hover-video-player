import React from 'react';
import { css } from 'emotion';

import { breakpoints } from '../constants/sharedStyles';

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
export default function NavigationLinkList({ markdown }) {
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
          line-height: 1.2;
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
