// The areas Oasis supports. Each has a name and a centre point [longitude, latitude].
export const districts = [
  { id: 'corniche', name: 'Abu Dhabi – Corniche', center: [54.344, 24.473] },
  { id: 'reem', name: 'Abu Dhabi – Al Reem Island', center: [54.404, 24.4965] },
  { id: 'saadiyat', name: 'Abu Dhabi – Saadiyat Cultural District', center: [54.3984, 24.5336] },
  { id: 'yas', name: 'Abu Dhabi – Yas Island', center: [54.6078, 24.4886] },
  { id: 'marina', name: 'Dubai – Dubai Marina', center: [55.1403, 25.0805] },
  { id: 'downtown', name: 'Dubai – Downtown', center: [55.2744, 25.1972] },
  { id: 'school', name: 'Abu Dhabi – Our School Area', center: [54.5413, 24.3437] }, // plus code 8GVR+FG
];

// Each district is a square about 900 m from its centre in every direction.
const SIZE = 0.008;

// Returns the square box (west, south, east, north edges) around a district.
export function boxOf(d) {
  const [lng, lat] = d.center;
  return { west: lng - SIZE, south: lat - SIZE, east: lng + SIZE, north: lat + SIZE };
}

// Given where you are, find the district you're standing in (or nothing).
export function findDistrict(lng, lat) {
  return districts.find((d) => {
    if (!d.center) return false;
    const b = boxOf(d);
    return lng >= b.west && lng <= b.east && lat >= b.south && lat <= b.north;
  });
}
