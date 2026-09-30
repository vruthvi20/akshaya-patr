import * as SunCalc from 'suncalc';

const METRES_PER_DEGREE = 111320; // 1 degree of latitude ≈ 111 km
const MAX_SHADOW = 600; // stop shadows getting silly-long at sunrise/sunset

// Where is the sun? altitude = how high (0 = horizon), azimuth = which direction.
export function sunAt(date, lng, lat) {
  return SunCalc.getPosition(date, lat, lng);
}

// Make a shadow shape for every building.
export function makeShadows(buildings, sun) {
  if (sun.altitude <= 0) return { type: 'FeatureCollection', features: [] }; // night: no sun

  const features = buildings.features.map((b) => {
    // THE KEY MATHS: shadow length = height ÷ tan(sun altitude)
    const length = Math.min(b.properties.height / Math.tan(sun.altitude), MAX_SHADOW);

    // Shadows point AWAY from the sun. SunCalc measures azimuth from south, turning west.
    const east = Math.sin(sun.azimuth) * length;
    const north = Math.cos(sun.azimuth) * length;

    // Convert metres to map degrees.
    const ring = b.geometry.coordinates[0];
    const lat = ring[0][1];
    const dLng = east / (METRES_PER_DEGREE * Math.cos((lat * Math.PI) / 180));
    const dLat = north / METRES_PER_DEGREE;

    // Slide the building's outline along the shadow direction,
    // then wrap the old + moved outline together = the shadow on the ground.
    const moved = ring.map(([x, y]) => [x + dLng, y + dLat]);
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [wrap([...ring, ...moved])] },
    };
  });
  return { type: 'FeatureCollection', features };
}

// "Convex hull": the shape you'd get by stretching a rubber band around all the points.
function wrap(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const pt of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) lower.pop();
    lower.push(pt);
  }
  const upper = [];
  for (const pt of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) upper.pop();
    upper.push(pt);
  }
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  hull.push(hull[0]); // close the shape
  return hull;
}
