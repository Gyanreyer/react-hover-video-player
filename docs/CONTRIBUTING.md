# Contributing

## How to make a contribution

1. Click the "Fork" button on this library's [GitHub page](https://github.com/gyanreyer/react-hover-video-player) to make a copy of the repository in your account which you can work on.
2. Clone your forked repo to your computer.
3. Move into the root of this project's directory and run `npm install` to get all dependencies installed; this will also set up Husky commit hooks automatically.
4. Start coding! Check out the "I want to..." sections below for guidance on where to start.
5. Once you are confident that your work is done, push your changes up to your repository and click "Contribute" > "Open pull request". Fill out a description of your changes and then create the pull request.
6. A maintainer will review your code and may give feedback on anything that should be changed. Once tests are passing and your changes are approved, they will be merged into the main repository and automatically deployed via CircleCI using [semantic-release](https://github.com/semantic-release/semantic-release).

Thank you so much for your contribution ❤️

## Commit messages

This library strictly enforces following the [Angular commit guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) for commit messages.

To make things as easy as possible, it is recommended that you run
`npm run commit` to commit staged changes; this will open [Commitizen](https://github.com/commitizen/cz-cli), a CLI tool which
will walk you through writing your commit message and handle all of the formatting for you.

However, if you prefer to manually write the commit message yourself, it should follow the following structure:

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Accepted commit types

This library uses [semantic-release](https://github.com/semantic-release/semantic-release) to determine how the package version should be incremented based on your commit message's `type`.

| Type     | Description                                                                                            | Package Version Increment                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| feat     | A new feature                                                                                          | Minor version (+0.1.0)                                                                                  |
| fix      | A bug fix                                                                                              | Patch version (+0.0.1)                                                                                  |
| refactor | A code change that neither fixes a bug nor adds a feature                                              | Minor version (+0.1.0)                                                                                  |
| perf     | A code change that improves performance                                                                | Minor version (+0.1.0)                                                                                  |
| docs     | Documentation only changes                                                                             | No change unless the commit scope is `"readme"`, in which case it will publish a patch version (+0.0.1) |
| style    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) | No change                                                                                               |
| test     | Adding missing or correcting existing tests                                                            | No change                                                                                               |
| chore    | Changes to the build process or auxiliary tools and libraries such as documentation generation         | No change                                                                                               |

### Breaking changes

If your commit contains breaking changes from the current package version (ie, removes a prop, significantly changes how a feature works, etc), the commit message needs to be marked as such. To do so, add `"BREAKING CHANGE: [description of breaking change]"` to the footer of your commit message.
This will result in the package being incremented by a major version (+1.0.0).

## I want to update documentation

All documentation can be found in the `src` directory.

The documentation site at <https://react-hover-video-player.dev> uses the [VuePress](https://vuepress.vuejs.org/) library to automatically construct a site with pages based on the `README.md` and `CONTRIBUTING.md` files' contents.

To preview the documentation site locally, run `npm run docs:dev` to serve it at <http://localhost:8080>.

When committing changes to the README, make sure you use the appropriate commit type and scope. Semantic-release normally skips commits of type `docs`, but this can result
in the npm package page's README not getting updated to reflect any changes that have been made to it.

If the main purpose of your commit is to update the README, please use `"docs"` as your commit's type and `"readme"` as the scope; this indicates to semantic-release that the change
should be published to the npm package as a patched version.

## I want to fix a bug or add a feature

All component code can be found in the `src` directory.

The HoverVideoPlayer component is defined in the `src/component/HoverVideoPlayer.tsx` file, so it is recommended that you start there.

### Automated testing

This library uses [Cypress component tests](https://docs.cypress.io/guides/component-testing/introduction) for automated testing; all test files can be found in the `tests/cypress/component` directory.

`npm run test` will run all tests once and check the tests' code coverage. **100% code coverage is required**. If you make a change, you must add a test accordingly.

`npm run test-runner` will open the Cypress test runner; this will provide a nice interface which helps with debugging and will automatically re-run tests as you make changes.

`npm run test:smoke` will perform a production build and then run all tests against the built code in a Chrome browser window. This can be used to catch potential problems introduced by the rollup config, but is otherwise slower to run and therefore not recommended for usage during regular development.

### Development playground

Along with automated tests, you can also test your changes in a live demo playground environment located in the `dev` directory.

Running `npm run dev` will serve the contents of `dev/index.tsx` at <http://localhost:3000> with hot reloading.

For the most part, you will likely want to focus on editing the `TestComponent.tsx` file when testing your changes.
You may modify playground files however you want for testing purposes, but your changes should not be committed.
That being said, if you think your changes really should be committed, you are welcome to make a case for it!
