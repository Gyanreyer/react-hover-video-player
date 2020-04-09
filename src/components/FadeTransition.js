import React from 'react';
import { Transition } from 'react-transition-group';

const FadeTransition = ({
  isVisible = false,
  duration,
  className,
  children,
  shouldMountOnEnter,
  testID,
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
        style={{
          // If the transition state is entering/entered, set the opacity to 1 to fade the contents in
          opacity:
            transitionState === 'entering' || transitionState === 'entered'
              ? 1
              : 0,
          transition: `opacity ${duration}ms`,
        }}
        className={className}
        data-testid={testID}
      >
        {children}
      </div>
    )}
  </Transition>
);

export default FadeTransition;
