// The "brain" rules of the app.

// FOOD SAFETY: cooked food left out for more than 4 hours isn't safe to share.
export const SAFE_HOURS = 4;
export const hoursOld = (d) => (Date.now() - d.cookedAt) / 3600e3;
export const isFresh = (d) => hoursOld(d) < SAFE_HOURS;

// MATCHING: does this food suit this camp?
export function suits(d, camp) {
  if (camp.halalOnly && !d.halal) return false; // camp needs halal only
  return !d.contains.some((i) => camp.cantAccept.includes(i)); // no forbidden ingredients
}
// Bonus star if it's a cuisine the camp prefers.
export const isGoodMatch = (d, camp) => camp.prefers.includes(d.cuisine);

// DISTANCE between two map points in km ("haversine" formula: distance on a round Earth).
export function km([lng1, lat1], [lng2, lat2]) {
  const R = 6371; // Earth's radius in km
  const rad = (x) => (x * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Camps only see food within this distance.
export const MAX_KM = 60;

// Paid delivery price: AED 10 + AED 2 per km.
export const deliveryFee = (k) => Math.round(10 + 2 * k);

// IMPACT: the same averages Too Good To Go uses for every 1 kg of food saved:
// about 2.7 kg of CO₂ and 810 litres of water that would have been wasted.
const KG_PER_PORTION = 0.4;
const CO2_PER_KG = 2.7;
const WATER_PER_KG = 810;

export function impact(donations) {
  const meals = donations.filter((d) => d.status === 'delivered').reduce((sum, d) => sum + d.portions, 0);
  const kg = meals * KG_PER_PORTION;
  return { meals, kg: Math.round(kg), co2: Math.round(kg * CO2_PER_KG), water: Math.round(kg * WATER_PER_KG) };
}
