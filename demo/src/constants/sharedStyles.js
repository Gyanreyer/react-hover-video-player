import { injectGlobal } from 'emotion';

export const breakpoints = {
  extraSmall: '@media only screen and (max-width: 375px)',
  small: '@media only screen and (max-width: 768px)',
  medium: '@media only screen and (max-width: 1200px)',
};

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');

  body {
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
    line-height: 1.4;
    margin: 86px 0 92px;
    background-color: #1c1c1c;
    color: #ececec;

    ${breakpoints.medium} {
      margin-top: 64px;
    }

    ${breakpoints.small} {
      margin-top: 32px;
    }
  }

  h1 {
    font-size: 64px;
    margin: 0 0 12px;

    ${breakpoints.medium} {
      font-size: 48px;
    }

    ${breakpoints.small} {
      font-size: 32px;
    }
  }

  h2 {
    font-size: 36px;
    margin: 24px 0 12px;

    ${breakpoints.medium} {
      font-size: 24px;
    }
  }

  h3 {
    font-size: 24px;
    margin: 12px 0 8px;

    ${breakpoints.medium} {
      font-size: 20px;
    }
  }

  p {
    margin: 0 0 8px;
  }

  pre {
    font-size: 14px;
  }

  a {
    color: #ececec;
    text-decoration: none;

    display: inline-block;
    position: relative;
    transition: opacity 0.1s;

    /* All links aside from those wrapping images should have an underline
        which is hidden and transitions in when hovered over */
    :not(.image-link):after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 0;
      height: 2px;
      background-color: #ececec;
      opacity: 0.8;
      transition: width 0.1s ease-in-out;
    }

    :hover, :focus {
      opacity: 0.9;
    }

    /* A link's underline should transition in when the user hovers or focuses on it */
    :hover, :focus,
    /* Links inside a paragraph should always have an underline */
    p > & {
      &:after {
        left: 0;
        right: auto !important;
        width: 100% !important;
      }
    }
  }

  ul {
    margin: 0;
    padding-left: 32px;
  }
`;
