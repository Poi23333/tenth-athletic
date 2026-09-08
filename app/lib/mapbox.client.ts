// Keep the WebGL implementation out of the Oxygen server bundle.
export function loadMapbox() {
  return import('mapbox-gl');
}
