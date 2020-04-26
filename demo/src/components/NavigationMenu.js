import React from 'react';
import { css } from 'emotion';

import { breakpoints } from '../constants/sharedStyles';

const navigationSections = [
  {
    name: 'What it is',
    id: 'about',
  },
  {
    name: 'Features',
    id: 'features',
  },
  {
    name: 'Get Started',
    id: 'get-started',
    subSections: [
      {
        name: 'Installation',
        id: 'install',
      },
      {
        name: 'Basic Setup',
        id: 'setup',
      },
    ],
  },
  {
    name: 'Component API',
    id: 'component-api',
    subSections: [
      {
        name: 'videoSrc',
        id: 'videoSrc',
      },
      {
        name: 'pausedOverlay',
        id: 'pausedOverlay',
      },
    ],
  },
];

export default function NavigationMenu() {
  return (
    <aside
      className={css`
        position: sticky;
        top: 24px;
        /* Necessary to make position: sticky work for a grid child */
        align-self: flex-start;
        grid-row: 2 / 3;

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
        {navigationSections.map((mainSection) => (
          <li
            key={mainSection.id}
            className={css`
              margin: 0 0 4px;
              white-space: nowrap;

              a {
                font-size: 18px;
                font-weight: bold;
              }
            `}
          >
            <a href={`#${mainSection.id}`} className="underlined-link">
              {mainSection.name}
            </a>
            {mainSection.subSections && (
              <ul
                className={css`
                  margin: 0;
                  padding-left: 24px;
                `}
              >
                {mainSection.subSections.map((subSection) => (
                  <li
                    key={subSection.id}
                    className={css`
                      margin: 2px 0;
                      white-space: nowrap;

                      a {
                        font-size: 16px;
                        font-weight: normal;
                      }
                    `}
                  >
                    <a href={`#${subSection.id}`} className="underlined-link">
                      {subSection.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
