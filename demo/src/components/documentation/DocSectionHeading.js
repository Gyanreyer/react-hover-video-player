import React from 'react';
import { css, cx } from 'emotion';

import { LinkIcon } from '../Icons';

export default function DocSectionHeading({ id, isRequired, children }) {
  return (
    <h3 id={id}>
      <a
        href={`#${id}`}
        className={cx(
          'underlined-link',
          css`
            .link-icon {
              padding-left: 8px;
              opacity: 0;
              transition: opacity, right;
              transition-duration: 0.1s;
            }

            :hover,
            :focus {
              .link-icon {
                opacity: 1;
                right: -32px;
              }
            }
          `
        )}
      >
        {children}
        {isRequired && <span className="required">*</span>}
        <LinkIcon
          className={cx(
            'link-icon',
            css`
              position: absolute;
              right: -28px;
              top: 50%;
              transform: translateY(-50%);
            `
          )}
        />
      </a>
    </h3>
  );
}
