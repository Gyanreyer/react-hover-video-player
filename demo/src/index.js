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
    <div
      className={css`
        display: flex;
      `}
    >
      <div
        className={css`
          max-width: 720px;

          ${breakpoints.medium} {
            max-width: 480px;
          }
        `}
      >
        <AboutSection />
        <DocumentationSection />
      </div>
      <aside
        className={css`
          margin-left: 72px;
          position: sticky;
          top: 24px;
          /* Necessary to make position: sticky work for a flex child */
          align-self: flex-start;

          ${breakpoints.small} {
            display: none;
          }

          ${breakpoints.medium} {
            margin-left: 48px;
          }
        `}
      >
        <h3>Navigation</h3>
        <ol
          className={css`
            margin: 0;
            padding-left: 24px;

            > li {
              font-size: 18px;
              font-weight: bold;
              margin: 0 0 4px;
            }
          `}
        >
          <li>
            <a href="#about" className="underlined-link">
              What it is
            </a>
          </li>
          <li>
            <a href="#features" className="underlined-link">
              Features
            </a>
          </li>
          <li>
            <a href="#component-api" className="underlined-link">
              Component API
            </a>
            <ul
              className={css`
                margin: 0;
                padding-left: 24px;

                > li {
                  font-size: 16px;
                  font-weight: normal;
                  margin: 2px 0;
                }
              `}
            >
              <li>
                <a href="#videoSrc" className="underlined-link">
                  videoSrc
                </a>
              </li>
              <li>
                <a href="#pausedOverlay" className="underlined-link">
                  pausedOverlay
                </a>
              </li>
            </ul>
          </li>
        </ol>
      </aside>
    </div>
  </main>
);
export default Demo;

render(<Demo />, document.getElementById('react-hover-video-player-demo'));
