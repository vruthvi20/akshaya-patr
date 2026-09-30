// DEMO DATA: the areas are real UAE places, but the business and people names are made up.
// pos = [longitude, latitude] on the map.

export const donors = [
  { id: 'd1', name: 'Spice Route Restaurant', type: 'Restaurant', area: 'Khalidiya, Abu Dhabi', pos: [54.35, 24.47] },
  { id: 'd2', name: 'Golden Crust Bakery', type: 'Bakery', area: 'Al Karama, Dubai', pos: [55.302, 25.245] },
  { id: 'd3', name: 'Royal Pearl Banquet Hall', type: 'Events', area: 'Khalifa City, Abu Dhabi', pos: [54.575, 24.42] },
  { id: 'd4', name: 'Al Noor Grill House', type: 'Restaurant', area: 'Deira, Dubai', pos: [55.32, 25.27] },
  { id: 'd5', name: 'Green Leaf Café', type: 'Café', area: 'Dubai Marina', pos: [55.14, 25.08] },
  { id: 'd6', name: 'Taste of Kerala', type: 'Restaurant', area: 'Mussafah, Abu Dhabi', pos: [54.49, 24.352] },
  { id: 'd7', name: 'Lahore Darbar', type: 'Restaurant', area: 'Al Nahda, Sharjah', pos: [55.372, 25.302] },
  { id: 'd8', name: 'Manila Kitchen', type: 'Restaurant', area: 'Al Satwa, Dubai', pos: [55.27, 25.225] },
  { id: 'd9', name: 'Crescent Wedding Hall', type: 'Events', area: 'Al Qusais, Dubai', pos: [55.385, 25.28] },
  { id: 'd10', name: 'Sunrise Bakery', type: 'Bakery', area: 'Mohammed Bin Zayed City, Abu Dhabi', pos: [54.54, 24.345] },
  { id: 'd11', name: 'Dhaka Spice House', type: 'Restaurant', area: 'Rolla, Sharjah', pos: [55.39, 25.357] },
  { id: 'd12', name: 'Everest Momo Point', type: 'Restaurant', area: 'Al Barsha, Dubai', pos: [55.2, 25.11] },
  { id: 'd13', name: 'City Office Canteen', type: 'Canteen', area: 'Business Bay, Dubai', pos: [55.27, 25.185] },
  { id: 'd14', name: 'Blue Lagoon Hotel Buffet', type: 'Hotel', area: 'Corniche, Abu Dhabi', pos: [54.33, 24.48] },
  { id: 'd15', name: 'Al Reef Caterers', type: 'Events', area: 'Mafraq, Abu Dhabi', pos: [54.64, 24.285] },
  { id: 'd16', name: 'Veg Delight Kitchen', type: 'Restaurant', area: 'Al Nahyan, Abu Dhabi', pos: [54.385, 24.462] },
  { id: 'd17', name: 'Yas Events Catering', type: 'Events', area: 'Yas Island, Abu Dhabi', pos: [54.605, 24.49] },
  { id: 'd18', name: 'Reem Island Bistro', type: 'Café', area: 'Al Reem Island, Abu Dhabi', pos: [54.404, 24.497] },
  { id: 'd19', name: 'Baniyas Family Restaurant', type: 'Restaurant', area: 'Baniyas, Abu Dhabi', pos: [54.64, 24.31] },
  { id: 'd20', name: 'Karachi Grill', type: 'Restaurant', area: 'Al Shamkha, Abu Dhabi', pos: [54.7, 24.38] },
  { id: 'd21', name: 'Palm Sands Hotel Buffet', type: 'Hotel', area: 'Palm Jumeirah, Dubai', pos: [55.135, 25.115] },
  { id: 'd22', name: 'Oasis Fresh Bakery', type: 'Bakery', area: 'Dubai Silicon Oasis', pos: [55.38, 25.12] },
  { id: 'd23', name: 'Mirdif Party Hall', type: 'Events', area: 'Mirdif, Dubai', pos: [55.42, 25.22] },
  { id: 'd24', name: 'International City Kitchen', type: 'Restaurant', area: 'International City, Dubai', pos: [55.41, 25.165] },
  { id: 'd25', name: 'Boulevard Food Court', type: 'Food court', area: 'Downtown Dubai', pos: [55.275, 25.197] },
];

// Each camp decides what it can't accept and what food it prefers.
export const camps = [
  { id: 'c1', name: 'Mussafah Workers Village', area: 'Mussafah, Abu Dhabi', pos: [54.505, 24.335], workers: 420, cantAccept: ['beef', 'pork'], halalOnly: false, prefers: ['Indian'] },
  { id: 'c2', name: 'Mafraq Workers City', area: 'Mafraq, Abu Dhabi', pos: [54.62, 24.3], workers: 650, cantAccept: ['pork'], halalOnly: true, prefers: ['Pakistani', 'Bangladeshi'] },
  { id: 'c3', name: 'Sonapur Labour Accommodation', area: 'Muhaisnah, Dubai', pos: [55.425, 25.265], workers: 800, cantAccept: ['beef', 'pork'], halalOnly: false, prefers: ['Indian', 'Nepali'] },
  { id: 'c4', name: 'Al Quoz Workers Residence', area: 'Al Quoz, Dubai', pos: [55.235, 25.135], workers: 300, cantAccept: ['pork'], halalOnly: true, prefers: ['Pakistani'] },
  { id: 'c5', name: 'Jebel Ali Staff Camp', area: 'Jebel Ali, Dubai', pos: [55.12, 25.0], workers: 250, cantAccept: [], halalOnly: false, prefers: ['Filipino'] },
  { id: 'c6', name: 'Industrial City Workers Housing', area: 'ICAD, Abu Dhabi', pos: [54.53, 24.32], workers: 900, cantAccept: ['pork'], halalOnly: true, prefers: ['Bangladeshi'] },
  { id: 'c7', name: 'Al Sajaa Workers Camp', area: 'Al Sajaa, Sharjah', pos: [55.63, 25.33], workers: 500, cantAccept: ['beef', 'pork'], halalOnly: false, prefers: ['Indian', 'Nepali'] },
  { id: 'c8', name: 'DIP Staff Accommodation', area: 'Dubai Investments Park', pos: [55.16, 24.98], workers: 350, cantAccept: ['pork'], halalOnly: false, prefers: ['Indian', 'Filipino'] },
  { id: 'c9', name: 'Muhaisnah Staff Housing', area: 'Muhaisnah 2, Dubai', pos: [55.41, 25.25], workers: 600, cantAccept: ['beef'], halalOnly: false, prefers: ['Nepali', 'Indian'] },
  { id: 'c10', name: 'Al Wathba Labour Camp', area: 'Al Wathba, Abu Dhabi', pos: [54.62, 24.25], workers: 300, cantAccept: ['pork'], halalOnly: true, prefers: ['Pakistani'] },
  { id: 'c11', name: 'Al Quoz Industrial Camp', area: 'Al Quoz Industrial 4, Dubai', pos: [55.25, 25.12], workers: 280, cantAccept: ['beef'], halalOnly: false, prefers: ['Sri Lankan', 'Indian'] },
  { id: 'c12', name: 'Sharjah Industrial Workers Camp', area: 'Industrial Area 10, Sharjah', pos: [55.43, 25.3], workers: 420, cantAccept: ['pork'], halalOnly: true, prefers: ['Bangladeshi', 'Pakistani'] },
  { id: 'c13', name: 'Baniyas Workers Residence', area: 'Baniyas, Abu Dhabi', pos: [54.65, 24.3], workers: 380, cantAccept: ['beef', 'pork'], halalOnly: false, prefers: ['Indian', 'Sri Lankan'] },
  { id: 'c14', name: 'Al Shahama Labour Camp', area: 'Al Shahama, Abu Dhabi', pos: [54.69, 24.54], workers: 260, cantAccept: ['pork'], halalOnly: true, prefers: ['Pakistani', 'Arabic'] },
  { id: 'c15', name: 'Mussafah M-40 Workers Camp', area: 'Mussafah, Abu Dhabi', pos: [54.52, 24.36], workers: 520, cantAccept: [], halalOnly: false, prefers: ['Filipino', 'Indian'] },
  { id: 'c16', name: 'Al Qusais Industrial Camp', area: 'Al Qusais, Dubai', pos: [55.395, 25.29], workers: 470, cantAccept: ['pork'], halalOnly: true, prefers: ['Bangladeshi'] },
  { id: 'c17', name: 'Jebel Ali Industrial Workers Village', area: 'Jebel Ali Industrial, Dubai', pos: [55.09, 25.03], workers: 700, cantAccept: ['beef', 'pork'], halalOnly: false, prefers: ['Indian', 'Nepali'] },
  { id: 'c18', name: 'Warsan Workers Housing', area: 'Warsan, Dubai', pos: [55.41, 25.16], workers: 540, cantAccept: ['pork'], halalOnly: false, prefers: ['Pakistani', 'Indian'] },
  { id: 'c19', name: 'Ras Al Khor Staff Camp', area: 'Ras Al Khor, Dubai', pos: [55.35, 25.18], workers: 310, cantAccept: ['beef'], halalOnly: false, prefers: ['Sri Lankan', 'Nepali'] },
];

export const volunteers = [
  { id: 'v1', name: 'Ahmed K.', area: 'Abu Dhabi', pos: [54.37, 24.45] },
  { id: 'v2', name: 'Priya S.', area: 'Abu Dhabi', pos: [54.55, 24.4] },
  { id: 'v3', name: 'Rahul M.', area: 'Dubai', pos: [55.28, 25.2] },
  { id: 'v4', name: 'Fatima A.', area: 'Dubai', pos: [55.33, 25.25] },
  { id: 'v5', name: 'John D.', area: 'Dubai', pos: [55.15, 25.07] },
  { id: 'v6', name: 'Meera N.', area: 'Abu Dhabi', pos: [54.5, 24.36] },
  { id: 'v7', name: 'Omar H.', area: 'Sharjah', pos: [55.4, 25.33] },
  { id: 'v8', name: 'Anjali R.', area: 'Dubai', pos: [55.22, 25.12] },
  { id: 'v9', name: 'Joseph T.', area: 'Abu Dhabi', pos: [54.6, 24.3] },
  { id: 'v10', name: 'Sara M.', area: 'Dubai', pos: [55.37, 25.27] },
  { id: 'v11', name: 'Arjun P.', area: 'Sharjah', pos: [55.45, 25.31] },
  { id: 'v12', name: 'Aisha B.', area: 'Abu Dhabi', pos: [54.39, 24.47] },
  { id: 'v13', name: 'Kevin L.', area: 'Dubai', pos: [55.17, 25.0] },
  { id: 'v14', name: 'Nadia F.', area: 'Sharjah', pos: [55.38, 25.35] },
  { id: 'v15', name: 'Vikram S.', area: 'Abu Dhabi', pos: [54.52, 24.33] },
  { id: 'v16', name: 'Hamdan R.', area: 'Abu Dhabi', pos: [54.62, 24.44] },
  { id: 'v17', name: 'Lakshmi V.', area: 'Abu Dhabi', pos: [54.4, 24.49] },
  { id: 'v18', name: 'Yusuf A.', area: 'Abu Dhabi', pos: [54.66, 24.32] },
  { id: 'v19', name: 'Grace P.', area: 'Abu Dhabi', pos: [54.51, 24.34] },
  { id: 'v20', name: 'Rohan D.', area: 'Dubai', pos: [55.39, 25.12] },
  { id: 'v21', name: 'Mariam K.', area: 'Dubai', pos: [55.42, 25.22] },
  { id: 'v22', name: 'Daniel C.', area: 'Dubai', pos: [55.14, 25.11] },
  { id: 'v23', name: 'Sneha J.', area: 'Dubai', pos: [55.27, 25.19] },
];

export const CUISINES = ['Indian', 'Pakistani', 'Bangladeshi', 'Nepali', 'Sri Lankan', 'Filipino', 'Arabic', 'Continental'];
export const INGREDIENTS = ['beef', 'pork', 'chicken', 'mutton', 'fish', 'egg'];

// Starting donations. Times are "hours ago", so the demo always looks fresh.
export function seedDonations() {
  const ago = (h) => Date.now() - h * 3600e3;
  // Shortcut: food(id, donor, name, portions, cuisine, contains, halal, hoursAgo, extra status info)
  const food = (id, donor, name, portions, cuisine, contains, halal, h, extra = {}) => ({
    id, donor, food: name, portions, cuisine, contains, halal, cookedAt: ago(h), status: 'available', ...extra,
  });
  return [
    // --- Available now ---
    food('n1', 'd1', 'Veg biryani', 40, 'Indian', [], true, 1),
    food('n2', 'd2', 'Bread & buns', 60, 'Continental', ['egg'], true, 2),
    food('n3', 'd3', 'Mutton curry & rice (wedding)', 120, 'Indian', ['mutton'], true, 0.5),
    food('n4', 'd4', 'Beef shawarma', 25, 'Arabic', ['beef'], true, 1.5),
    food('n8', 'd6', 'Kerala fish curry & rice', 45, 'Indian', ['fish'], true, 0.7),
    food('n9', 'd6', 'Sambar, rice & poriyal', 60, 'Indian', [], true, 1.2),
    food('n10', 'd7', 'Chicken karahi & naan', 50, 'Pakistani', ['chicken'], true, 0.8),
    food('n11', 'd8', 'Pork adobo & rice', 30, 'Filipino', ['pork'], false, 1),
    food('n12', 'd8', 'Chicken pancit', 35, 'Filipino', ['chicken'], true, 1.5),
    food('n13', 'd9', 'Chicken biryani (wedding leftovers)', 200, 'Pakistani', ['chicken'], true, 0.3),
    food('n14', 'd10', 'Khubz & croissants', 80, 'Arabic', ['egg'], true, 2.5),
    food('n15', 'd11', 'Beef bhuna & rice', 40, 'Bangladeshi', ['beef'], true, 1),
    food('n16', 'd11', 'Dal, rice & egg curry', 55, 'Bangladeshi', ['egg'], true, 0.6),
    food('n17', 'd12', 'Veg momos', 70, 'Nepali', [], true, 0.4),
    food('n18', 'd12', 'Chicken thukpa', 30, 'Nepali', ['chicken'], true, 1.8),
    food('n19', 'd13', 'Pasta & salad (office lunch)', 45, 'Continental', ['chicken'], true, 2),
    food('n20', 'd14', 'Hotel buffet: rice, curries, dessert', 150, 'Continental', ['chicken', 'fish'], true, 1.1),
    food('n21', 'd15', 'Mutton mandi (event)', 90, 'Arabic', ['mutton'], true, 0.9),
    food('n22', 'd15', 'Veg pulao & raita', 70, 'Indian', [], true, 1.4),
    food('n23', 'd5', 'Sandwiches & wraps', 25, 'Continental', ['chicken', 'egg'], true, 3),
    food('n24', 'd10', 'Old pastries (too old)', 40, 'Continental', ['egg'], true, 5), // shows the food-safety filter
    food('n25', 'd9', 'Paneer tikka masala & roti', 110, 'Indian', [], true, 0.5),
    food('n35', 'd16', 'Veg thali', 55, 'Indian', [], true, 0.6),
    food('n36', 'd17', 'Conference lunch buffet', 160, 'Continental', ['chicken', 'fish'], true, 1),
    food('n37', 'd18', 'Grilled chicken & rice', 35, 'Arabic', ['chicken'], true, 1.3),
    food('n38', 'd19', 'Mutton biryani', 70, 'Indian', ['mutton'], true, 0.8),
    food('n39', 'd20', 'Seekh kebab & naan', 45, 'Pakistani', ['mutton'], true, 1.1),
    food('n40', 'd21', 'Brunch buffet leftovers', 120, 'Continental', ['egg', 'fish', 'chicken'], true, 1.6),
    food('n41', 'd22', 'Bread loaves & rolls', 90, 'Continental', [], true, 2.2),
    food('n42', 'd23', 'Chicken biryani (birthday party)', 85, 'Indian', ['chicken'], true, 0.4),
    food('n43', 'd24', 'Egg fried rice', 50, 'Continental', ['egg'], true, 1),
    food('n44', 'd25', 'Falafel & hummus', 60, 'Arabic', [], true, 0.9),
    food('n45', 'd25', 'Beef burgers', 30, 'Continental', ['beef'], true, 1.2),
    food('n46', 'd23', 'Veg pulao', 60, 'Indian', [], true, 0.5),

    // --- In progress ---
    food('n7', 'd3', 'Paneer butter masala & naan', 80, 'Indian', [], true, 1, { status: 'requested', camp: 'c1', mode: 'volunteer' }),
    food('n26', 'd4', 'Chicken shawarma plates', 60, 'Arabic', ['chicken'], true, 0.8, { status: 'requested', camp: 'c12', mode: 'volunteer' }),
    food('n27', 'd12', 'Veg fried rice', 40, 'Nepali', [], true, 1, { status: 'assigned', camp: 'c9', mode: 'volunteer', volunteer: 'v10' }),
    food('n28', 'd7', 'Chana masala & paratha', 65, 'Pakistani', [], true, 1.3, { status: 'requested', camp: 'c3', mode: 'paid', fee: 23 }),
    food('n29', 'd14', 'Grilled fish & rice', 50, 'Arabic', ['fish'], true, 0.9, { status: 'picked', camp: 'c10', mode: 'camp' }),
    food('n49', 'd19', 'Chicken curry & rice', 55, 'Indian', ['chicken'], true, 0.7, { status: 'requested', camp: 'c13', mode: 'volunteer' }),
    food('n50', 'd22', 'Egg sandwiches', 40, 'Continental', ['egg'], true, 1.1, { status: 'requested', camp: 'c18', mode: 'volunteer' }),
    food('n47', 'd17', 'Gala dinner leftovers', 220, 'Continental', ['chicken'], true, 3, { status: 'delivered', camp: 'c15', mode: 'volunteer', volunteer: 'v19' }),
    food('n48', 'd21', 'Breakfast buffet', 100, 'Continental', ['egg'], true, 3.3, { status: 'delivered', camp: 'c19', mode: 'camp' }),

    // --- Already delivered (fills the impact counter) ---
    food('n5', 'd5', 'Chicken pasta', 15, 'Continental', ['chicken'], true, 1, { status: 'delivered', camp: 'c5', mode: 'volunteer', volunteer: 'v5' }),
    food('n6', 'd1', 'Dal & chapati', 50, 'Indian', [], true, 3, { status: 'delivered', camp: 'c1', mode: 'camp' }),
    food('n30', 'd9', 'Mutton biryani (wedding)', 180, 'Pakistani', ['mutton'], true, 3.5, { status: 'delivered', camp: 'c12', mode: 'paid', fee: 18 }),
    food('n31', 'd6', 'Idli, vada & sambar', 90, 'Indian', ['egg'], true, 3.2, { status: 'delivered', camp: 'c6', mode: 'volunteer', volunteer: 'v6' }),
    food('n32', 'd8', 'Chicken adobo & rice', 40, 'Filipino', ['chicken'], true, 2.8, { status: 'delivered', camp: 'c8', mode: 'volunteer', volunteer: 'v13' }),
    food('n33', 'd11', 'Fish curry & rice', 75, 'Bangladeshi', ['fish'], true, 3.4, { status: 'delivered', camp: 'c12', mode: 'camp' }),
    food('n34', 'd3', 'Veg thali (event)', 140, 'Indian', [], true, 3.6, { status: 'delivered', camp: 'c2', mode: 'volunteer', volunteer: 'v9' }),
  ];
}
