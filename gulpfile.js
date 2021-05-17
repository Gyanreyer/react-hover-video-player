// eslint-disable-next-line @typescript-eslint/no-var-requires
const gulp = require('gulp');

// Copies the README file into the docs/ directory so the documentation site can load and preview it locally
// Run with `npx gulp copy-docs-readme`
gulp.task('copy-docs-readme', () =>
  gulp.src('README.md').pipe(gulp.dest('docs/'))
);

// Watches the README file and copies it into the docs/ directory every time it is changed
// Run with `npx gulp watch-docs`
gulp.task('watch-docs', () => {
  gulp.watch(['README.md'], gulp.series('copy-docs-readme'));
});
