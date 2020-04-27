import React from 'react';
import { css } from 'emotion';

import SectionHeading from '../SectionHeading';
import CopyableCodeSnippet from '../CopyableCodeSnippet';
// Component API sections
import VideoSrc from './VideoSrc';
import PausedOverlay from './PausedOverlay';
import LoadingOverlay from './LoadingOverlay';
import ShouldRestartOnVideoStopped from './ShouldRestartOnVideoStopped';
import OverlayFadeTransitionDuration from './OverlayFadeTransitionDuration';
import LoadingStateTimeoutDuration from './LoadingStateTimeoutDuration';

export default function DocumentationSection() {
  return (
    <>
      <SectionHeading
        id="get-started"
        isMajorSectionHeading
        className={css`
          margin: 0;
        `}
      >
        Get Started
      </SectionHeading>
      <section
        className={css`
          margin: 0 0 24px 12px;
        `}
      >
        <SectionHeading id="install">Installation</SectionHeading>
        <CopyableCodeSnippet copyText="npm install react-hover-video-player">
          npm install react-hover-video-player
        </CopyableCodeSnippet>
        <SectionHeading id="setup">Basic Setup</SectionHeading>
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
      <SectionHeading
        id="component-api"
        isMajorSectionHeading
        className={css`
          margin: 0;
        `}
      >
        Component API
      </SectionHeading>
      <section
        className={css`
          margin-left: 10px;

          p,
          figure {
            margin-left: 8px;
          }

          h3 {
            margin: 20px 0 8px;

            :first-of-type {
              margin-top: 0;
            }
          }
        `}
      >
        <VideoSrc />
        <PausedOverlay />
        <LoadingOverlay />
        <ShouldRestartOnVideoStopped />
        <OverlayFadeTransitionDuration />
        <LoadingStateTimeoutDuration />
        {/* REMAINING PROPS TO COVER:
            - videoCaptions
            - isFocused
            - Video props
              - muted
              - loop
            - Styling props
              - sizingMode
              - style
              - className
              - pausedOverlayWrapperClassName
              - pausedOverlayWrapperStyle
              - loadingOverlayWrapperClassName
              - loadingOverlayWrapperStyle
              - videoClassName
              - videoStyle
        */}
      </section>
    </>
  );
}
