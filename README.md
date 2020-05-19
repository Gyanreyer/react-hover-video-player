# React Hover Video Player

A React component that makes it dead easy to set up a video that plays on hover.

[![npm version](https://badgen.net/npm/v/react-hover-video-player)](https://www.npmjs.com/package/react-hover-video-player)
[![minzipped size](https://badgen.net/bundlephobia/minzip/react-hover-video-player)](https://bundlephobia.com/result?p=react-hover-video-player)
[![code coverage](https://codecov.io/gh/Gyanreyer/react-hover-video-player/branch/master/graph/badge.svg)](https://codecov.io/gh/Gyanreyer/react-hover-video-player)
[![build status](https://travis-ci.com/Gyanreyer/react-hover-video-player.svg?branch=master)](https://travis-ci.com/github/Gyanreyer/react-hover-video-player)

## Features

- Robust support for both mouse and touchscreen interactions
- Easily add custom thumbnails and loading states
- Lightning fast
- No dependencies
- Simple and easy to customize

## Get Started

### Installation

`npm install react-hover-video-player`

### Basic Usage

```javascript
import HoverVideoPlayer from 'react-hover-video-player';

function MyComponent () {
  return (
    <HoverVideoPlayer
      videoSrc="path-to/your-video.mp4"
      pausedOverlay={
        <img src="thumbnail-image.jpg" alt="" />
      }
      loadingOverlay={
        <div className="loading-spinner-overlay" />
      }
    />
  );
}
```

## Component Props

### videoSrc

**Type**: `string` or `array` of objects | **This prop is required**

`videoSrc` accepts one or multiple values descibing the video source file(s) that should be used for the video player.

If you only have **one video source**, you can simply provide a single string for the URL path to the video file like so:

```javascript
<HoverVideoPlayer
  videoSrc="path/video-file.mp4"
/>
```

If you have **multiple video sources**, you can provide all of them in an array of objects with the shape:

```javascript
{
  src: 'path/video-file.mp4', // The URL path string for this source
  type: 'video/mp4', // The MIME type of this source
}
```

In practice this looks like:

```javascript
<HoverVideoPlayer
  videoSrc={[
    { src: 'video.webm', type: 'video/webm' },
    { src: 'video.mp4', type: 'video/mp4' },
  ]}
>
```

If you have multiple video sources, make sure you order your `videoSrc` array by ascending file size so that the smallest video file is first; browsers will always simply pick the first source in the list that they support.

### pausedOverlay

**Type**: `node` | **Default**: `null`

This optional prop accepts any renderable content that you would like to be displayed over the video while it is in a paused state. When the video starts playing, this content will be faded out.

A common use case for this would be displaying a thumbnail image over the video while it is paused.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  // We should display an image over the video while it is paused
  pausedOverlay={
    <img
      src="image/video-thumbnail.jpg"
      alt=""
      style={{
        // Make the image expand to cover the video's dimensions
        width: "100%",
        height: "100%",
      }}
    />
  }
/>
```

The [overlayTransitionDuration](#overlaytransitionduration) prop allows you to set how long it should take for the overlay to fade out when the video starts playing and fade back in when it stops playing.

### loadingOverlay

**Type**: `node` | **Default**: `null`

`loadingOverlay` is an optional prop that accepts any renderable content that you would like to be displayed over the video if it takes too long to start after the user attempts to play the video.

This allows you to provide a better user experience for users with slower internet connections, particularly if you are using larger video assets.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  // We should display a custom element on top of
  // the video when it is loading
  loadingOverlay={
    <div className="loading-overlay">
      Loading...
    </div>
  }
/>
```

This overlay will only be displayed if it takes more than a certain amount of time for the video to start after we attempt to play it. You can set the precise timeout duration with the [loadingStateTimeout](#loadingstatetimeout) prop.

### overlayTransitionDuration

**Type**: `number` | **Default**: `400`

`overlayTransitionDuration` accepts the number of milliseconds that it should take for the [paused overlay](#pausedoverlay) and [loading overlay](#loadingoverlay) to fade in and out as the player's state changes.

After the user stops hovering on the player, the video will continue playing until the overlay has fully faded back in to provide the most seamless user experience possible.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  pausedOverlay={<div>Paused!</div>}
  // It should take 500ms for the pausedOverlay to fade out when
  // the video plays and fade back in when the video pauses
  overlayTransitionDuration={500}
/>
```

### loadingStateTimeout

**Type**: `number` | **Default**: `200`

`loadingStateTimeout` accepts the number of milliseconds that the player should wait before showing a loading state if the video is not able to play immediately.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  loadingOverlay={
    <div className="loading-overlay">
      Loading...
    </div>
  }
  // We should only show the loading state if the video takes
  // more than 1 full second to start after attempting to play
  loadingStateTimeout={1000}
/>
```

### restartOnPaused

**Type**: `boolean` | **Default**: `false`

`restartOnPaused` accepts a boolean value which will toggle whether the video should be reset to the start every time it is paused. `restartOnPaused` is false by default so it will retain the current place in the video.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  restartOnPaused // The video should restart when it is paused
/>
```

### focused

**Type**: `boolean` | **Default**: `false`

`focused` accepts a boolean value which, if true, will force the video player to play regardless of any other user interactions it receives. This can be useful for scenarios where you may wish to implement custom behavior outside of standard mouse/touch interactions with the video player.

```javascript
const [isVideoPlaying, setIsVideoPlaying] = useState(false);

...

<a
  href="#"
  // The video should play while its container has focus and pause when that
  // focus is blurred
  onFocus={()=>setIsVideoPlaying(true)}
  onBlur={()=>setIsVideoPlaying(false)}
>
  <HoverVideoPlayer
    videoSrc="video.mp4"
    focused={isVideoPlaying}
  />
</a>
```

If you wish to set up a a fully custom implementation that overrides the hover player's default mouse and touch event handling, you can use the [disableDefaultEventHandling](#disabledefaultdventhandling) prop.

### disableDefaultEventHandling

**Type**: `boolean` | **Default**: `false`

`disableDefaultEventHandling` accepts a boolean value which, if true, will disable the player's default built-in event handling where `onMouseEnter` and `onTouchStart` events play the video and `onMouseLeave` events and `touchStart` events outside of the player pause the video. This can be useful if you want to build a fully custom implementation of the player's behavior using the [focused](#focused) prop.

```javascript
const [isVideoPlaying, setIsVideoPlaying] = useState(false);

...

<div
  // Clicking on the player will toggle whether it is playing or paused
  onClick={()=>setIsVideoPlaying(!isVideoPlaying)}
>
  <HoverVideoPlayer
    videoSrc="video.mp4"
    focused={isVideoPlaying}
    // The default mouse and touch event handling on the player is disabled
    disableDefaultEventHandling
  />
</div>
```

### videoCaptions

**Type**: `string` or `array` of objects | **Default**: `null`

`videoCaptions` accepts one or multiple values descibing the sources to use for caption tracks on the video for accessibility.

If you only have **one caption track file**, you can simply provide a single string for the URL path to the captions file like so:

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  videoCaptions="captions/primary-captions.vtt"
/>
```

If you have **multiple caption tracks**, you can provide all of them in an array of objects with the shape:

```javascript
{
  src: 'path-to/captions-track.vtt', // The URL string for the captions track file
  srcLang: 'en', // The code for the language that the captions are in
  label: 'English', // The title of the captions track
}
```

In practice this looks like:

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  videoCaptions={[
    {
      src: 'captions/english.vtt',
      srcLang: 'en',
      label: 'English',
    },
    {
      src: 'captions/french.vtt',
      srcLang: 'fr',
      label: 'French',
    },
  ]}
>
```

## Video Props

### muted

**Type**: `boolean` | **Default**: `true`

`muted` accepts a boolean value which toggles whether or not the video should be muted.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  // The video should play sound
  muted={false}
>
```

### loop

**Type**: `boolean` | **Default**: `true`

`loop` accepts a boolean value which toggles whether or not the video should loop when it reaches the end.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  // The video should not loop when it reaches the end
  loop={false}
>
```

## Custom Styling Props

### Applying classNames and styles

The base styling for this component's contents are set using inline styling. You can customize or override this styling using various props that accept classNames and style objects.

```javascript
<HoverVideoPlayer
  /* ~~~ OUTER CONTAINER DIV ~~~ */
  // Applies a custom class to the outer container div wrapping the player
  className="player-wrapper"
  // Applies inline styles to the outer container div wrapping the player
  style={{
    width: '50%',
  }}

  /* ~~~ PAUSEED OVERLAY WRAPPER DIV ~~~ */
  // Applies a custom class to the div wrapping the pausedOverlay contents
  pausedOverlayWrapperClassName="paused-overlay-wrapper"
  // Applies inline styles to the div wrapping the pausedOverlay contents
  pausedOverlayWrapperStyle={{
    backgroundColor: '#ff0000',
  }}

  /* ~~~ LOADING OVERLAY WRAPPER DIV ~~~ */
  // Applies a custom class to the div wrapping the loadingOverlay contents
  loadingOverlayWrapperClassName="loading-overlay-wrapper"
  // Applies inline styles to the div wrapping the loadingOverlay contents
  loadingOverlayWrapperStyle={{
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  }}

  /* ~~~ VIDEO ELEMENT ~~~ */
  // Applies a custom class to the video element
  videoClassName="player-video"
  // Applies inline styles to the video element
  videoStyle={{
    padding: 24
  }}
/>
```

### sizingMode

**Type**: `string` | **Default**: `"video"`

The `sizingMode` prop can be used to apply one of four available styling presets which define how the player's contents should be sized. These presets are:

- `"video"`: **This is the default sizing mode.** Everything should be sized based on the video element's dimensions and the overlays will expand to cover the video.
  - Note that this mode comes with a caveat: The video element may briefly display with different dimensions until it finishes loading the metadata containing the video's actual dimensions. This is usually fine when the metadata is loaded immediately, so it is recommended that you avoid using this mode in combination with the [unloadVideoOnPaused](#unloadvideoonpaused) optimization prop described below as it will cause the video's metadata to be unloaded frequently.
- `"overlay"`: Everything should be sized based on the [paused overlay](#pausedoverlay)'s dimensions and the video element will expand to fill that space.
  - Note that the [paused overlay](#pausedoverlay) contents will need to have a `display: block` style in order for this mode to work correctly.
- `"container"`: All of the video's contents should expand to fill the component's outer container div.
- `"manual"`: Removes all preset sizing-related styling if you wish to use your own fully custom styling implementation.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  style={{
    width: '100%',
    // The container should have a set 16:9 aspect ratio
    // (https://css-tricks.com/aspect-ratio-boxes/)
    paddingTop: '56.25%',
  }}
  // The video and overlays should expand to fill the 16:9 container
  sizingMode="container"
/>
```

## Optimization Props

### preload

**Type**: `string` | **Default**: `null`

The `preload` prop maps directly to the [HTML Video element's preload attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) and allows us to define how much data a video element should preload before it is played. This prop defaults to null, which will use whatever the browser's default setting is. The acceptable values are:

- `"auto"`: We can load the whole video file before playing, even if it never gets used. This is usually the browser default.
- `"metadata"`: We should only load the video's metadata (video dimensions, duration, etc) before playing. This helps us avoid loading large amounts of data unless they are absolutely needed.
  - Note that in Safari, video elements with `preload="metadata"` applied will just appear empty rather than displaying the first frame of the video like other browsers do. As a result, it is recommended that if you use this setting, you should have [paused overlay](#pausedoverlay) contents set that will hide the video element until it is playing.
- `"none"`: We should not preload any part of the video before playing, including metadata.
  - Note that this means that the video's dimensions will not be loaded until the video is played. This can potentially cause a content jump when the video starts loading if you are using the `"video"` [sizing mode](#sizing-mode-presets).
  - Additionally, nothing will be displayed for the video element until it starts playing, so you should make sure you provide [paused overlay](#pausedoverlay) contents to hide the video element.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  // We should only preload the video's metadata
  preload="metadata"
/>
  ```

### unloadVideoOnPaused

**Type**: `boolean` | **Default**: `false`

Having a large number of videos with large file sizes on the page at the same time can cause severe performance problems in some cases, especially in Google Chrome. This is because after you play a video for the first time, it will continue loading in the background even after it is paused, taking up bandwidth and memory even though it is not in use. If you have too many large videos loading in the background at once, this can gum up the works very quickly and cause significant performance degredation to the point where other assets may stop loading entirely as well. This is where the `unloadVideoOnPaused` prop comes in: when set to true, it will ensure that video assets will be kept completely unloaded whenever the video is not playing. This may result in the video being slighly slower to start on repeat play attempts, but assuming the browser is caching the video assets correctly, the difference should not be too significant.

Note that this will also keep the video's metadata unloaded when it is not playing, causing content jump issues with the `"video"` [sizing mode](#sizing-mode-presets).

Additionally, nothing will be displayed for the video element when it is unloaded, so it is highly recommended that you provide [paused overlay](#pausedoverlay) contents to hide the video when it is paused.

```javascript
<HoverVideoPlayer
  videoSrc="video.mp4"
  // Fully unload the video when it isn't playing
  unloadVideoOnPaused
/>
```
