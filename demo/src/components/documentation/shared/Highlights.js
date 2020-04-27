import React from 'react';
import { css } from 'emotion';

export function Type({ children }) {
  return (
    <span
      className={css`
        color: #77dd77;
      `}
    >
      {children}
    </span>
  );
}

export function Value({ children }) {
  return (
    <span
      className={css`
        color: #fdfd96;
      `}
    >
      {children}
    </span>
  );
}

export function Required({ children }) {
  return (
    <span
      className={css`
        color: #ff6961;
        font-weight: bold;
      `}
    >
      {children}
    </span>
  );
}
