// Get today's hourly temperature and humidity from Open-Meteo (free, no login).
export async function getWeather(lng, lat) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&hourly=temperature_2m,relative_humidity_2m&timezone=Asia%2FDubai&forecast_days=1`;
  const data = await (await fetch(url)).json();
  return data.hourly; // lists of 24 values, one per hour
}

// Wet-bulb temperature (Stull's formula): mixes heat + humidity.
// Humid air stops sweat drying, so your body can't cool down.
export function wetBulb(T, RH) {
  return (
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035
  );
}

// Turn the wet-bulb number into a traffic-light level.
export function riskLevel(tw) {
  if (tw < 25) return { emoji: '🟢', label: 'Low', color: '#2e9e5b', tip: 'Enjoy — still carry water.' };
  if (tw < 28) return { emoji: '🟡', label: 'Caution', color: '#d4a106', tip: 'Drink water every 30 min.' };
  if (tw < 31) return { emoji: '🟠', label: 'High', color: '#e0701b', tip: 'Take the shady route and rest in cool spots.' };
  return { emoji: '🔴', label: 'Danger', color: '#d33a2c', tip: 'Avoid going out. If you must, stay in shade and drink often.' };
}
