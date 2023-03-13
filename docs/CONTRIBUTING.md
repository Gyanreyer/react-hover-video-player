# Contributing

## How to contribute to an open source project

1. Click the "Fork" button on this library's [GitHub page](https://github.com/gyanreyer/react-hover-video-player) to make a copy of the repository in your account which you can work on.
2. Clone your forked repo to your computer.
3. Move into the root of this project's directory and run `npm install` to get all dependencies installed; this will also set up Husky commit hooks automatically.
4. Start coding! Check out the "I want to..." sections below for guidance on where to start.
5. Once you are confident that your work is done, push your changes up to your repository and click "Contribute" > "Open pull request". Fill out a description of your changes and then create the pull request. Please be detailed about the what and why of your changes if you can!
6. A maintainer will review your code and may give feedback on anything that should be changed. Once tests are passing and your changes are approved, they will be merged into the main repository and deployed in the next release.

Thank you so much for your contribution ❤️

## I want to update documentation

All documentation can be found in the `docs` directory.

The documentation site at <https://react-hover-video-player.dev> uses [VuePress](https://vuepress.vuejs.org/) to automatically construct a site with pages based on the `README.md` and `CONTRIBUTING.md` files' contents.

To preview the documentation site locally, run `npm run docs:dev` to serve it at <http://localhost:8080>.

## I want to fix a bug or add a feature

All component code can be found in the `src` directory.

The HoverVideoPlayer component is defined in the `src/HoverVideoPlayer.tsx` file, so it is recommended that you start there.

### Automated testing

This library uses [Playwright](https://playwright.dev/) for automated testing; all tests can be found in the `tests/` directory. Your changes will not be accepted unless all existing tests are passing. If you add new functionality, it is highly suggested that you add a test to cover it.

- `npm run test` will run all tests once
  - To run a specific test file, you can provide the test file's name as an arg, like `npm run test -- videoSrc.spec.ts`; this will only run tests in the `tests/specs/videoSrc/videoSrc.spec.ts` file
  - To only run a single test within a specific test file, change `test()` to `test.only()` for the desired test; all others will be skipped. Just make sure you revert that before committing!

### Development playground

Along with automated tests, you can also test your changes in a live demo playground environment located in the `dev` directory.

Running `npm run dev` will serve the contents of `dev/index.tsx` at <http://localhost:8080>.

For the most part, you will likely want to focus on editing the `TestComponent.tsx` file when testing your changes.
You may modify playground files however you want for testing purposes, but please refrain from committing your changes unless you have a strong case for why they should be!

## Other miscellaneous things

### Recommended process for creating an example gif for documentation

1. Make a new sandbox in CodeSandbox (for an easy head start, [fork this sandbox](https://codesandbox.io/s/hovervideoplayer-example-6y0fn)).
2. Once the example is set up, make a screen recording.
   - On Macs, QuickTime Player is a decent option for making quick screen recordings
   - Try to keep the recording short and loop-friendly if possible (ie, start and end with the mouse cursor off the screen)
3. Convert the recording to a .gif file

   - To guarantee the gif comes out with a good balance between file size and quality, it's recommended to use the following ffmpeg command for conversion:

   ```sh
   ffmpeg -i path/to/original-recording.mp4 -vf "fps=10,scale=1024:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output/demo.gif
   ```

   (special thanks to [llogan's very helpful answer](https://superuser.com/a/556031) which this command is based on)

4. Add the .gif file to the README
   - Put the .gif file in the `docs/assets/images` directory.
   - Add `![alt text](./assets/images/your_file_name.gif)]` to the appropriate place in the README.
   - If you feel comfortable, please wrap the gif with a link to your CodeSandbox!
