import { injectGlobal, css } from 'emotion';

export const breakpoints = {
  extraSmall: '@media only screen and (max-width: 375px)',
  small: '@media only screen and (max-width: 768px)',
  medium: '@media only screen and (max-width: 1200px)',
};

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

  body {
    font-family: 'Open Sans', sans-serif;
    margin: 86px 0;
    background-color: #30475e;
    color: #ececec;

    ${breakpoints.medium} {
      margin: 64px 0;
    }

    ${breakpoints.small} {
      margin: 32px 0;
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
    margin: 0 0 12px;

    ${breakpoints.medium} {
      font-size: 24px;
    }
  }

  h3 {
    font-size: 24px;
    margin: 0 0 8px;

    ${breakpoints.medium} {
      font-size: 20px;
    }
  }

  p {
    font-size: 16px;
    margin: 0 0 8px;
  }

  a {
    color: #f2a365;
    transition: color 100ms;

    :hover {
      color: #f6c385;
    }
  }

  code {
    font-family: 'Roboto Mono', monospace;
    font-size: 16px;
    background-color: #282936;
    padding: 10px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    display: inline-block;
  }
`;

export const documentationHeading = css`
  margin-top: 16px;
`;
