import { useEffect, useRef } from 'react';

/**
 * Sets up listeners for hover events on the hover target element and dispatches events
 * when the target element is hovered or unhovered.
 *
 * @param {Node} hoverTargetElement - The target element to watch for hover events on
 * @param {boolean} focused - Whether the component is being manually focused by the focused prop.
 * @param {boolean} disableDefaultEventHandling - If true, disables setting up the standard mouseenter/touchstart/focus listeners
 *                                                on the hover target element.
 * @param {func} onHoverStartCallback - Optional callback to be called when the target element is hovered.
 * @param {func} onHoverEndCallback - Optional callback to be called when the hover target element is unhovered.
 */
export default function useManageHoverEvents(
  hoverTargetElement: Node,
  focused: boolean,
  disableDefaultEventHandling: boolean,
  onHoverStartCallback: () => void,
  onHoverEndCallback: () => void
): void {
  // Keeping hover callbacks as refs because we want to be able to access them from within our
  // onHoverStart and onHoverEnd event listeners without needing to re-run the
  // event setup effect every time they change
  const onHoverStartCallbackRef = useRef<() => void>();
  onHoverStartCallbackRef.current = onHoverStartCallback;

  const onHoverEndCallbackRef = useRef<() => void>();
  onHoverEndCallbackRef.current = onHoverEndCallback;

  useEffect(() => {
    // If default event handling is disabled, we shouldn't check for touch events outside of the player
    if (disableDefaultEventHandling || !hoverTargetElement) return undefined;

    const onHoverStart = () => {
      hoverTargetElement.dispatchEvent(new Event('hvp:hoverStart'));
      if (onHoverStartCallbackRef.current) onHoverStartCallbackRef.current();
    };
    const onHoverEnd = () => {
      hoverTargetElement.dispatchEvent(new Event('hvp:hoverEnd'));
      if (onHoverEndCallbackRef.current) onHoverEndCallbackRef.current();
    };

    // Mouse events
    hoverTargetElement.addEventListener('mouseenter', onHoverStart);
    hoverTargetElement.addEventListener('mouseleave', onHoverEnd);

    // Focus/blur
    hoverTargetElement.addEventListener('focus', onHoverStart);
    hoverTargetElement.addEventListener('blur', onHoverEnd);

    // Touch events
    const touchStartListenerOptions = { passive: true };

    hoverTargetElement.addEventListener(
      'touchstart',
      onHoverStart,
      touchStartListenerOptions
    );
    // Event listener pauses the video when the user touches somewhere outside of the player
    const onWindowTouchStart = (event: TouchEvent) => {
      if (
        !(event.target instanceof Node) ||
        !hoverTargetElement.contains(event.target)
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
      hoverTargetElement.removeEventListener('mouseenter', onHoverStart);
      hoverTargetElement.removeEventListener('mouseleave', onHoverEnd);
      hoverTargetElement.removeEventListener('focus', onHoverStart);
      hoverTargetElement.removeEventListener('blur', onHoverEnd);
      hoverTargetElement.removeEventListener('touchstart', onHoverStart);
      window.removeEventListener('touchstart', onWindowTouchStart);
    };
  }, [disableDefaultEventHandling, hoverTargetElement]);

  // Defaulting the ref to false rather than the initial value of the focused prop because
  // if focused is true initially, we want to run the effect, but if it's false, we don't
  const previousFocusedRef = useRef<boolean>(false);

  // Effect dispatches hover start/end events on the target element when the focused prop changes
  useEffect(() => {
    if (!hoverTargetElement) return;

    if (previousFocusedRef.current !== focused) {
      previousFocusedRef.current = focused;

      if (focused) {
        hoverTargetElement.dispatchEvent(new Event('hvp:hoverStart'));
      } else {
        hoverTargetElement.dispatchEvent(new Event('hvp:hoverEnd'));
      }
    }
  }, [hoverTargetElement, focused]);
}
