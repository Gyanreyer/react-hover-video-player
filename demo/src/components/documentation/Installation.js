import React from 'react';
import { css } from 'emotion';
import * as clipboard from 'clipboard-polyfill';
import { CopyIcon, CopySuccessCheckIcon } from '../Icons';

export default function Installation() {
  const [isCopied, setIsCopied] = React.useState(false);

  function onClickCopyInstallationText() {
    clipboard.writeText('npm install react-hover-video-player');
    setIsCopied(true);
  }

  return (
    <code
      onClick={onClickCopyInstallationText}
      onKeyDown={(event) => {
        const key = event.key || event.keyCode;

        if (
          // Spacebar
          key === ' ' ||
          key === 'Spacebar' ||
          key === 32 ||
          // Enter key
          key === 'Enter' ||
          key === 13
        ) {
          onClickCopyInstallationText();
        }
      }}
      role="button"
      tabIndex="0"
      className={css`
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        transition: background-color 0.1s;

        .copied-icon {
          width: 20px;
          margin-left: 12px;
        }

        .copy-icon {
          width: 0px;
          margin-left: 0;
          opacity: 0;
          transition: width, margin-left, opacity;
          transition-duration: 0.1s;
        }

        &:hover,
        &:focus {
          background-color: #282e3f;

          .copy-icon {
            width: 20px;
            margin-left: 12px;
            opacity: 1;
          }
        }
      `}
    >
      npm install react-hover-video-player
      {isCopied ? <CopySuccessCheckIcon /> : <CopyIcon />}
    </code>
  );
}
