// THE MAP: background map, coloured dots for everyone, the trip line, and the "join" pin.
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { donors, camps, volunteers } from '../data/demo-data.js';
import { t } from '../i18n/translations.js';
import { state, byId, $ } from '../state.js';

// Free map backgrounds from OpenFreeMap (no login needed): one light, one dark.
const MAP_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};

// Tell the map where its background worker file is (copied there by scripts/copy-map-worker.mjs).
maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

export const map = new maplibregl.Map({
  container: 'map',
  style: MAP_STYLES[state.theme],
  // Start zoomed so every donor, camp and volunteer fits on screen (works on phones too).
  bounds: [...donors, ...camps, ...volunteers].reduce((b, p) => b.extend(p.pos), new maplibregl.LngLatBounds(donors[0].pos, donors[0].pos)),
  fitBoundsOptions: { padding: 30 },
});

export const setMapTheme = (theme) => map.setStyle(MAP_STYLES[theme]);

// ---------- DOTS ----------
// A lettered dot for every donor (D), camp (C) and volunteer (V).
// drawPins() clears and redraws them, so people who just joined show up too.
let pins = [];
export function drawPins() {
  pins.forEach((m) => m.remove());
  pins = [];
  for (const [list, letter, kind] of [[donors, 'D', 'donor'], [camps, 'C', 'camp'], [volunteers, 'V', 'volunteer']]) {
    for (const p of list) {
      const el = document.createElement('div');
      el.className = `pin ${kind}`;
      el.textContent = letter;
      const popup = new maplibregl.Popup({ offset: 14 }).setText(`${p.name} (${p.area})`);
      pins.push(new maplibregl.Marker({ element: el }).setLngLat(p.pos).setPopup(popup).addTo(map));
    }
  }
}

// ---------- JOIN PIN ----------
// While joining, clicking the map (or picking an area) chooses your location: a red pin.
const joinPin = new maplibregl.Marker({ color: '#d32f2f' });
export function setJoinPos(pos, zoomIn = false) {
  state.joinPos = pos;
  joinPin.setLngLat(pos).addTo(map);
  if (zoomIn) map.flyTo({ center: pos, zoom: 13 });
  const label = $('joinLoc');
  if (label) label.textContent = `${t('locationSet')} ✓`;
}
export function clearJoinPin() {
  state.joinPos = null;
  joinPin.remove();
}
map.on('click', (e) => {
  if (state.role === 'join') setJoinPos([+e.lngLat.lng.toFixed(4), +e.lngLat.lat.toFixed(4)]);
});

// ---------- TRIP LINE ----------
// A dashed line from the donor to the camp for the donation you click.
// It's re-added every time the map style changes (light ↔ dark).
const line = (coords) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } });
let tripCoords = [];
map.on('style.load', () => {
  map.addSource('trip', { type: 'geojson', data: line(tripCoords) });
  map.addLayer({ id: 'trip', type: 'line', source: 'trip', paint: { 'line-color': '#ea580c', 'line-width': 4, 'line-dasharray': [2, 1] } });
});

export function showTrip(d) {
  const from = byId(donors, d.donor).pos;
  const campId = d.camp || (state.role === 'camp' ? state.who : null);
  if (!campId) return map.flyTo({ center: from, zoom: 12 });
  const to = byId(camps, campId).pos;
  tripCoords = [from, to];
  map.getSource('trip')?.setData(line(tripCoords));
  map.fitBounds(new maplibregl.LngLatBounds(from, from).extend(to), { padding: 80, maxZoom: 13 });
}
