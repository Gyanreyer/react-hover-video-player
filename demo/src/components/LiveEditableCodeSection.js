import React from 'react';
import { css } from 'emotion';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import HoverVideoPlayer from '../../../src';
import LoadingSpinnerOverlay from './LoadingSpinnerOverlay';
import { codeEditorTheme } from '../constants/liveEditorConstants';
import { breakpoints } from '../constants/sharedStyles';

export default function LiveEditableCodeSection({ code }) {
  return (
    <div
      className={css`
        margin: 0 auto;
        border-radius: 4px;
        overflow: hidden;

        display: flex;

        ${breakpoints.medium} {
          margin: 12px 0 24px 0;
          max-width: 720px;

          flex-direction: column-reverse;
        }
      `}
    >
      <LiveProvider
        scope={{
          css,
          HoverVideoPlayer,
          LoadingSpinnerOverlay,
        }}
        code={code}
      >
        <div
          className={css`
            background-color: #1e1e1e;
            flex: 1;
          `}
        >
          <LiveEditor theme={codeEditorTheme} />
        </div>
        <div
          className={css`
            flex: 1;

            ${breakpoints.medium} {
              grid-row-start: 1;
              max-width: unset;
            }
          `}
        >
          <LiveError />
          <LivePreview />
        </div>
      </LiveProvider>
    </div>
  );
}
