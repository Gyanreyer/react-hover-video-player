/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const replace = require('gulp-replace');

// Copies the README file from /docs into the root directory so it can be displayed correctly
// on the npm package page.
// This should be run in the `prepack` script which is run before the npm package is published
gulp.task('default', () =>
  gulp
    .src('../docs/README.md')
    .pipe(
      // Since this README file will be in the root rather than the /docs directory,
      // modify any relative file paths starting with "./" so they start with "/docs/" instead
      replace('./', '/docs/')
    )
    .pipe(gulp.dest('../'))
);
