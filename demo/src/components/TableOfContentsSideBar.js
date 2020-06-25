import React from 'react';
import { css } from 'emotion';
import ReactMarkdown from 'react-markdown';

import { breakpoints } from '../constants/sharedStyles';

/**
 * Renders a list of links to all of the document's section headings
 *
 * @param {string}  markdown - The markdown text for the table of contents section
 */
export default function TableOfContentsSideBar({ markdown }) {
  return (
    <aside
      className={css`
        margin-top: 140px;

        ${breakpoints.small} {
          display: none;
        }

        h2 {
          font-size: 24px;
          margin: 0 0 8px;

          ${breakpoints.medium} {
            font-size: 20px;
          }
        }

        ol,
        ul {
          margin: 0;
          padding-left: 24px;
          line-height: 1.2;
          font-size: 18px;
        }

        ol > li {
          margin-top: 6px;
        }

        ul > li {
          margin-top: 2px;
        }

        li {
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 1px;

          * {
            vertical-align: text-top;
          }
        }
      `}
    >
      <ReactMarkdown source={markdown} />
    </aside>
  );
}
