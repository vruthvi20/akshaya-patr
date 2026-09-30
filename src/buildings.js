import { heightFixes } from './heights.js';

const FLOOR = 3.2; // one floor is about 3.2 metres tall
const DEFAULT = 10; // if we know nothing, guess 10 m (about 3 floors)

// Ask OpenStreetMap (through the free Overpass API) for every building in the box.
export async function loadBuildings(box) {
  const query = `[out:json][timeout:60];way["building"](${box.south},${box.west},${box.north},${box.east});out geom;`;
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: new URLSearchParams({ data: query }),
  });
  const data = await res.json();

  // Turn each building into a map shape (GeoJSON) with a height.
  const features = data.elements
    .filter((e) => e.geometry && e.geometry.length > 3)
    .map((e) => ({
      type: 'Feature',
      properties: { id: e.id, height: guessHeight(e), fixed: e.id in heightFixes },
      geometry: { type: 'Polygon', coordinates: [e.geometry.map((p) => [p.lon, p.lat])] },
    }));
  return { type: 'FeatureCollection', features };
}

// Best height we can find: our hand fix > real height > floors × 3.2 m > default guess.
function guessHeight(e) {
  if (e.id in heightFixes) return heightFixes[e.id];
  const tags = e.tags || {};
  if (tags.height) return parseFloat(tags.height) || DEFAULT;
  if (tags['building:levels']) return parseFloat(tags['building:levels']) * FLOOR || DEFAULT;
  return DEFAULT;
}
