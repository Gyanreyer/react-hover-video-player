/* eslint-disable no-console */
import React from 'react';

interface RenderTiming {
  averageRenderTime: number;
  renderCount: number;
}

interface ComponentProfilerProps {
  profilerID: string;
  children: React.ReactChild;
}

/**
 * Util component logs out render timings for whatever component it's wrapped aroud
 */
const ComponentProfiler = ({
  profilerID,
  children,
}: ComponentProfilerProps): JSX.Element => {
  // Use a ref to track render timing for this component in a persistent store
  const renderTiming = React.useRef<RenderTiming>();
  if (!renderTiming.current) {
    renderTiming.current = {
      averageRenderTime: 0,
      renderCount: 0,
    };
  }

  // Logs out helpful render timing info for performance measurements
  const onProfilerRender = React.useCallback(
    (
      id, // the "id" prop of the Profiler tree that has just committed
      phase: string, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
      actualDuration: number // time spent rendering the committed update
    ) => {
      if (phase === 'mount') {
        console.log(`${profilerID} | MOUNT: ${actualDuration}ms`);
      } else {
        renderTiming.current.renderCount += 1;
        renderTiming.current.averageRenderTime +=
          (actualDuration - renderTiming.current.averageRenderTime) /
          renderTiming.current.renderCount;
        console.log(
          `${profilerID} | UPDATE: ${actualDuration}ms | New average: ${renderTiming.current.averageRenderTime}ms`
        );
      }
    },
    [profilerID]
  );
  return (
    <React.Profiler id={profilerID} onRender={onProfilerRender}>
      {children}
    </React.Profiler>
  );
};

export default ComponentProfiler;
