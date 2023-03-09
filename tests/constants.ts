export const port = 8080;
export const baseURL = `http://localhost:${port}`;

export const mp4VideoSrc = '/assets/video.mp4';
export const mp4VideoSrcURL = new URL(mp4VideoSrc, baseURL).toString();
export const webmVideoSrc = '/assets/video.webm';
export const webmVideoSrcURL = new URL(webmVideoSrc, baseURL).toString();
export const thumbnailSrc = '/assets/thumbnail.jpg';

export const captionsSrc = '/assets/captions.vtt';
export const captionsSrcURL = new URL(captionsSrc, baseURL).toString();
export const gaelicSubtitlesSrc = '/assets/subtitles-ga.vtt';
export const gaelicSubtitlesSrcURL = new URL(gaelicSubtitlesSrc, baseURL).toString();
