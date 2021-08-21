// Enumerates states that the hover player's overlay can be in
export enum OverlayState {
  // Only the paused overlay is visible, if provided
  paused = 'paused',
  // Both the paused and loading overlays are visible, if provided
  loading = 'loading',
  // No overlays are visible
  playing = 'playing',
}
