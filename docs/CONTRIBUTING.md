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

Please add documentation for your changes! If you add a prop, make sure to add it to the README file accordingly.

The documentation site at <https://react-hover-video-player.dev> uses the [VuePress](https://vuepress.vuejs.org/) library to automatically construct a page based on the README file's contents.

To preview the documentation site locally, run `npm run docs:dev` to serve it at <http://localhost:8080>.

## Tests

All tests can be found in the `tests/cypress/component` directory. These are 100% end-to-end tests written with [Cypress](https://github.com/cypress-io/cypress).

Tests can be run with the following commands:

- `npm run test` will run all tests once.

- `npm run test-runner` will open a browser window with the Cypress test runner, providing a nice UI which makes it much easier to troubleshoot your tests and see exactly what they are doing.

 **100% code coverage for tests is required**. If you make a change, you must add a test accordingly.

### Why all end-to-end tests?

This component's behavior is built heavily on browsers' implementations of the `HTMLVideoElement`.
In normal unit tests, this implementation is disabled and requires unbelievable amounts of mocking in order to get anything close to 100% test coverage,
and at that point you are likely testing your own mock implementation more than the component itself.

## Builds

This project uses automated builds with [Travis CI](https://travis-ci.com/). When a change is merged into the main branch, Travis will run all tests and if they pass, it will build and deploy a new version of the `react-hover-video-player` package to npm using [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

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

### Updating the README

Semantic-release normally skips commits of type `docs`, but this can result in the npm package page's README not getting updated to reflect the changes.
If your commit is only updating the README, please use `docs(readme)` as your commit's type and scope; this indicates to semantic-release that the change
should be published to the npm package as a patched version.
