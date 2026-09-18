// Load both WebGL and its styles only when a map approaches the viewport.
export function loadMapbox() {
  return Promise.all([
    import('mapbox-gl'),
    import('mapbox-gl/dist/mapbox-gl.css'),
  ]).then(([mapbox]) => mapbox);
}
