/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const through = require('through2');

// Copies the README file into the docs/ directory so the documentation site can load and preview it locally
// Run with `npx gulp copy-docs-readme`
gulp.task('copy-docs-readme', () =>
  gulp.src('README.md').pipe(gulp.dest('docs/'))
);

// Watches the README file and copies it into the docs/ directory every time it is changed
// Run with `npx gulp watch-docs`
gulp.task('watch-docs', () => {
  const copyDocsReadmeTask = gulp.series('copy-docs-readme');
  // Run the task once initially
  copyDocsReadmeTask();
  // Re-run the task every time the README.md file changes
  gulp.watch('README.md', copyDocsReadmeTask);
});

// Gulp task checks that the README file does not contain any incorrect/stale links
// to sections that don't exist
// This has unfurtunately been a big enough problem that it merits writing this script
gulp.task('validate-readme-links', () =>
  gulp.src('README.md').pipe(
    through.obj(function (file, encoding, callback) {
      if (file.isNull()) {
        this.emit('error', new Error('README file does not exist.'));
        return;
      }

      // Get the README contents as a raw string
      const fileContentsString = file.contents.toString();
      // Convert to lowercase so we can account for the fact that markdown section heading ids
      // get transformed to all lower case (ie, "# This is a Heading" -> "this-is-a-heading")
      const lowerCaseFileContents = fileContentsString.toLowerCase();

      // Regex matches all markdown links to page sections; ie, [link text](#section)
      const regexMdLinks = /\[.+?\]\(#.+?\)/gm;

      const markdownInternalLinks = fileContentsString.match(regexMdLinks);

      // Regex to use on each individual match found from the first regex pattern
      // This will split the string into capturing groups so we can just easily get the
      // string that is supposed to target an existing section heading
      const singleLinkRegex = /\[(?<text>.+?)\]\(#(?<targetSectionHeading>.+?)\)/;

      for (let i = 0; i < markdownInternalLinks.length; i += 1) {
        const { targetSectionHeading } = markdownInternalLinks[i].match(
          singleLinkRegex
        ).groups;

        // Convert any dashes from the link to spaces so we can match against the
        // actual section heading
        const formattedTargetHeading = targetSectionHeading.replace(/-/g, ' ');

        if (!lowerCaseFileContents.includes(`# ${formattedTargetHeading}`)) {
          // If we can't find a matching section heading, throw an error!
          this.emit(
            'error',
            new Error(
              `README file contains link to #${targetSectionHeading}, but no section with that heading exists.`
            )
          );
          return;
        }
      }

      callback(null, file);
    })
  )
);
