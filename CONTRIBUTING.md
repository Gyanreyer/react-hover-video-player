# Contributing

## Developing locally

- `npm install`
- `npm start`
  - This will serve the contents of `demo/src/DevPlayground.js` on a development server at [http://localhost:3000](http://localhost:3000) with hot module reloading.
    - You may edit the `DevPlayground.js` file however you like to test your changes, but please refrain from committing any changes to this file.
- `npm start:demo`
  - This will serve the demo documentation site contents which will be published to [react-hover-video-player.com](https://react-hover-video-player.com). The site contents are almost entirely derived from the README file so there typically should not be any need to make changes to this stuff yourself.

## Tests

### Running tests

Tests are written using [jest](https://github.com/facebook/jest) and [react-testing-library](https://github.com/testing-library/react-testing-library).

- `npm run test` will run all tests once

- `npm run test:watch` will continually re-run tests as you make changes.

 **100% code coverage for tests is required**. If you make a change, you must add a test accordingly.

There are some handy utils available to help make writing tests easier:

- `renderHoverVideoPlayer`: takes a configuration and renders a `HoverVideoPlayer` component for testing

  **Arguments**:

  - `props` (Object): Accepts an object representing all props to pass to the component for the test
  - `videoConfig` (Object): Accepts an object for customizing what behavior should be simulated for the video element. Valid properties for this object are:
    - `shouldPlaybackFail` (Boolean): Whether we should simulate an error occuring while attempting to play the video. This is false by default.
    - `shouldPlayReturnPromise` (Boolean): Whether video.play() should return a Promise or not. This is true by default but setting it to false can be useful for simulating the behavior of older browsers where the play function does not return a Promise.

  **Returns**:

  An object with the following properties:
  - `rerenderWithProps` (Function): Takes an object for new props to re-render the component with.
  - [All properties returned by react-testing-library's render function](https://testing-library.com/docs/react-testing-library/api#render-result)

- `getPlayPromise`: Gets the play promise returned by a given call to video.play(). The main use case for this is that you will often need to simulate the promise resolving before the player's state will update. This typically looks like:

  ```javascript
  await act(() => getPlayPromise(videoElement, 0));
  ```

  You will almost always need to use `act` since resolving the promise will asynchronously perform an operation that will update the component's state.

  **Arguments**:

  - `videoElement` (Node): The video element whose play promise we want to retrieve.
  - `playCallIndex` (Number): The index of the play call you would like to retrieve. This is useful if video.play() is called multiple times in your test.

  **Returns**:

  The `Promise` returned by the given call to video.play().

- `mockConsoleError`: Mocks console.error for a group of tests and ensures that errors were only logged when they were expected to be.

  **Arguments**

  - `shouldExpectErrors` (Boolean): Whether we should expect any errors to be logged in the tests.

## Builds

This project uses automated builds with [Travis CI](https://travis-ci.com/). When a change is merged into the master branch, Travis will run all unit tests and if they pass, it will build and deploy a new version of the `react-hover-video-player` package to npm using [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

If you wish to do a production build locally for testing purposes:

- `npm run build` will build the component and demo page for production.

- `npm run clean` will delete all built resources.

## Commits

In order to work best with semantic-release, commit messages must follow the [Angular commit guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines):

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

This formatting is enforced using [Husky](https://github.com/typicode/husky) and [Commitlint](https://github.com/conventional-changelog/commitlint).

To make things easy, you can write your commit messages using [Commitizen](https://github.com/commitizen/cz-cli), a CLI tool which will provide an interactive experience for walking you through writing your commit message. All you have to do is stage your changes and run `npm run commit` and it'll guide you from there. There is also a git commit hook set up through Husky which will run Commitizen if you would prefer to type `git commit` instead.
