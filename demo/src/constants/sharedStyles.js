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
    margin: 86px 0 92px;
    background-color: #30475e;
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
    margin: 0 0 8px;
    padding-top: 12px;

    ${breakpoints.medium} {
      font-size: 24px;
    }
  }

  h3 {
    font-size: 24px;
    margin: 0 0 8px;
    padding-top: 12px;

    ${breakpoints.medium} {
      font-size: 20px;
    }
  }

  p {
    font-size: 16px;
    margin: 0 0 8px;
  }

  a {
    color: #ececec;
    text-decoration: none;
  }

  .underlined-link {
    display: inline-block;
    position: relative;
    transition: opacity 0.1s;

    :after {
      content: '';
      position: absolute;
      bottom: -1px;
      right: 0;
      width: 0;
      height: 2px;
      background-color: #ececec;
      opacity: 0.8;
      transition: width 0.1s ease-in-out;
    }

    :hover, :focus {
      opacity: 0.9;

      :after {
        left: 0;
        right: auto;
        width: 100%;
      }
    }
  }

  code {
    font-family: monospace;
    font-size: 14px;
    color: #d4d4d4;
    background-color: #1E1E1E;
    padding: 10px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    display: inline-block;
  }

  em {
    color: #f2a365;
    font-style: normal;
  }

  figure {
    margin: 12px 0 24px;
  }

  figcaption {
    font-weight: normal;
    margin-bottom: 8px;
  }

  .required {
    color: #ff6961;
  }

  .required-message {
    color: #ff6961;
    font-size: 14px;
  }
`;
