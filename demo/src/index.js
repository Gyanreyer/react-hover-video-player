import React from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';

import { breakpoints } from './constants/sharedStyles';
import { Heading } from './components/Heading';
import { AboutSection } from './components/AboutSection';
import DocumentationSection from './components/documentation';
import NavigationMenu from './components/NavigationMenu';

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
        <Heading />
        <NavigationMenu />
        <div
          className={css`
            grid-row: 2 / 3;
          `}
        >
          <AboutSection />
          <DocumentationSection />
        </div>
        <div />
      </div>
    </main>
  );
}

render(<Demo />, document.getElementById('react-hover-video-player-demo'));
