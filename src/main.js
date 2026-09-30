import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import { districts, boxOf, findDistrict } from './districts.js';
import { loadBuildings } from './buildings.js';
import { sunAt, makeShadows } from './shade.js';
import { getWeather, wetBulb, riskLevel } from './heat.js';

// Grab the pieces of the page we need.
const $ = (id) => document.getElementById(id);
const select = $('district');
const slider = $('time');
const message = $('message');

// What the app is currently showing.
let current = null; // chosen district
let buildings = { type: 'FeatureCollection', features: [] };
let weather = null;

// 1. Create the map (free OpenFreeMap background, no login needed).
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [54.344, 24.473],
  zoom: 15,
  pitch: 50, // tilt so buildings look 3D
});

// 2. Fill the district dropdown.
for (const d of districts) select.add(new Option(d.name, d.id));

// 3. When the map is ready, add our shadow + building layers.
map.on('load', () => {
  // Hide the background map's own buildings so we only see ours.
  for (const layer of map.getStyle().layers) {
    if (layer.id.includes('building')) map.setLayoutProperty(layer.id, 'visibility', 'none');
  }
  map.addSource('shadows', { type: 'geojson', data: makeShadows(buildings, { altitude: 0 }) });
  map.addSource('buildings', { type: 'geojson', data: buildings });
  map.addLayer({
    id: 'shadows',
    type: 'fill',
    source: 'shadows',
    paint: { 'fill-color': '#1d3b8a', 'fill-opacity': 0.35 },
  });
  map.addLayer({
    id: 'buildings',
    type: 'fill-extrusion',
    source: 'buildings',
    paint: {
      'fill-extrusion-color': ['case', ['get', 'fixed'], '#f2c98a', '#e6dccb'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-opacity': 0.9,
    },
  });

  // Click a building to see its number + height (helps us hand-fix heights).
  map.on('click', 'buildings', (e) => {
    const p = e.features[0].properties;
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`Building #${p.id}<br>Height: ${Math.round(p.height)} m ${p.fixed ? '✅' : '(estimated)'}`)
      .addTo(map);
  });

  openDistrict(districts[0]);
});

// 4. Open a district: fly there, load its buildings and weather.
async function openDistrict(d) {
  if (!d.center) return showMessage("We're not in this area yet — but we're adding it soon! 🌴");
  current = d;
  select.value = d.id;
  map.flyTo({ center: d.center, zoom: 15 });
  showMessage('Loading buildings… ⏳');
  try {
    [buildings, weather] = await Promise.all([loadBuildings(boxOf(d)), getWeather(...d.center)]);
    map.getSource('buildings').setData(buildings);
    hideMessage();
  } catch {
    showMessage('Could not load the map data. Check your internet and try again.');
  }
  update();
}

// 5. Turn the slider's hour into a real date/time in UAE time (UTC+4).
function timeFromSlider() {
  const hour = Number(slider.value);
  const uae = new Date(Date.now() + 4 * 3600e3);
  const midnightUTC = Date.UTC(uae.getUTCFullYear(), uae.getUTCMonth(), uae.getUTCDate());
  return { hour, date: new Date(midnightUTC + (hour - 4) * 3600e3) };
}

// 6. Redraw shadows + heat meter for the chosen time.
function update() {
  const { hour, date } = timeFromSlider();
  const h = Math.floor(hour), m = Math.round((hour - h) * 60);
  $('timeLabel').textContent = `${h}:${String(m).padStart(2, '0')}`;
  if (!current) return;

  const sun = sunAt(date, ...current.center);
  map.getSource('shadows')?.setData(makeShadows(buildings, sun));

  if (weather) {
    const T = weather.temperature_2m[h];
    const RH = weather.relative_humidity_2m[h];
    const tw = wetBulb(T, RH);
    const risk = riskLevel(tw);
    $('heat').style.borderColor = risk.color;
    $('heat').innerHTML =
      `<strong>${risk.emoji} ${risk.label}</strong> · ${Math.round(T)}°C · ${RH}% humidity · wet-bulb ${tw.toFixed(1)}°C<br><small>${risk.tip}</small>`;
  }
}

// 7. Buttons and slider.
slider.addEventListener('input', update);
select.addEventListener('change', () => openDistrict(districts.find((d) => d.id === select.value)));

$('locate').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const d = findDistrict(pos.coords.longitude, pos.coords.latitude);
      if (d) openDistrict(d);
      else showMessage("You're not in one of our areas yet — but we're adding yours soon! 🌴 Pick a district to explore meanwhile.");
    },
    () => showMessage('Location is turned off. Pick a district from the list instead.')
  );
});

function showMessage(text) {
  message.textContent = text;
  message.hidden = false;
}
function hideMessage() {
  message.hidden = true;
}
