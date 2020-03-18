import React, { Component } from "react";
import { render } from "react-dom";

import HoverVideoPreview from "../../src";

export default class Demo extends Component {
  render() {
    return (
      <div>
        <h1>react-hover-video-preview Demo</h1>
        <HoverVideoPreview
          imageSrc="https://via.placeholder.com/150"
          videoSources={[
            {
              src:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
          ]}
        />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
