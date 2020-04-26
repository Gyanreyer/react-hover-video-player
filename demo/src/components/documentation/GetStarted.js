import React from 'react';
import { css } from 'emotion';

import CopyableCodeSnippet from '../CopyableCodeSnippet';

export default function GetStarted() {
  return (
    <>
      <h2
        id="get-started"
        className={css`
          margin-bottom: 0;
        `}
      >
        Get Started
      </h2>
      <section
        className={css`
          margin-left: 12px;
        `}
      >
        <h3 id="install">Installation</h3>
        <CopyableCodeSnippet copyText="npm install react-hover-video-player">
          npm install react-hover-video-player
        </CopyableCodeSnippet>
        <h3 id="setup">Basic Setup</h3>
        <CopyableCodeSnippet copyText="import HoverVideoPlayer from 'react-hover-video-player';">
          <span>
            <span style={{ color: '#569cd6' }}>import</span>{' '}
            <span style={{ color: '#9cdcfe' }}>HoverVideoPlayer</span>{' '}
            <span style={{ color: '#569cd6' }}>from</span> &#39;
            <span style={{ color: '#ce9178' }}>react-hover-video-player</span>
            &#39;;
          </span>
        </CopyableCodeSnippet>
        <br />
        <CopyableCodeSnippet
          copyText='<HoverVideoPlayer videoSrc="path-to/your-video.mp4" />'
          className={css`
            margin-top: 8px;
          `}
        >
          <span>
            {'<'}
            <span style={{ color: '#4ec9b0' }}>HoverVideoPlayer</span>{' '}
            <span style={{ color: '#9cdcfe' }}>videoSrc</span>=&#34;
            <span style={{ color: '#ce9178' }}>path-to/your-video.mp4</span>
            &#34; {'/>'}
          </span>
        </CopyableCodeSnippet>
      </section>
    </>
  );
}
