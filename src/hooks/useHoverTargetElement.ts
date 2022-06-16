import { useState, useEffect } from 'react';
import { HoverTarget } from '../HoverVideoPlayer.types';

const getElementFromHoverTarget = (hoverTarget: HoverTarget) => {
  // A `hoverTarget` value could be a function, a DOM element, or a React ref, so
  // figure out which one it is and get the hover target element out of it accordingly
  if (typeof hoverTarget === 'function') {
    return hoverTarget();
  } else if (hoverTarget instanceof Node) {
    return hoverTarget;
  } else if (hoverTarget && hoverTarget.hasOwnProperty('current')) {
    return hoverTarget.current;
  } else {
    console.error(
      'HoverVideoPlayer was unable to get a usable hover target element. Please check your usage of the `hoverTarget` prop.'
    );
  }
};

/**
 * Extracts a node to watch for hover events on from the `hoverTarget` prop.
 *
 * @param {HoverTarget} hoverTarget
 */
export default function useHoverTargetElement(
  hoverTarget: HoverTarget
): Node | null {
  const [hoverTargetElement, setHoverTargetElement] = useState<Node | null>(
    null
  );

  useEffect(() => {
    setHoverTargetElement(getElementFromHoverTarget(hoverTarget));
  }, [hoverTarget]);

  return hoverTargetElement;
}
