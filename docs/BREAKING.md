# Breaking changes

## 10.0.0 breaking changes

- [Deprecates passing config objects to `videoSrc` prop](#deprecates-passing-config-objects-to-videosrc-prop)
- [Deprecates passing config objects to `videoCaptions` prop](#deprecates-passing-config-objects-to-videocaptions-prop)
- [Removes `shouldSuppressPlaybackInterruptedErrors` prop](#removes-shouldsuppressplaybackinterruptederrors-prop)

### Deprecates passing config objects to `videoSrc` prop

The `videoSrc` prop still supports URL strings,
but no longer accepts config objects or arrays of config objects for video sources.
Instead, sources like this must now be defined as `<source>` elements.

Migration for a single source config object is fairly straightforward; the `src` and `type` properties
on the config objects map directly to the attributes that need to be set on the `<source>` elements:

```diff
<HoverVideoPlayer
- videoSrc={{
-   src: "path-to/video.mp4",
-   type: "video/mp4",
- }}
+ videoSrc={(
+   <source
+     src="path-to/video.mp4"
+     type="video/mp4"
+   />
+ )}
/>
```

For an array of source config objects, simply wrap your `<source>` elements in a fragment:

```diff
<HoverVideoPlayer
- videoSrc={[
-   {
-     src: "video.webm",
-     type: "video/webm",
-   },
-   {
-     src: "video.mp4",
-     type: "video/mp4",
-   },
- ]}
+ videoSrc={(
+   <>
+     <source src="video.webm" type="video/webm" />
+     <source src="video.mp4" type="video/mp4" />
+   </>
+ )}
/>
```

### Deprecates passing config objects to `videoCaptions` prop

The `videoCaptions` prop also no longer accepts config objects for caption tracks.
Instead, caption tracks must be defined as `<track>` elements.

Like with the changes to `videoSrc` above, all of the properties on the caption track config objects should map directly to
attributes on the `<track>` elements:

```diff
<HoverVideoPlayer
  videoSrc="video.mp4"
- videoCaptions={[
-   {
-     src: "english-captions.vtt",
-     srcLang: "en",
-     label: "English",
-     kind: "captions",
-     default: true,
-   },
-   {
-     src: "french-subtitles.vtt",
-     srcLang: "fr",
-     label: "Francais",
-     kind: "subtitles",
-   },
- ]}
+ videoCaptions={(
+   <>
+     <track src="english-captions.vtt" srcLang="en" label="English" kind="captions" default />
+     <track src="french-subtitles.vtt" srcLang="fr" label="Francais" kind="subtitles" />
+   </>
+ )}
/>
```

### Removes `shouldSuppressPlaybackInterruptedErrors` prop

The `shouldSuppressPlaybackInterruptedErrors` prop is being removed, as it is not really needed anymore.

This prop defaulted to `true` and was not commonly used, so will likely not impact many people. You can simply remove the prop and things will continue functioning as normal.

```diff
<HoverVideoPlayer
  videoSrc="video.mp4"
- shouldSuppressPlaybackInterruptedErrors={false}
/>
```
