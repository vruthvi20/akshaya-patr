import { heightFixes } from './heights.js';

const FLOOR = 3.2; // one floor is about 3.2 metres tall
const DEFAULT = 10; // if we know nothing, guess 10 m (about 3 floors)

// Load a district's buildings from our saved file (made by scripts/fetch-buildings.mjs).
export async function loadBuildings(district) {
  const list = await (await fetch(`/data/${district.id}.json`)).json();

  // Turn each building into a map shape (GeoJSON) with a height.
  const features = list.map((b) => ({
    type: 'Feature',
    properties: { id: b.id, name: b.name, height: guessHeight(b), fixed: b.id in heightFixes },
    geometry: { type: 'Polygon', coordinates: [b.outline] },
  }));
  return { type: 'FeatureCollection', features };
}

// Best height we can find: our hand fix > real height > floors × 3.2 m > default guess.
function guessHeight(b) {
  if (b.id in heightFixes) return heightFixes[b.id];
  if (b.height) return parseFloat(b.height) || DEFAULT;
  if (b.levels) return parseFloat(b.levels) * FLOOR || DEFAULT;
  return DEFAULT;
}
