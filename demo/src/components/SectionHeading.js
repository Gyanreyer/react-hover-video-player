import React from 'react';
import { css, cx } from 'emotion';

import { LinkIcon } from './Icons';

export default function SectionHeading({
  isMajorSectionHeading = false,
  id,
  className,
  children,
}) {
  const Header = `h${isMajorSectionHeading ? 2 : 3}`;
  const iconWidth = isMajorSectionHeading ? 20 : 18;

  return (
    <Header id={id} className={className}>
      <a
        href={`#${id}`}
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
    </Header>
  );
}
