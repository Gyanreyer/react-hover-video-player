import React from 'react';
import { Transition } from 'react-transition-group';
import { cx, css } from 'emotion';

const FadeTransition = ({
  isVisible = false,
  duration,
  className,
  children,
  shouldMountOnEnter,
}) => (
  <Transition
    in={isVisible}
    timeout={duration}
    mountOnEnter={shouldMountOnEnter}
    unmountOnExit={shouldMountOnEnter}
    onEnter={(node) => node.offsetHeight}
  >
    {(transitionState) => (
      <div
        className={cx(
          css`
            /* If the transition state is entering/entered,
                set the opacity to 1 to fade the contents in  */
            opacity: ${transitionState === 'entering' ||
            transitionState === 'entered'
              ? 1
              : 0};
            transition: opacity ${duration}ms;
          `,
          className
        )}
      >
        {children}
      </div>
    )}
  </Transition>
);

export default FadeTransition;
