import fs from 'fs';
import path from 'path';

const docsReadmeFilePath = path.resolve(__dirname, '../docs/README.md');
const rootReadmeFilePath = path.resolve(__dirname, '../README.md');

// Script copies the README file from /docs into the root directory so it can be displayed correctly
// on the npm package page.
// This should be run in the `prepack` script which is run before the npm package is published
fs.readFile(docsReadmeFilePath, 'utf8', (err, data) => {
  if (err) throw err;

  // Since this README file will be in the root rather than the /docs directory,
  // modify any relative file paths starting with "./" so they start with "/docs/" instead
  const rootReadmeFileContents = data.replace(/(\.\/)/g, '/docs/');

  // Write our modified file contents to a new README file in the root directory
  fs.writeFile(rootReadmeFilePath, rootReadmeFileContents, (err) => {
    if (err) throw err;

    console.log('README.md succcessfully copied to the root directory.');
  });
});
