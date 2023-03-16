import { test, expect, Locator } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/videoCaptions');
});

async function getVideoTextTracks(videoLocator: Locator) {
  return videoLocator.evaluate((video: HTMLVideoElement) => {
    // TextTrackList, TextTrack, TextTrackCueList, and VTTCue instances all
    // don't get serialized to JSON correctly,
    // so we need to manually convert them to plain objects before returning them
    return Array.from(video.textTracks).map((track) => ({
      activeCues: track.activeCues && Array.from(track.activeCues).map((cue) => {
        const { startTime, endTime, text } = cue as VTTCue;
        return ({
          startTime,
          endTime,
          text,
        });
      }),
      cues: track.cues && Array.from(track.cues).map((cue) => {
        const { startTime, endTime, text } = cue as VTTCue;
        return ({
          startTime,
          endTime,
          text,
        });
      }),
      mode: track.mode,
      kind: track.kind,
    }));
  });
}

test('loads single caption track as expected', async ({ page }) => {
  const hoverVideoPlayer = await page.locator(
    '[data-testid="hvp:one-caption-track"]'
  );
  const video = await hoverVideoPlayer.locator('video');
  const trackElement = await video.locator('track');

  // The video should have a single track
  await expect(trackElement).toHaveCount(1);

  const loadedTextTracks = await getVideoTextTracks(video);

  expect(loadedTextTracks.length, "We should have a text track loaded in the video").toBe(1);

  const loadedTrack = loadedTextTracks[0];

  expect(loadedTrack.mode).toBe('showing');
  expect(loadedTrack.kind).toBe('captions');
  expect(loadedTrack.activeCues, "No cues should be active yet").toHaveLength(0);

  expect(loadedTrack.cues).toHaveLength(3);

  if (!loadedTrack.cues) {
    throw new Error("Cues should not be null");
  }
  const [cue1, cue2, cue3] = loadedTrack.cues;

  expect(cue1.startTime).toBe(0.5);
  expect(cue1.endTime).toBe(3);
  expect(cue1.text).toBe('This is some caption text');

  expect(cue2.startTime).toBe(4);
  expect(cue2.endTime).toBe(6.5);
  expect(cue2.text).toBe('I hope you can read it...');

  expect(cue3.startTime).toBe(6.7);
  expect(cue3.endTime).toBe(9);
  expect(cue3.text).toBe(
    "...because otherwise that means this doesn't work"
  );

  // Jump the video ahead to a point where a cue should be active
  await video.evaluate((videoElement: HTMLVideoElement) => {
    videoElement.currentTime = 2;
  });
  await expect.poll(() => video.evaluate((videoElement: HTMLVideoElement) => (videoElement.textTracks[0].activeCues?.[0] as VTTCue)?.text)).toBe("This is some caption text");
});

test('loads multiple caption tracks as expected', async ({ page }) => {
  const hoverVideoPlayer = await page.locator(
    '[data-testid="hvp:multiple-caption-tracks"]'
  );
  const video = await hoverVideoPlayer.locator('video');
  const trackElements = await video.locator('track');

  // The video should have 2 tracks
  await expect(trackElements).toHaveCount(2);

  let loadedTextTracks = await getVideoTextTracks(video);

  expect(loadedTextTracks, "We should have 2 text tracks available on the video").toHaveLength(2);

  let [track1, track2] = loadedTextTracks;

  expect(track1.mode, "The first track should be disabled initially").toBe('disabled');
  expect(track1.kind).toBe('captions');
  expect(track1.cues).toBeNull();
  expect(track1.activeCues).toBeNull();

  expect(track2.mode, "The second track should also be disabled initially").toBe('disabled');
  expect(track2.kind).toBe('subtitles');
  expect(track2.cues).toBeNull();
  expect(track2.activeCues).toBeNull();

  await video.evaluate((videoElement: HTMLVideoElement) => {
    videoElement.textTracks[1].mode = 'showing';
  });

  loadedTextTracks = await getVideoTextTracks(video);

  [track1, track2] = loadedTextTracks;

  expect(track1.mode, "The first track should be disabled initially").toBe('disabled');
  expect(track1.cues).toBeNull();
  expect(track1.activeCues).toBeNull();

  expect(track2.mode, "The second track should also be disabled initially").toBe('showing');
  expect(track2.cues).toHaveLength(3);
  expect(track2.activeCues).toHaveLength(0);

  if (!track2.cues) {
    throw new Error("Cues should not be null");
  }
  const [track2Cue1, track2Cue2, track2Cue3] = track2.cues;

  expect(track2Cue1.startTime).toBe(0.5);
  expect(track2Cue1.endTime).toBe(3);
  expect(track2Cue1.text).toBe('Seo roinnt téacs fotheidil');

  expect(track2Cue2.startTime).toBe(4);
  expect(track2Cue2.endTime).toBe(6.5);
  expect(track2Cue2.text).toBe('Tá súil agam gur féidir leat é a léamh ...');

  expect(track2Cue3.startTime).toBe(6.7);
  expect(track2Cue3.endTime).toBe(9);
  expect(track2Cue3.text).toBe('... mar gheall ar shlí eile ciallaíonn sé sin nach n-oibríonn sé seo');

  await video.evaluate((videoElement: HTMLVideoElement) => {
    // Scrub the video to a point where a cue should be active
    videoElement.currentTime = 2;
  });

  await expect.poll(() => video.evaluate((videoElement: HTMLVideoElement) => (videoElement.textTracks[1].activeCues?.[0] as VTTCue)?.text)).toBe("Seo roinnt téacs fotheidil");
});
