import React from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';

import { breakpoints } from './constants/sharedStyles';
import { Heading } from './components/Heading';
import { AboutSection } from './components/AboutSection';
import DocumentationSection from './components/documentation';

const Demo = () => (
  <main
    className={css`
      margin: 0 auto;
      max-width: 80%;

      ${breakpoints.medium} {
        max-width: 85%;
      }
    `}
  >
    <Heading />
    <AboutSection />
    <DocumentationSection />
  </main>
);
export default Demo;

render(<Demo />, document.getElementById('react-hover-video-player-demo'));
