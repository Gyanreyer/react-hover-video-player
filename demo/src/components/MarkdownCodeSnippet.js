import React from 'react';
import { css } from 'emotion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Component for applying custom styling to inline code snippets from the README markdown
 * ex:
 * `this is an inline snippet`
 */
export function InlineCode({ children }) {
  return (
    <code
      className={css`
        padding: 1px 4px;
        color: #cccccc;
        background-color: #2d2d2d;
        border-radius: 4px;
      `}
    >
      {children}
    </code>
  );
}

/**
 * Component for rendering a code block from the README markdown with syntax highlighting
 * ex:
 *  ```lang
 *  this is a code block
 *  ```
 * @param {string} value - The code block contents to apply syntax highlighting to
 * @param {string} language - The language to apply syntax highlighting for, ie "jsx"
 */
export function CodeBlock({ value, language }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={tomorrow}
      customStyle={{
        borderRadius: 4,
      }}
    >
      {value}
    </SyntaxHighlighter>
  );
}
