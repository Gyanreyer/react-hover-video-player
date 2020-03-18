import React from "react";

const HoverVideoPreview = ({
  imageSrc,
  imageSrcSet,
  alt = "",
  videoSrc,
  videoSources = [],
  controls = false,
  loop = true,
  muted = true,
  preload = "metadata"
}) => {
  const videoSourcesArray = [...videoSources];

  if (videoSrc) {
    switch (typeof videoSrc) {
      case "object":
        videoSourcesArray.splice(0, 0, videoSrc);
        break;
      case "string":
        videoSourcesArray.splice(0, 0, {
          src: videoSrc
        });
        break;
      default:
        if (videoSrc) {
          console.error(
            `Invalid variable of type ${typeof videoSrc} provided for videoSrc prop. videoSrc must be a string or an object.`
          );
        }
    }
  }

  return (
    <div>
      <img src={imageSrc} srcSet={imageSrcSet} alt={alt} />
      <video
        controls={controls}
        loop={loop}
        muted={muted}
        playsinline
        preload={preload}
      >
        {videoSourcesArray.map(videoSourceProps => (
          <source {...videoSourceProps} />
        ))}
      </video>
    </div>
  );
};

export default HoverVideoPreview;
