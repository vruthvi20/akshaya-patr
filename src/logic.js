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

// WATER: litres of water needed to grow/produce 1 kg of each food (rough world averages).
// Plain rice, bread, dal and vegetables ≈ 1,500 L/kg. Meat needs far more (animals eat crops and drink water).
const WATER_PER_KG = { base: 1500, beef: 15400, mutton: 10400, pork: 6000, chicken: 4300, egg: 3300, fish: 2000 };

// Water used by one donation: about 1/3 of a meat dish is meat, the rest is rice/bread/vegetables.
function waterLitres(d) {
  const kg = d.portions * 0.4;
  const meat = Math.max(0, ...d.contains.map((i) => WATER_PER_KG[i] || 0));
  return meat ? kg * (0.7 * WATER_PER_KG.base + 0.3 * meat) : kg * WATER_PER_KG.base;
}

// IMPACT: 1 portion ≈ 0.4 kg of food; 1 kg of wasted food ≈ 2.5 kg CO₂ (estimate).
// Saving food also saves all the water used to grow it.
export function impact(donations) {
  const delivered = donations.filter((d) => d.status === 'delivered');
  const meals = delivered.reduce((sum, d) => sum + d.portions, 0);
  const kg = meals * 0.4;
  const water = delivered.reduce((sum, d) => sum + waterLitres(d), 0);
  return { meals, kg: Math.round(kg), co2: Math.round(kg * 2.5), water: Math.round(water) };
}
