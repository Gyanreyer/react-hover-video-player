import React from 'react';

import LiveEditableCodeSection from '../LiveEditableCodeSection';

const setupDemoCode = `<HoverVideoPlayer
  videoSrc={[
      { src: 'video/butterflies.webm', type: 'video/webm' },
      { src: 'video/butterflies.mp4', type: 'video/mp4' },
    ]}
  shouldRestartOnVideoStopped={false}
/>`;

export default function Setup() {
  return (
    <>
      <LiveEditableCodeSection code={setupDemoCode} />
    </>
  );
}
