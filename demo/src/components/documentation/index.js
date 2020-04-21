import React from 'react';
import { css } from 'emotion';

import Installation from './Installation';
import Setup from './Setup';
import { documentationHeading } from '../../constants/sharedStyles';

export default function DocumentationSection() {
  return (
    <section>
      <h2 className={documentationHeading}>Get Started</h2>
      <article
        className={css`
          margin-left: 12px;
        `}
      >
        <h3 className={documentationHeading}>Installation</h3>
        <Installation />
        <h3 className={documentationHeading}>Setup</h3>
        <Setup />
      </article>
    </section>
  );
}
