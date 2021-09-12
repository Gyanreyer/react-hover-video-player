# Contributing

## Developing locally

- `npm install`
- `npm run dev`
  - This will serve the contents of `dev/index.tsx` at <http://localhost:3000> with hot reloading.
    - You may edit the `TestComponent.tsx` file for all testing purposes.
      You may modify this file however you want for testing, but your changes
      should not be committed. If you think your changes should be committed,
      please contact the maintainer.

## Builds

This project uses automated builds with [CircleCI](https://app.circleci.com/pipelines/github/Gyanreyer/react-hover-video-player). When a change is merged into the main branch, CircleCI will run all tests and if they pass, it will build and deploy a new version of the `react-hover-video-player` package to npm using [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

If you wish to do a production build locally for testing purposes, `npm run build` will build the component for production.

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

## Documentation

Please add documentation for your changes! If you add a prop, make sure to add it to the README file accordingly.

The documentation site at <https://react-hover-video-player.dev> uses the [VuePress](https://vuepress.vuejs.org/) library to automatically construct a page based on the README file's contents.

To preview the documentation site locally, run `npm run docs:dev` to serve it at <http://localhost:8080>.

When committing changes to the README, make sure you use the appropriate commit type and scope. Semantic-release normally skips commits of type `docs`, but this can result
in the npm package page's README not getting updated to reflect any changes that have been made to it.

If the main purpose of your commit is to update the README, please use `docs(readme)` as your commit's type and scope; this indicates to semantic-release that the change
should be published to the npm package as a patched version.

## Tests

All tests can be found in the `tests/cypress/component` directory. These are 100% end-to-end tests written with [Cypress](https://github.com/cypress-io/cypress).

Tests can be run with the following commands:

- `npm run test` will run all tests once and check the tests' code coverage. **100% code coverage is required**. If you make a change, you must add a test accordingly.

- `npm run test-runner` will open a browser window with the Cypress test runner, providing a nice UI which makes it much easier to troubleshoot your tests and see exactly what they are doing.

- `npm run test:smoke` will perform a production build and then run all tests against the built code in a Chrome browser window. This can be used to catch potential problems introduced by the rollup config, but is otherwise slower to run and therefore not recommended for usage during regular development.

### Why all end-to-end tests?

This component's behavior is built heavily on the `HTMLVideoElement`.
In normal unit tests, most of `HTMLVideoElement`'s functionality is disabled and requires unbelievable amounts of mocking in order to get anything close to 100% test coverage. It became clear that taking that approach would result in the unit tests testing the mock implementation more than the component itself; end-to-end tests help us feel much more confident that everything works exactly as it would in the real world!
