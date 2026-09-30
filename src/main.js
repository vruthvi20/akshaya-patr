import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import { donors, camps, volunteers, CUISINES, INGREDIENTS } from './data.js';
import { getDonations, onChange, addDonation, update, resetDemo } from './store.js';
import { isFresh, hoursOld, suits, isGoodMatch, km, deliveryFee, impact, SAFE_HOURS, MAX_KM } from './logic.js';

const $ = (id) => document.getElementById(id);
const byId = (list, id) => list.find((x) => x.id === id);
// Makes typed text safe to show on the page.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Which role + person this window is. Saved in the address (e.g. #camp/c1),
// so two windows side by side can be two different people.
const people = { donor: donors, camp: camps, volunteer: volunteers };
let [role, who] = location.hash.slice(1).split('/');
if (!people[role]) role = 'donor';
if (!byId(people[role], who)) who = people[role][0].id;

// ---------- MAP ----------
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [54.9, 24.75], // between Abu Dhabi and Dubai
  zoom: 7.5,
});

// Put an emoji pin on the map for every donor, camp and volunteer.
function addPins(list, emoji, kind) {
  for (const p of list) {
    const el = document.createElement('div');
    el.className = `pin ${kind}`;
    el.textContent = emoji;
    new maplibregl.Marker({ element: el })
      .setLngLat(p.pos)
      .setPopup(new maplibregl.Popup({ offset: 14 }).setText(`${p.name} (${p.area})`))
      .addTo(map);
  }
}
addPins(donors, '🍽️', 'donor');
addPins(camps, '🏗️', 'camp');
addPins(volunteers, '🙋', 'volunteer');

// A dashed line from the donor to the camp for the donation you click.
const line = (coords) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } });
map.on('load', () => {
  map.addSource('trip', { type: 'geojson', data: line([]) });
  map.addLayer({ id: 'trip', type: 'line', source: 'trip', paint: { 'line-color': '#c2410c', 'line-width': 4, 'line-dasharray': [2, 1] } });
});

function showTrip(d) {
  const from = byId(donors, d.donor).pos;
  const campId = d.camp || (role === 'camp' ? who : null);
  if (!campId) return map.flyTo({ center: from, zoom: 12 });
  const to = byId(camps, campId).pos;
  map.getSource('trip')?.setData(line([from, to]));
  map.fitBounds(new maplibregl.LngLatBounds(from, from).extend(to), { padding: 80, maxZoom: 13 });
}

// ---------- SMALL HELPERS ----------
const dist = (d, place) => km(byId(donors, d.donor).pos, place.pos);
const btn = (action, id, text) => `<button data-action="${action}" data-id="${id}">${text}</button>`;
const empty = (text) => `<p class="empty">${text}</p>`;

function ago(d) {
  const h = hoursOld(d);
  return h < 1 ? `${Math.round(h * 60)} min ago` : `${h.toFixed(1)} h ago`;
}

// What stage is this donation at?
function statusText(d) {
  const camp = d.camp && byId(camps, d.camp).name;
  const vol = d.volunteer && byId(volunteers, d.volunteer).name;
  const how = { camp: 'camp picks it up', volunteer: 'outside volunteer', paid: `paid delivery (AED ${d.fee})` }[d.mode];
  if (d.status === 'available') return isFresh(d) ? '🟢 Available' : '⌛ Too old to share safely';
  return {
    requested: `📨 Requested by ${camp} · ${how}${d.mode === 'volunteer' ? ' · waiting for a volunteer' : ''}`,
    assigned: `🙋 ${vol} is going to pick it up → ${camp}`,
    picked: `🚚 On the way to ${camp}`,
    delivered: `✅ Delivered to ${camp}`,
  }[d.status];
}

// One donation "card".
function card(d, extra = '', actions = '') {
  const donor = byId(donors, d.donor);
  const tags = [d.contains.length ? d.contains.join(', ') : 'vegetarian', d.halal ? 'halal' : ''].filter(Boolean).join(' · ');
  return `<article class="card" data-show="${d.id}">
    <div class="row"><b>${esc(d.food)}</b><span class="portions">${d.portions} portions</span></div>
    <small>${esc(donor.name)} · ${d.cuisine} · ${tags} · cooked ${ago(d)}</small>
    ${extra}
    <div class="status">${statusText(d)}</div>
    ${actions ? `<div class="actions">${actions}</div>` : ''}
  </article>`;
}

// ---------- SCREEN 1: DONOR ----------
function donorView() {
  const mine = getDonations().filter((d) => d.donor === who);
  const actions = (d) =>
    d.mode !== 'paid' ? '' : d.status === 'requested' ? btn('picked', d.id, '🚚 Out for delivery') : d.status === 'picked' ? btn('delivered', d.id, '✅ Mark delivered') : '';
  return `<h2>Share leftover food</h2>
    <form id="post">
      <input name="food" placeholder="What food? e.g. Veg biryani" required />
      <div class="row">
        <label><input name="portions" type="number" min="1" value="20" required /> portions</label>
        <select name="cuisine">${CUISINES.map((c) => `<option>${c}</option>`).join('')}</select>
      </div>
      <fieldset><legend>Contains</legend>
        ${INGREDIENTS.map((i) => `<label><input type="checkbox" name="contains" value="${i}" /> ${i}</label>`).join('')}
      </fieldset>
      <div class="row">
        <label><input type="checkbox" name="halal" checked /> Halal</label>
        <label>Cooked <select name="ago">
          <option value="0">just now</option><option value="1">1 hour ago</option>
          <option value="2">2 hours ago</option><option value="3">3 hours ago</option>
        </select></label>
      </div>
      <button class="primary">📤 Post donation</button>
    </form>
    <h2>Your donations</h2>
    ${mine.map((d) => card(d, '', actions(d))).join('') || empty('Nothing posted yet.')}`;
}

// ---------- SCREEN 2: LABOUR CAMP ----------
function campView() {
  const camp = byId(camps, who);
  const all = getDonations();
  const open = all.filter((d) => d.status === 'available');
  // Only fresh food that suits this camp. Preferred cuisine first, then nearest.
  const good = open
    .filter((d) => isFresh(d) && suits(d, camp) && dist(d, camp) <= MAX_KM)
    .sort((a, b) => isGoodMatch(b, camp) - isGoodMatch(a, camp) || dist(a, camp) - dist(b, camp));
  const hidden = open.length - good.length;
  const mine = all.filter((d) => d.camp === who);
  const rules = [...camp.cantAccept.map((i) => `❌ no ${i}`), camp.halalOnly ? '✅ halal only' : '', `⭐ prefers ${camp.prefers.join(', ')}`].filter(Boolean);
  const actions = (d) =>
    d.mode !== 'camp' ? '' : d.status === 'requested' ? btn('picked', d.id, '🚐 Picked up') : d.status === 'picked' ? btn('delivered', d.id, '✅ Arrived at camp') : '';

  return `<p class="chips"><span>👷 ${camp.workers} workers</span>${rules.map((r) => `<span>${r}</span>`).join('')}</p>
    <h2>Food available for you</h2>
    ${
      good
        .map((d) => {
          const k = dist(d, camp);
          return card(
            d,
            `<small>📍 ${k.toFixed(1)} km away ${isGoodMatch(d, camp) ? '<span class="match">⭐ Good match</span>' : ''}</small>`,
            btn('camp', d.id, '🚐 Our volunteer picks up') + btn('volunteer', d.id, '🙋 Ask a volunteer') + btn('paid', d.id, `💳 Pay AED ${deliveryFee(k)} delivery`)
          );
        })
        .join('') || empty('No suitable food right now.')
    }
    ${hidden ? `<p class="note">🔒 ${hidden} donation(s) hidden: they don't suit your camp, are older than ${SAFE_HOURS} hours, or are more than ${MAX_KM} km away.</p>` : ''}
    <h2>Your requests</h2>
    ${mine.map((d) => card(d, '', actions(d))).join('') || empty('No requests yet.')}`;
}

// ---------- SCREEN 3: VOLUNTEER ----------
function volunteerView() {
  const me = byId(volunteers, who);
  const all = getDonations();
  const jobs = all.filter((d) => d.status === 'requested' && d.mode === 'volunteer').sort((a, b) => dist(a, me) - dist(b, me));
  const mine = all.filter((d) => d.volunteer === who);
  const actions = (d) => (d.status === 'assigned' ? btn('picked', d.id, '📦 Picked up') : d.status === 'picked' ? btn('delivered', d.id, '✅ Delivered') : '');
  return `<h2>Delivery jobs</h2>
    ${
      jobs
        .map((d) => {
          const trip = km(byId(donors, d.donor).pos, byId(camps, d.camp).pos);
          return card(d, `<small>📍 Pickup ${dist(d, me).toFixed(1)} km from you · trip ${trip.toFixed(1)} km</small>`, btn('accept', d.id, "🙋 I'll deliver it"));
        })
        .join('') || empty('No jobs right now. Thanks for being ready! 💚')
    }
    <h2>Your deliveries</h2>
    ${mine.map((d) => card(d, '', actions(d))).join('') || empty('None yet.')}`;
}

// ---------- DRAW THE SCREEN ----------
function render() {
  history.replaceState(null, '', `#${role}/${who}`);
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('active', b.dataset.role === role));
  const im = impact(getDonations());
  $('impact').innerHTML = `<span>🍛 <b>${im.meals}</b> meals shared</span><span>♻️ <b>${im.kg}</b> kg food saved</span><span>🌍 <b>${im.co2}</b> kg CO₂ avoided</span>`;
  const picker = `<label class="who">You are:
    <select id="who">${people[role].map((p) => `<option value="${p.id}" ${p.id === who ? 'selected' : ''}>${esc(p.name)}: ${p.area}</option>`).join('')}</select></label>`;
  $('panel').innerHTML = picker + { donor: donorView, camp: campView, volunteer: volunteerView }[role]();
}

// ---------- BUTTON CLICKS ----------
function act(action, id) {
  const d = getDonations().find((x) => x.id === id);
  if (action === 'camp' || action === 'volunteer') update(id, { status: 'requested', camp: who, mode: action });
  if (action === 'paid') {
    const fee = deliveryFee(dist(d, byId(camps, who)));
    if (confirm(`DEMO payment (no real money)\nPay AED ${fee} for ${byId(donors, d.donor).name} to deliver?`))
      update(id, { status: 'requested', camp: who, mode: 'paid', fee });
  }
  if (action === 'accept') update(id, { status: 'assigned', volunteer: who });
  if (action === 'picked') update(id, { status: 'picked' });
  if (action === 'delivered') update(id, { status: 'delivered' });
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('#tabs button');
  if (tab) {
    role = tab.dataset.role;
    who = people[role][0].id;
    return render();
  }
  const b = e.target.closest('button[data-action]');
  if (b) return act(b.dataset.action, b.dataset.id);
  const c = e.target.closest('[data-show]');
  if (c) showTrip(getDonations().find((d) => d.id === c.dataset.show));
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'who') {
    who = e.target.value;
    render();
  }
});

// Donor posts new food.
document.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  addDonation({
    donor: who,
    food: f.get('food'),
    portions: Number(f.get('portions')),
    cuisine: f.get('cuisine'),
    contains: f.getAll('contains'),
    halal: f.has('halal'),
    cookedAt: Date.now() - Number(f.get('ago')) * 3600e3,
  });
});

$('reset').onclick = () => confirm('Reset all demo data?') && resetDemo();

onChange(render); // redraw whenever data changes (here or in another window)
render();
