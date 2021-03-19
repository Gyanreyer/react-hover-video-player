# React Hover Video Player

[![npm version](https://badgen.net/npm/v/react-hover-video-player)](https://www.npmjs.com/package/react-hover-video-player)
[![minzipped size](https://badgen.net/bundlephobia/minzip/react-hover-video-player)](https://bundlephobia.com/result?p=react-hover-video-player)
[![code coverage](https://codecov.io/gh/Gyanreyer/react-hover-video-player/branch/master/graph/badge.svg)](https://codecov.io/gh/Gyanreyer/react-hover-video-player)
[![build status](https://travis-ci.com/Gyanreyer/react-hover-video-player.svg?branch=master)](https://travis-ci.com/github/Gyanreyer/react-hover-video-player)

![demo](./demo/public/image/hover_preview_demo.gif)

## Table of Contents

1. **[What It Is](#what-it-is)**
1. **[Features](#features)**
1. **[How It Works](#how-it-works)**
1. **[Get Started](#get-started)**
    - [Installation](#installation)
    - [Basic Usage](#basic-usage)
1. **[Sources](#sources)**
    - [videoSrc](#videosrc)
    - [videoCaptions](#videocaptions)
    - [crossOrigin](#crossorigin)
1. **[Overlays](#overlays)**
    - [pausedOverlay](#pausedoverlay)
    - [loadingOverlay](#loadingoverlay)
    - [overlayTransitionDuration](#overlaytransitionduration)
    - [loadingStateTimeout](#loadingstatetimeout)
1. **[Custom Event Handling](#custom-event-handling)**
    - [hoverTargetRef](#hovertargetref)
    - [focused](#focused)
    - [disableDefaultEventHandling](#disabledefaulteventhandling)
1. **[Video Behavior](#video-behavior)**
    - [restartOnPaused](#restartonpaused)
    - [muted](#muted)
    - [volume](#volume)
    - [loop](#loop)
    - [videoId](#videoid)
1. **[Custom Styling](#custom-styling)**
    - [Applying classNames and styles](#applying-classnames-and-styles)
    - [sizingMode](#sizingmode)
1. **[Optimization](#optimization)**
    - [preload](#preload)
    - [unloadVideoOnPaused](#unloadvideoonpaused)
1. **[Video Controls](#video-controls)**
    - [controls](#controls)
    - [controlsList](#controlslist)
    - [disableRemotePlayback](#disableremoteplayback)
    - [disablePictureInPicture](#disablepictureinpicture)

## What It Is

A React component that makes it super easy to set up a video that will play when the user hovers over it. This is particularly useful for setting up a thumbnail that will play a video preview on hover.

## Features

- Out-of-the-box support for both mouse and touchscreen interactions
- Easily add custom thumbnails and loading states
- Clean, error-free handling of async video playback
- Lightweight and fast
- No dependencies

## How It Works

This component will render a video element which will start playing when an `onMouseEnter`, `onTouchStart`, or `onFocus` event is fired on the [hover target](#hovertargetref) and will accordingly be paused when an `onMouseLeave` or `onBlur` event is fired on the target, or an `onTouchStart` event is fired outside of the target. This default behavior can be [disabled, overridden, and customized](#custom-event-handling) as needed.

Everything is written with extra care to cleanly handle the video element's state as it asynchronously loads and plays.

## Get Started

### Installation

```bash
npm install react-hover-video-player
```

### Basic Usage

```jsx
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

## Sources

### videoSrc

**Type**: `string` or `array` of strings and/or objects | **This prop is required**

`videoSrc` accepts one or multiple values descibing the video source file(s) that should be used for the video player.

If you only have **one video source**, you can simply provide a single string for the URL path to the video file like so:

```jsx
<HoverVideoPlayer
  videoSrc="path/video-file.mp4"
/>
```

If you have **multiple video sources**, you can provide all of them in an array of strings or objects with the shape:

```javascript
{
  // The URL path string for this source
  src: 'path/video-file.mp4',
  // The MIME type of this source
  type: 'video/mp4',
}
```

In practice this looks like:

```jsx
<HoverVideoPlayer
  videoSrc={[
    { src: 'video.webm', type: 'video/webm' },
    { src: 'video.mp4', type: 'video/mp4' },
  ]}
/>
```

If you have multiple video sources, make sure you order your `videoSrc` array by ascending file size so that the smallest video file is first; browsers will always simply pick the first source in the list that they support.

### videoCaptions

**Type**: `object` or `array` of objects | **Default**: `null`

`videoCaptions` accepts one or multiple objects descibing the caption track sources to use if you wish to add closed captions to the video for accessibility.

A caption track object should follow the shape:

```javascript
{
  // The URL string for the captions track file
  src: 'path-to/captions-track.vtt',
  // The code for the language that the captions are in
  srcLang: 'en',
  // The title of the captions track
  label: 'English',
  // OPTIONAL: whether this track should be used by default
  default: true,
}
```

Note that if you do not set `default: true` or have more than one track, it is recommended that you set the [controls](#controls) prop to `true` so that the user may enable the captions or choose the correct captions for their desired language.

In practice this looks like:

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  videoCaptions={[
    {
      src: 'captions/english.vtt',
      srcLang: 'en',
      label: 'English',
      default: true,
    },
    {
      src: 'captions/french.vtt',
      srcLang: 'fr',
      label: 'French',
    },
  ]}
  // Enable the video's controls so that the user can select the caption track they want or toggle captions on and off
  controls
/>
```


### crossOrigin

**Type**: `string` | **Default**: `"anonymous"`

The `crossOrigin` prop maps directly to the [HTML Video element's crossorigin attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-crossorigin) and allows us to define how the video element should handle CORS requests. For most purposes, you should not need to worry about setting this. The acceptable values are:

- `"anonymous"`: The video element will send cross-origin requests with no credentials. This is the browser default and usually all you need for most purposes.
- `"use-credentials"`: The video element will send cross-origin requests with credentials.

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  crossOrigin="use-credentials"
/>
```

## Overlays

### pausedOverlay

**Type**: `node` | **Default**: `null`

This optional prop accepts any renderable content that you would like to be displayed over the video while it is in a paused or loading state. When the video starts playing, this content will be faded out.

A common use case for this would be displaying a thumbnail image over the video while it is paused.

```jsx
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

`loadingOverlay` is an optional prop that accepts any renderable content that you would like to be displayed over the video if it takes too long to start after the user attempts to play it.

This allows you to provide a better user experience for users with slower internet connections, particularly if you are using larger video assets.

Note that the [pausedOverlay](#pausedoverlay) will still be rendered while the video is in a loading state, so this overlay will simply be displayed on top of that one.

```jsx
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

```jsx
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

```jsx
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

## Custom Event Handling

### hoverTargetRef

**Type**: `RefObject` | **Default**: `null`

`hoverTargetRef` accepts a React ref to the element that you would like to apply the component's [default event handling](#how-it-works) to. If no ref is provided, it will use the component's container `<div>` as the hover target. This prop is useful if you would like a simple way to make the video play when the user hovers over a larger surrounding area.

```jsx
const wrapperLinkRef = useRef();

...

<a href="/other-page" ref={wrapperLinkRef}>
  <HoverVideoPlayer
    videoSrc="video.mp4"
    // We want the video to play when the wrapping link element is hovered or focused
    hoverTargetRef={wrapperLinkRef}
  />
</a>
```

Note that this is only intended to work with refs created by React's `useRef` or `createRef` functions; custom callback refs will not work.

### focused

**Type**: `boolean` | **Default**: `false`

`focused` accepts a boolean value which, if true, will force the video player to play regardless of any other user interactions it receives. This can be useful for scenarios where you may wish to implement custom behavior outside of standard mouse/touch interactions with the video player.

```jsx
const [isVideoPlaying, setIsVideoPlaying] = useState(false);

...

<button 
  // Clicking this button should toggle whether the video is playing
  onClick={()=>setIsVideoPlaying(!isVideoPlaying)}
>
  Click me to make the video play
</button>
<HoverVideoPlayer
  videoSrc="video.mp4"
  focused={isVideoPlaying}
/>
```

If you wish to set up a a fully custom implementation that overrides the hover player's default mouse and touch event handling, you can use the [disableDefaultEventHandling](#disabledefaulteventhandling) prop.

### disableDefaultEventHandling

**Type**: `boolean` | **Default**: `false`

`disableDefaultEventHandling` accepts a boolean value which, if true, will disable the player's default built-in event handling where `onMouseEnter` and `onTouchStart` events play the video and `onMouseLeave` events and `touchStart` events outside of the player pause the video. This can be useful if you want to build a fully custom implementation of the player's behavior using the [focused](#focused) prop.

```jsx
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

## Video Behavior

### restartOnPaused

**Type**: `boolean` | **Default**: `false`

`restartOnPaused` accepts a boolean value which will toggle whether the video should be reset to the start every time it is paused after the user stops hovering. `restartOnPaused` is false by default so it will retain the current place in the video.

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  restartOnPaused // The video should restart when it is paused
/>
```

### muted

**Type**: `boolean` | **Default**: `true`

`muted` accepts a boolean value which toggles whether or not the video should be muted.

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  // The video should play sound
  muted={false}
/>
```

### volume

**Type**: `number` | **Default**: 1

`volume` accepts a number on a scale from 0-1 for the volume that the video's audio should play at.

Note that this will only work if the [muted](#muted) prop is also set to `false`.

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  // The video should play sound at 50% volume
  volume={0.5}
  muted={false}
/>
```

### loop

**Type**: `boolean` | **Default**: `true`

`loop` accepts a boolean value which toggles whether or not the video should loop when it reaches the end.

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  // The video should not loop when it reaches the end
  loop={false}
/>
```

### videoId

**Type**: `string` | **Default**: null

`videoId` can be used to set an `id` on the video element. This can be useful if you need to access the video element via `document.getElementById()` in order to extend its behavior in some unique way.

```jsx
useEffect(()=>{
  const videoElement = document.getElementById('hover-video');
  // DO SOMETHING WITH THE VIDEO ELEMENT HERE
},[]);

return (
  <HoverVideoPlayer
    videoSrc="video.mp4"
    videoId="hover-video"
  />
)
```

## Custom Styling

### Applying classNames and styles

The base styling for this component's contents are set using inline styling. You can customize or override this styling using various props that accept classNames and style objects.

```jsx
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
    padding: 24,
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

```jsx
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

## Optimization

### preload

**Type**: `string` | **Default**: `null`

The `preload` prop maps directly to the [HTML Video element's preload attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) and allows us to define how much data a video element should preload before it is played. This prop defaults to null, which will use whatever the browser's default setting is. The acceptable values are:

- `"auto"`: We can load the whole video file before playing, even if it never gets used. This is usually the browser default.
- `"metadata"`: We should only load the video's metadata (video dimensions, duration, etc) before playing. This helps us avoid loading large amounts of data unless it is absolutely needed.
  - Note that in Safari, video elements with `preload="metadata"` applied will just appear empty rather than displaying the first frame of the video like other browsers do. As a result, it is recommended that if you use this setting, you should have [paused overlay](#pausedoverlay) contents set that will hide the video element until it is playing.
- `"none"`: We should not preload any part of the video before playing, including metadata.
  - Note that this means that the video's dimensions will not be loaded until the video is played. This can potentially cause a content jump when the video starts loading if you are using the `"video"` [sizing mode](#sizing-mode-presets).
  - Additionally, nothing will be displayed for the video element until it starts playing, so you should make sure you provide [paused overlay](#pausedoverlay) contents to hide the video element.

```jsx
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

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  // Fully unload the video when it isn't playing
  unloadVideoOnPaused
/>
```

## Video Controls

### controls

**Type**: `boolean` | **Default**: `false`

`controls` accepts a boolean value which toggles whether the video element should have the browser's video playback controls enabled.

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  // Show playback controls on the video
  controls
/>
```

### controlsList

**Type**: `string` | **Default**: `null`

`controlsList` accepts a string describing buttons that should be excluded from the video's playback controls. The string can include the following possible values, with spaces separating each one:

- `"nodownload"`: Removes the download button from the video's controls
- `"nofullscreen"`: Removes the fullscreen button from the video's controls

Be aware that this feature [is not currently supported across all major browsers.](https://caniuse.com/mdn-api_htmlmediaelement_controlslist)

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  // Show playback controls on the video
  controls
  // Disable both the download and fullscreen buttons
  controlsList="nodownload nofullscreen"
/>
```

### disableRemotePlayback

**Type**: `boolean` | **Default**: `true`

`disableRemotePlayback` toggles whether the browser should show a remote playback UI on the video, which allows the user to cast the video to other devices.

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  // Show controls for casting this video to remote devices
  disableRemotePlayback={false}
/>
```

### disablePictureInPicture

**Type**: `boolean` | **Default**: `true`

`disablePictureInPicture` toggles whether the browser should show a picture-in-picture UI on the video, which allows the user to pop the video out into a floating window that persists over other tabs or apps.

```jsx
<HoverVideoPlayer
  videoSrc="video.mp4"
  // Show controls for playing this video in picture-in-picture mode
  disablePictureInPicture={false}
/>