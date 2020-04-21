import React from 'react';
import { css } from 'emotion';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import HoverVideoPlayer from '../../../src';
import LoadingSpinnerOverlay from './LoadingSpinnerOverlay';
import { codeEditorTheme } from '../constants/liveEditorConstants';

export default function LiveEditableCodeSection({ code }) {
  return (
    <div
      className={css`
        border-radius: 4px;
        overflow: hidden;

        display: flex;
        flex-direction: column;
        max-width: 640px;
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
        <div>
          <LiveError />
          <LivePreview />
        </div>
        <div>
          <LiveEditor theme={codeEditorTheme} />
        </div>
      </LiveProvider>
    </div>
  );
}
