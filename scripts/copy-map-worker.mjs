// The map library does its heavy work in a background "worker" file.
// Building the app doesn't include that file, so we copy it into public/ ourselves.
// This runs automatically before `npm run dev` and `npm run build`.
import { cpSync, mkdirSync } from 'node:fs';

const from = 'node_modules/maplibre-gl/dist/';
const to = 'public/maplibre/';
mkdirSync(to, { recursive: true });
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) cpSync(from + file, to + file);
console.log('Copied map worker files to public/maplibre/');
