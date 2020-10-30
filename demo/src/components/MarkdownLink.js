import React, { useEffect, useRef } from 'react';

/**
 * Custom component renders links from the README markdown.
 * Adds a className to apply special styling to the link if it wraps an image
 *
 * @param {string} href
 */
export default function Link({ href, children }) {
  const linkRef = useRef();

  useEffect(() => {
    if (linkRef.current.querySelector('img')) {
      linkRef.current.className = 'image-link';
    }
  }, []);

  return (
    <a href={href} ref={linkRef}>
      {children}
    </a>
  );
}
