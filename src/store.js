import { seedDonations } from './data.js';

// All donations are saved in the browser. When one window changes them,
// the browser tells every other open window, so they update instantly (live sync!).
const KEY = 'akshaya-patr-demo';
const FRESH_DEMO_HOURS = 6; // demo data older than this is replaced, so the demo never looks stale
const listeners = [];
let donations = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved?.donations && Date.now() - saved.savedAt < FRESH_DEMO_HOURS * 3600e3) return saved.donations;
  } catch {}
  return seedDonations();
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), donations }));
  } catch {}
  listeners.forEach((f) => f());
}

// Another window changed the data → reload it and redraw.
window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    donations = load();
    listeners.forEach((f) => f());
  }
});

export const getDonations = () => donations;
export const onChange = (f) => listeners.push(f);

export function addDonation(d) {
  donations.unshift({ id: 'n' + Date.now(), status: 'available', ...d });
  save();
}

export function update(id, changes) {
  const d = donations.find((x) => x.id === id);
  if (d) Object.assign(d, changes);
  save();
}

export function removeDonation(id) {
  donations = donations.filter((d) => d.id !== id);
  save();
}

export function resetDemo() {
  donations = seedDonations();
  save();
}
