// SHARED STATE + SMALL HELPERS used by every other file.
import './data/store.js'; // load saved data (and anyone who joined) before anything else
import { donors, camps, volunteers } from './data/demo-data.js';

export const $ = (id) => document.getElementById(id);
export const byId = (list, id) => list.find((x) => x.id === id);
// Makes typed text safe to show on the page (stops people typing sneaky code into names).
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Remember small choices (language, theme) in this browser. Wrapped in try in case storage is blocked.
export const pref = {
  get: (k) => { try { return localStorage.getItem('ap-' + k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem('ap-' + k, v); } catch {} },
};

export const people = { donor: donors, camp: camps, volunteer: volunteers };

// What this window is showing right now.
// role = 'donor' | 'camp' | 'volunteer' | 'join', who = which person, joinPos = location picked while joining.
// role + who are saved in the address (e.g. #camp/c1), so two windows side by side can be two different people.
const [hashRole, hashWho] = location.hash.slice(1).split('/');
export const state = {
  role: people[hashRole] ? hashRole : 'donor',
  who: hashWho,
  joinPos: null,
  theme: pref.get('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
};

// If the person on screen doesn't exist (bad link, or after "Reset demo"), show the first one.
export function checkWho() {
  if (state.role !== 'join' && !byId(people[state.role], state.who)) state.who = people[state.role][0].id;
}
checkWho();
