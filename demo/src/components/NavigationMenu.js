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
];

export default function NavigationMenu() {
  const [propSections, setPropSections] = React.useState(null);

  React.useEffect(() => {
    const propSectionElements = Array.from(
      document.querySelectorAll('.component-api-prop-section')
    );

    setPropSections(
      propSectionElements.map(({ id }) => ({
        name: id,
        id,
      }))
    );
  }, []);

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
        {[
          ...navigationSections,
          {
            name: 'Component API',
            id: 'component-api',
            subSections: propSections,
          },
        ].map((mainSection) => (
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
            <a href={`#${mainSection.id}`}>{mainSection.name}</a>
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
                    <a href={`#${subSection.id}`}>{subSection.name}</a>
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
