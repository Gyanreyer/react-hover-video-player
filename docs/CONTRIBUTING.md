# Contributing

## Developing locally

- `npm install`
- `npm run dev`
  - This will serve the contents of `dev/index.tsx` at <http://localhost:3000> with hot reloading.
    - You may edit the `TestComponent.tsx` file for all testing purposes.
      You may modify this file however you want for testing, but your changes
      should not be committed. If you think your changes should be committed,
      please contact the maintainer.

## Documentation

Please add documentation for your changes! If adding a prop, make sure to add it to the README file accordingly.

The documentation site at <https://react-hover-video-player.dev> uses the [VuePress](https://vuepress.vuejs.org/) library to automatically construct a page based on the README file's contents.

To preview the documentation site locally, run `npm run docs:dev` to serve it at <http://localhost:8080>.

## Tests

### Running tests

Tests are written using [jest](https://github.com/facebook/jest) and [react-testing-library](https://github.com/testing-library/react-testing-library).

- `npm run test` will run all tests once.

- `npm run test:watch` will continually re-run tests as you make changes.

- `npm run test:release` will perform a webpack build (`npm run build`) and then run all tests on the resulting release-ready version of the component for smoke testing purposes. Note that this is much slower and does not perform coverage testing, so you will almost always want to stick with `npm run test`.

- `npm run test:debug` will run the tests in a Node process that an external debugger can connect to (ie, <chrome://inspect>) so that you can use breakpoints and step through the code as needed. See Jest's [troubleshooting docs](https://jestjs.io/docs/troubleshooting) for more details.

 **100% code coverage for tests is required**. If you make a change, you must add a test accordingly.

#### Utils for writing tests

There are some handy utils available to help make writing tests easier:

##### renderHoverVideoPlayer

`renderHoverVideoPlayer` takes a configuration and renders a `HoverVideoPlayer` component for testing. This also injects mocked behavior into the rendered video element so we can emulate how a real video element loads and plays as closely as possible in our tests.

*Arguments*:

- `props` (Object): Accepts an object representing all props to pass to the component for the test
- `videoConfig` (Object): Accepts an object for customizing what behavior should be simulated for the video element. Valid properties for this object are:
  - `shouldPlaybackFail` (Boolean): Whether we should simulate an error occuring while attempting to play the video. This is false by default.

*Returns*:

An object with the following properties:

- `rerenderWithProps` (Function): Takes an object for new props to re-render the component with.
- `videoElement` (HTMLVideoElement): The video element rendered by the HoverVideoPlayer component.
- `playerContainer` (HTMLDivElement): The container div element rendered by the HoverVideoPlayerComponent.
- `pausedOverlayWrapper` (HTMLDivElement): The wrapper div element around the contents provided to the `pausedOverlay` prop. This should be null if no `pausedOverlay` was provided.
- `loadingOverlayWrapper` (HTMLDivElement): The wrapper div element around the contents provided to the `loadingOverlay` prop. This should be null if no `loadingOverlay` was provided.
- [All properties returned by react-testing-library's render function](https://testing-library.com/docs/react-testing-library/api#render-result)

##### advanceVideoTime

Syntactic sugar for `act(() => jest.advanceTimersByTime(time));`.

`advanceVideoTime` takes a number of milliseconds to advance Jest's [mock timers](https://jestjs.io/docs/jest-object#mock-timers) by, and uses `act()` to ensure any resulting updates to the React component's state will be handled safely.

*Arguments*:

- `time` (Number): Number of milliseconds to advance timers by.

## Builds

This project uses automated builds with [Travis CI](https://travis-ci.com/). When a change is merged into the main branch, Travis will run all unit tests and if they pass, it will build and deploy a new version of the `react-hover-video-player` package to npm using [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

If you wish to do a production build locally for testing purposes:

- `npm run build` will build the component and demo page for production.

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

To make things easy, you can write your commit messages using [Commitizen](https://github.com/commitizen/cz-cli), a CLI tool which will provide an interactive experience for walking you through writing your commit message. All you have to do is stage your changes and run `npm run commit` and it'll guide you from there.
