import { seedDonations } from './data.js';

// All donations are saved in the browser. When one window changes them,
// the browser tells every other open window, so they update instantly (live sync!).
const KEY = 'akshaya-patr-demo';
const listeners = [];
let donations = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || seedDonations();
  } catch {
    return seedDonations();
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(donations));
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
  Object.assign(donations.find((d) => d.id === id), changes);
  save();
}

export function resetDemo() {
  donations = seedDonations();
  save();
}
