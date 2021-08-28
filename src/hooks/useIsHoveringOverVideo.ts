import { useEffect, useRef, useState } from 'react';

import { HoverTarget } from '../HoverVideoPlayer.types';

/**
 * Hook adds event listeners to the hover target and returns whether the user is currently hovering over it or not.
 *
 * @param {HoverTarget} hoverTarget - Ref, function, or Node for the element that we should apply our hover event listeners to.
 *                                      If the user did not specify one with the hoverTarget prop, we will fall back to use
 *                                      the hover player's container div element.
 * @param {bool} disableDefaultEventHandling - Whether our default event handling should be disabled.
 * @param {func} onHoverStart - Callback fired when the user starts hovering on the player's hover target
 * @param {func} onHoverEnd - Callback fired when the user stops hovering on the player's hover target
 *
 * @returns {bool}  Whether the user is currently hovering over the player's hover target
 */
export default function useIsHoveringOverVideo(
  hoverTarget: HoverTarget,
  disableDefaultEventHandling: boolean,
  onHoverStartCallback: () => void,
  onHoverEndCallback: () => void
): boolean {
  // Keep track of whether the user is hovering over the video and it should therefore be playing or not
  const [isHoveringOverVideo, setIsHoveringOverVideo] = useState(false);
  const previousIsHoveringOverVideoRef = useRef(isHoveringOverVideo);

  useEffect(() => {
    // If default event handling is disabled, we shouldn't check for touch events outside of the player
    if (disableDefaultEventHandling) return undefined;

    // Get the element that we should add our hover event listeners to
    let hoverEventTargetElement: Node;

    // If the `hoverTarget` prop was provided, it could be a function, a DOM element, or a React ref, so
    // figure out which one it is and get the hover target element out of it accordingly
    if (typeof hoverTarget === 'function') {
      hoverEventTargetElement = hoverTarget();
    } else if (hoverTarget instanceof Node) {
      hoverEventTargetElement = hoverTarget;
    } else if (hoverTarget.current) {
      hoverEventTargetElement = hoverTarget.current;
    }

    // If we weren't able to get a valid hover target to attach event listeners to, return early
    if (!hoverEventTargetElement || !hoverEventTargetElement.addEventListener) {
      console.error(
        'HoverVideoPlayer was unable to add event listeners to a hover target. Please check your usage of the `hoverTarget` prop.'
      );
      return undefined;
    }

    // Add the event listeners
    const onHoverStart = () => setIsHoveringOverVideo(true);
    const onHoverEnd = () => setIsHoveringOverVideo(false);

    // Mouse events
    hoverEventTargetElement.addEventListener('mouseenter', onHoverStart);
    hoverEventTargetElement.addEventListener('mouseleave', onHoverEnd);

    // Focus/blur
    hoverEventTargetElement.addEventListener('focus', onHoverStart);
    hoverEventTargetElement.addEventListener('blur', onHoverEnd);

    // Touch events
    const touchStartListenerOptions = { passive: true };

    hoverEventTargetElement.addEventListener(
      'touchstart',
      onHoverStart,
      touchStartListenerOptions
    );
    // Event listener pauses the video when the user touches somewhere outside of the player
    const onWindowTouchStart = (event: TouchEvent) => {
      if (
        !(event.target instanceof Node) ||
        !hoverEventTargetElement.contains(event.target)
      ) {
        onHoverEnd();
      }
    };

    window.addEventListener(
      'touchstart',
      onWindowTouchStart,
      touchStartListenerOptions
    );

    // Return a cleanup function that removes all event listeners
    return () => {
      hoverEventTargetElement.removeEventListener('mouseenter', onHoverStart);
      hoverEventTargetElement.removeEventListener('mouseleave', onHoverEnd);
      hoverEventTargetElement.removeEventListener('focus', onHoverStart);
      hoverEventTargetElement.removeEventListener('blur', onHoverEnd);
      hoverEventTargetElement.removeEventListener('touchstart', onHoverStart);
      window.removeEventListener('touchstart', onWindowTouchStart);
    };
  }, [disableDefaultEventHandling, hoverTarget]);

  // Effect fires hover callbacks as isHoveringOverVideo changes
  useEffect(() => {
    if (previousIsHoveringOverVideoRef.current === isHoveringOverVideo) return;
    previousIsHoveringOverVideoRef.current = isHoveringOverVideo;

    if (isHoveringOverVideo && onHoverStartCallback != null) {
      onHoverStartCallback();
    } else if (!isHoveringOverVideo && onHoverEndCallback != null) {
      onHoverEndCallback();
    }
  }, [isHoveringOverVideo, onHoverEndCallback, onHoverStartCallback]);

  return isHoveringOverVideo;
}
