import React from 'react';
import { css, cx } from 'emotion';

import ComponentAPI from './ComponentAPI';
import GetStarted from './GetStarted';

export default function DocumentationSection() {
  return (
    <>
      <GetStarted />
      <ComponentAPI />
    </>
  );
}
