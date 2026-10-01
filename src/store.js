import { donors, camps, volunteers, seedDonations } from './data.js';

// All donations (and anyone who joined) are saved in the browser. When one window changes them,
// the browser tells every other open window, so they update instantly (live sync!).
const KEY = 'akshaya-patr-demo';
const FRESH_DEMO_HOURS = 6; // demo data older than this is replaced, so the demo never looks stale
const listeners = [];

// New members are added onto the end of the demo lists. BASE remembers where the demo lists end.
const lists = { donor: donors, camp: camps, volunteer: volunteers };
const BASE = { donor: donors.length, camp: camps.length, volunteer: volunteers.length };

let { donations, members } = load();
applyMembers();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved?.donations && Date.now() - saved.savedAt < FRESH_DEMO_HOURS * 3600e3)
      return { donations: saved.donations, members: saved.members || [] };
  } catch {}
  return { donations: seedDonations(), members: [] };
}

// Put the demo lists back to normal, then add everyone who joined.
function applyMembers() {
  for (const role in lists) lists[role].length = BASE[role];
  for (const m of members) lists[m.role].push(m);
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), donations, members }));
  } catch {}
  listeners.forEach((f) => f());
}

// Another window changed the data → reload it and redraw.
window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    ({ donations, members } = load());
    applyMembers();
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

// Someone joined as a donor, camp or volunteer.
export function addMember(m) {
  members.push(m);
  applyMembers();
  save();
}

export function resetDemo() {
  donations = seedDonations();
  members = [];
  applyMembers();
  save();
}
