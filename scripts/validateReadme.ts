import fs from 'fs';
import path from 'path';

const readmeFilePath = path.resolve(__dirname, '../docs/README.md');

// Script reads the README's contents and ensures all of its internal links point to valid sections
// (ie, a [...](#heading-text) link should match a heading that says "Heading Text")
fs.readFile(readmeFilePath, 'utf8', (err, data) => {
  if (err) throw err;

  // Convert to lowercase so we can account for the fact that markdown section heading ids
  // get transformed to all lower case (ie, "# This is a Heading" -> "this-is-a-heading")
  const lowerCaseFileContents = data.toLowerCase();

  // Regex matches all markdown links to page sections; ie, [link text](#section)
  const regexMdLinks = /\[.+?\]\(#.+?\)/gm;

  const markdownInternalLinks = data.match(regexMdLinks);
  if (!markdownInternalLinks) {
    throw new Error('No internal links found in README.');
  }

  // Regex to use on each individual match found from the first regex pattern
  // This will split the string into capturing groups so we can just easily get the
  // string that is supposed to target an existing section heading
  const singleLinkRegex = /\[(?<text>.+?)\]\(#(?<targetSectionHeading>.+?)\)/;

  for (
    let i = 0, numInternalLinks = markdownInternalLinks.length;
    i < numInternalLinks;
    i += 1
  ) {
    const targetSectionHeading = markdownInternalLinks[i].match(singleLinkRegex)
      ?.groups?.targetSectionHeading;

    if (!targetSectionHeading) {
      throw new Error(
        `Could not parse link target from ${markdownInternalLinks[i]}`
      );
    }

    // Convert any dashes from the link to spaces so we can match against the
    // actual section heading
    const formattedTargetHeading = targetSectionHeading.replace(/-/g, ' ');

    if (!lowerCaseFileContents.includes(`# ${formattedTargetHeading}`)) {
      // If we can't find a matching section heading, throw an error!
      throw new Error(
        `README file contains link to #${targetSectionHeading}, but no section with that heading exists.`
      );
    }
  }

  console.log('README file is valid!');
});
