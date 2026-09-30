// Run once with:  node scripts/fetch-buildings.mjs
// Downloads every district's buildings from OpenStreetMap and saves them in public/data/,
// so the app works even if the free map-data server is busy on demo day.
import { writeFileSync, existsSync } from 'node:fs';
import { districts, boxOf } from '../src/districts.js';

const SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

async function download(box) {
  const query = `[out:json][timeout:90];way["building"](${box.south},${box.west},${box.north},${box.east});out geom;`;
  for (let attempt = 0; attempt < 6; attempt++) {
    for (const url of SERVERS) {
      try {
        const res = await fetch(url, { method: 'POST', body: new URLSearchParams({ data: query }) });
        if (res.ok) return (await res.json()).elements;
      } catch {}
    }
    await new Promise((r) => setTimeout(r, 15000)); // wait, then try again
  }
  throw new Error('All servers busy');
}

for (const d of districts) {
  if (existsSync(`public/data/${d.id}.json`)) continue; // already saved
  const elements = await download(boxOf(d));
  // Keep only what we need: number, name, height info and outline.
  const slim = elements
    .filter((e) => e.geometry && e.geometry.length > 3)
    .map((e) => ({
      id: e.id,
      name: e.tags?.name || '',
      height: e.tags?.height || '',
      levels: e.tags?.['building:levels'] || '',
      outline: e.geometry.map((p) => [+p.lon.toFixed(6), +p.lat.toFixed(6)]),
    }));
  writeFileSync(`public/data/${d.id}.json`, JSON.stringify(slim));
  console.log(`${d.name}: ${slim.length} buildings`);
}
