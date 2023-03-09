import React, { useRef, useState } from "react";
import HoverVideoPlayer from "../../../src/HoverVideoPlayer";

import { mp4VideoSrc } from "../../constants";

export default function HoverTargetTestPage(): JSX.Element {
  const hoverTargetRef = useRef<HTMLDivElement>(null);

  const [hoveringTestID, setHoveringTestID] = useState<string | null>(null);

  return (
    <div>
      <h1>hoverTarget</h1>
      <p data-testid="current-hovering-testid">{hoveringTestID}</p>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        onHoverStart={() => setHoveringTestID("hvp:no-hover-target")}
        onHoverEnd={() => setHoveringTestID(null)}
        data-testid="hvp:no-hover-target"
      />
      <div data-testid="hover-target-ref" ref={hoverTargetRef}>
        Hover on me!
      </div>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        hoverTarget={hoverTargetRef}
        onHoverStart={() => setHoveringTestID("hvp:hover-target-ref")}
        onHoverEnd={() => setHoveringTestID(null)}
        data-testid="hvp:hover-target-ref"
      />
      <div data-testid="hover-target-fn">No, hover on me!</div>
      <HoverVideoPlayer
        videoSrc={mp4VideoSrc}
        hoverTarget={() =>
          document.querySelector("[data-testid=hover-target-fn]")
        }
        onHoverStart={() => setHoveringTestID("hvp:hover-target-fn")}
        onHoverEnd={() => setHoveringTestID(null)}
        data-testid="hvp:hover-target-fn"
      />
    </div>
  );
}
