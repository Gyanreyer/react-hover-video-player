import React from 'react';
import { css, cx } from 'emotion';

import { LinkIcon } from './Icons';

/**
 * Custom component renders headings from the README markdown with github-flavored ids
 * applied which can be easily linked to
 *
 * @param {number} level - The heading level, ie "#" -> level == 1, "###" -> level == 3
 * @param {string|ReactNode|ReactNodeArray} children - The text contents of the heading
 */
export default function Heading({ level, children }) {
  const HeadingElement = `h${level}`;

  if (level === 1) {
    // If this is the top-level heading of the page, we don't really want to do much with it so just render it
    return <HeadingElement>{children}</HeadingElement>;
  }

  // Reducer flattens the heading's children into a usable string
  function flattenChildren(text, child) {
    return typeof child === 'string'
      ? text + child
      : React.Children.toArray(child.props.children).reduce(
          flattenChildren,
          text
        );
  }
  const textContents = children.reduce(flattenChildren, '');

  // We derive our heading ids by converting the text contents to lowercase
  // and replacing all spaces with "-"
  const idSlug = textContents.toLowerCase().replace(/\W/g, '-');

  // Higher level (smaller) headings should be indented further to create a nice visual hierarchy
  const indentationMargin = Math.max(level - 2, 0) * 6;

  // The link icon that appears on hover should scale down based on the heading's size
  const iconWidth = 22 - level * 2;

  return (
    <HeadingElement
      id={idSlug}
      className={cx(
        'header',
        css`
          margin-left: ${indentationMargin}px;

          & ~ *:not(.header) {
            /* All contents between this heading and the next one should be indented 6px further
                than this heading is */
            margin-left: ${indentationMargin + 6}px;
          }

          & ~ pre {
            /* Code blocks can match the indentation of the heading. Have to set !important because
               react-syntax-highlighter is very aggressive in how it applies styles */
            margin-left: ${indentationMargin}px !important;
          }
        `
      )}
    >
      <a
        href={`#${idSlug}`}
        className={css`
          .link-icon {
            width: ${iconWidth}px;
            right: ${-iconWidth - 10}px;
            opacity: 0;
            transition: opacity, right;
            transition-duration: 0.1s;
          }

          :hover,
          :focus {
            .link-icon {
              opacity: 1;
              right: ${-iconWidth - 12}px;
            }
          }
        `}
      >
        {children}
        <LinkIcon
          className={cx(
            'link-icon',
            css`
              position: absolute;
              top: 50%;
              padding-left: 8px;
              transform: translateY(-50%);
              height: auto;
            `
          )}
        />
      </a>
    </HeadingElement>
  );
}
