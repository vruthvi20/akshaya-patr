// DEMO DATA: the areas are real UAE places, but the business names are made up.
// pos = [longitude, latitude] on the map.

export const donors = [
  { id: 'd1', name: 'Spice Route Restaurant', type: 'Restaurant', area: 'Khalidiya, Abu Dhabi', pos: [54.35, 24.47] },
  { id: 'd2', name: 'Golden Crust Bakery', type: 'Bakery', area: 'Al Karama, Dubai', pos: [55.302, 25.245] },
  { id: 'd3', name: 'Royal Pearl Banquet Hall', type: 'Events', area: 'Khalifa City, Abu Dhabi', pos: [54.575, 24.42] },
  { id: 'd4', name: 'Al Noor Grill House', type: 'Restaurant', area: 'Deira, Dubai', pos: [55.32, 25.27] },
  { id: 'd5', name: 'Green Leaf Café', type: 'Café', area: 'Dubai Marina', pos: [55.14, 25.08] },
];

// Each camp decides what it can't accept and what food it prefers.
export const camps = [
  { id: 'c1', name: 'Mussafah Workers Village', area: 'Mussafah, Abu Dhabi', pos: [54.505, 24.335], workers: 420, cantAccept: ['beef', 'pork'], halalOnly: false, prefers: ['Indian'] },
  { id: 'c2', name: 'Mafraq Workers City', area: 'Mafraq, Abu Dhabi', pos: [54.62, 24.3], workers: 650, cantAccept: ['pork'], halalOnly: true, prefers: ['Pakistani', 'Bangladeshi'] },
  { id: 'c3', name: 'Sonapur Labour Accommodation', area: 'Muhaisnah, Dubai', pos: [55.425, 25.265], workers: 800, cantAccept: ['beef', 'pork'], halalOnly: false, prefers: ['Indian', 'Nepali'] },
  { id: 'c4', name: 'Al Quoz Workers Residence', area: 'Al Quoz, Dubai', pos: [55.235, 25.135], workers: 300, cantAccept: ['pork'], halalOnly: true, prefers: ['Pakistani'] },
  { id: 'c5', name: 'Jebel Ali Staff Camp', area: 'Jebel Ali, Dubai', pos: [55.12, 25.0], workers: 250, cantAccept: [], halalOnly: false, prefers: ['Filipino'] },
];

export const volunteers = [
  { id: 'v1', name: 'Ahmed K.', area: 'Abu Dhabi', pos: [54.37, 24.45] },
  { id: 'v2', name: 'Priya S.', area: 'Abu Dhabi', pos: [54.55, 24.4] },
  { id: 'v3', name: 'Rahul M.', area: 'Dubai', pos: [55.28, 25.2] },
  { id: 'v4', name: 'Fatima A.', area: 'Dubai', pos: [55.33, 25.25] },
  { id: 'v5', name: 'John D.', area: 'Dubai', pos: [55.15, 25.07] },
];

export const CUISINES = ['Indian', 'Pakistani', 'Bangladeshi', 'Nepali', 'Filipino', 'Arabic', 'Continental'];
export const INGREDIENTS = ['beef', 'pork', 'chicken', 'mutton', 'fish', 'egg'];

// Starting donations. Times are "hours ago", so the demo always looks fresh.
export function seedDonations() {
  const ago = (h) => Date.now() - h * 3600e3;
  return [
    { id: 'n1', donor: 'd1', food: 'Veg biryani', portions: 40, cuisine: 'Indian', contains: [], halal: true, cookedAt: ago(1), status: 'available' },
    { id: 'n2', donor: 'd2', food: 'Bread & buns', portions: 60, cuisine: 'Continental', contains: ['egg'], halal: true, cookedAt: ago(2), status: 'available' },
    { id: 'n3', donor: 'd3', food: 'Mutton curry & rice (wedding)', portions: 120, cuisine: 'Indian', contains: ['mutton'], halal: true, cookedAt: ago(0.5), status: 'available' },
    { id: 'n4', donor: 'd4', food: 'Beef shawarma', portions: 25, cuisine: 'Arabic', contains: ['beef'], halal: true, cookedAt: ago(1.5), status: 'available' },
    { id: 'n7', donor: 'd3', food: 'Paneer butter masala & naan', portions: 80, cuisine: 'Indian', contains: [], halal: true, cookedAt: ago(1), status: 'requested', camp: 'c1', mode: 'volunteer' },
    { id: 'n5', donor: 'd5', food: 'Chicken pasta', portions: 15, cuisine: 'Continental', contains: ['chicken'], halal: true, cookedAt: ago(1), status: 'delivered', camp: 'c5', mode: 'volunteer', volunteer: 'v5' },
    { id: 'n6', donor: 'd1', food: 'Dal & chapati', portions: 50, cuisine: 'Indian', contains: [], halal: true, cookedAt: ago(3), status: 'delivered', camp: 'c1', mode: 'camp' },
  ];
}
