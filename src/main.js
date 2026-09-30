import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import { donors, camps, volunteers, CUISINES, INGREDIENTS } from './data.js';
import { getDonations, onChange, addDonation, update, removeDonation, resetDemo } from './store.js';
import { isFresh, hoursOld, suits, isGoodMatch, km, deliveryFee, impact, SAFE_HOURS, MAX_KM } from './logic.js';
import { t, setLang, getLang, LANGS } from './i18n.js';

const $ = (id) => document.getElementById(id);
const byId = (list, id) => list.find((x) => x.id === id);
// Makes typed text safe to show on the page.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Remember small choices (language, theme) in this browser. Wrapped in try in case storage is blocked.
const pref = {
  get: (k) => { try { return localStorage.getItem('ap-' + k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem('ap-' + k, v); } catch {} },
};

// ---------- LANGUAGE ----------
setLang(pref.get('lang') || 'en');
$('lang').innerHTML = LANGS.map((l) => `<option value="${l.code}">${l.name}</option>`).join('');
$('lang').value = getLang();

// ---------- THEME (light / dark) ----------
const MAP_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};
let theme = pref.get('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('theme').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}
applyTheme();

// Which role + person this window is. Saved in the address (e.g. #camp/c1),
// so two windows side by side can be two different people.
const people = { donor: donors, camp: camps, volunteer: volunteers };
let [role, who] = location.hash.slice(1).split('/');
if (!people[role]) role = 'donor';
if (!byId(people[role], who)) who = people[role][0].id;

// ---------- MAP ----------
const map = new maplibregl.Map({
  container: 'map',
  style: MAP_STYLES[theme],
  center: [54.9, 24.75], // between Abu Dhabi and Dubai
  zoom: 7.5,
});

// Put an emoji pin on the map for every donor, camp and volunteer.
function addPins(list, letter, kind) {
  for (const p of list) {
    const el = document.createElement('div');
    el.className = `pin ${kind}`;
    el.textContent = letter;
    new maplibregl.Marker({ element: el })
      .setLngLat(p.pos)
      .setPopup(new maplibregl.Popup({ offset: 14 }).setText(`${p.name} (${p.area})`))
      .addTo(map);
  }
}
addPins(donors, 'D', 'donor');
addPins(camps, 'C', 'camp');
addPins(volunteers, 'V', 'volunteer');

// A dashed line from the donor to the camp for the donation you click.
// It's re-added every time the map style changes (light ↔ dark).
const line = (coords) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } });
let tripCoords = [];
map.on('style.load', () => {
  map.addSource('trip', { type: 'geojson', data: line(tripCoords) });
  map.addLayer({ id: 'trip', type: 'line', source: 'trip', paint: { 'line-color': '#ea580c', 'line-width': 4, 'line-dasharray': [2, 1] } });
});

function showTrip(d) {
  const from = byId(donors, d.donor).pos;
  const campId = d.camp || (role === 'camp' ? who : null);
  if (!campId) return map.flyTo({ center: from, zoom: 12 });
  const to = byId(camps, campId).pos;
  tripCoords = [from, to];
  map.getSource('trip')?.setData(line(tripCoords));
  map.fitBounds(new maplibregl.LngLatBounds(from, from).extend(to), { padding: 80, maxZoom: 13 });
}

// ---------- SMALL HELPERS ----------
const dist = (d, place) => km(byId(donors, d.donor).pos, place.pos);
const btn = (action, id, text) => `<button data-action="${action}" data-id="${id}">${text}</button>`;
const empty = (text) => `<p class="empty">${text}</p>`;
const campName = (id) => byId(camps, id)?.name ?? '';

function ago(d) {
  const h = hoursOld(d);
  return h < 1 ? t('minAgo', { n: Math.max(0, Math.round(h * 60)) }) : t('hAgo', { n: h.toFixed(1) });
}

// What stage is this donation at?
function statusText(d) {
  const camp = campName(d.camp);
  const how = { camp: t('howCamp'), volunteer: t('howVol'), paid: t('howPaid', { n: d.fee }) }[d.mode];
  switch (d.status) {
    case 'available': return isFresh(d) ? `${t('sAvailable')}` : `${t('sOld')}`;
    case 'requested': return `${t('sRequested', { camp, how })}${d.mode === 'volunteer' ? ' · ' + t('waiting') : ''}`;
    case 'assigned': return `${t('sAssigned', { vol: byId(volunteers, d.volunteer)?.name ?? '', camp })}`;
    case 'picked': return `${t('sPicked', { camp })}`;
    case 'delivered': return `${t('sDelivered', { camp })}`;
  }
  return '';
}

// One donation "card".
function card(d, extra = '', actions = '') {
  const donor = byId(donors, d.donor);
  const tags = [d.contains.length ? d.contains.map((i) => t(i)).join(', ') : t('vegetarian'), d.halal ? t('halal') : '']
    .filter(Boolean)
    .join(' · ');
  return `<article class="card" data-show="${d.id}">
    <div class="row"><b>${esc(d.food)}</b><span class="portions">${d.portions} ${t('portions')}</span></div>
    <small>${esc(donor.name)} · ${d.cuisine} · ${tags} · ${ago(d)}</small>
    ${extra}
    <div class="status">${statusText(d)}</div>
    ${actions ? `<div class="actions">${actions}</div>` : ''}
  </article>`;
}

// ---------- SCREEN 1: DONOR ----------
function donorView() {
  const mine = getDonations().filter((d) => d.donor === who);
  const actions = (d) => {
    if (d.status === 'available') return btn('remove', d.id, `${t('remove')}`);
    if (d.mode !== 'paid') return '';
    if (d.status === 'requested') return btn('picked', d.id, `${t('outForDelivery')}`);
    if (d.status === 'picked') return btn('delivered', d.id, `${t('markDelivered')}`);
    return '';
  };
  return `<h2>${t('share')}</h2>
    <form id="post">
      <input name="food" placeholder="${esc(t('foodPh'))}" maxlength="80" required />
      <div class="row">
        <label><input name="portions" type="number" min="1" max="5000" value="20" required /> ${t('portions')}</label>
        <select name="cuisine">${CUISINES.map((c) => `<option>${c}</option>`).join('')}</select>
      </div>
      <fieldset><legend>${t('contains')}</legend>
        ${INGREDIENTS.map((i) => `<label><input type="checkbox" name="contains" value="${i}" /> ${t(i)}</label>`).join('')}
      </fieldset>
      <div class="row">
        <label><input type="checkbox" name="halal" checked /> ${t('halal')}</label>
        <label>${t('cooked')} <select name="ago">
          <option value="0">${t('justNow')}</option><option value="1">${t('h1')}</option>
          <option value="2">${t('h2')}</option><option value="3">${t('h3')}</option>
        </select></label>
      </div>
      <button class="primary">${t('post')}</button>
    </form>
    <h2>${t('yourDonations')}</h2>
    ${mine.map((d) => card(d, '', actions(d))).join('') || empty(t('nothingPosted'))}`;
}

// ---------- SCREEN 2: LABOUR CAMP ----------
function campView() {
  const camp = byId(camps, who);
  const all = getDonations();
  const open = all.filter((d) => d.status === 'available');
  // Only fresh, nearby food that suits this camp. Preferred cuisine first, then nearest.
  const good = open
    .filter((d) => isFresh(d) && suits(d, camp) && dist(d, camp) <= MAX_KM)
    .sort((a, b) => isGoodMatch(b, camp) - isGoodMatch(a, camp) || dist(a, camp) - dist(b, camp));
  const hidden = open.length - good.length;
  const mine = all.filter((d) => d.camp === who);
  const rules = [
    `${t('workers', { n: camp.workers })}`,
    ...camp.cantAccept.map((i) => `${t('noX', { x: t(i) })}`),
    camp.halalOnly ? `${t('halalOnly')}` : '',
    `${t('prefers', { x: camp.prefers.join(', ') })}`,
  ].filter(Boolean);
  const actions = (d) => {
    // A camp can cancel until someone is on the way.
    if (d.status === 'requested')
      return (d.mode === 'camp' ? btn('picked', d.id, `${t('pickedUp')}`) : '') + btn('cancel', d.id, `${t('cancel')}`);
    if (d.mode === 'camp' && d.status === 'picked') return btn('delivered', d.id, `${t('arrived')}`);
    return '';
  };

  return `<p class="chips">${rules.map((r) => `<span>${r}</span>`).join('')}</p>
    <h2>${t('available')}</h2>
    ${
      good
        .map((d) => {
          const k = dist(d, camp);
          return card(
            d,
            `<small>${t('kmAway', { n: k.toFixed(1) })} ${isGoodMatch(d, camp) ? `<span class="match">${t('goodMatch')}</span>` : ''}</small>`,
            btn('camp', d.id, `${t('ourPickup')}`) + btn('volunteer', d.id, `${t('askVol')}`) + btn('paid', d.id, `${t('payFee', { n: deliveryFee(k) })}`)
          );
        })
        .join('') || empty(t('noFood'))
    }
    ${hidden ? `<p class="note">${t('hidden', { n: hidden, h: SAFE_HOURS, km: MAX_KM })}</p>` : ''}
    <h2>${t('yourRequests')}</h2>
    ${mine.map((d) => card(d, '', actions(d))).join('') || empty(t('noRequests'))}`;
}

// ---------- SCREEN 3: VOLUNTEER ----------
function volunteerView() {
  const me = byId(volunteers, who);
  const all = getDonations();
  const jobs = all
    .filter((d) => d.status === 'requested' && d.mode === 'volunteer' && dist(d, me) <= MAX_KM)
    .sort((a, b) => dist(a, me) - dist(b, me));
  const mine = all.filter((d) => d.volunteer === who);
  const actions = (d) =>
    d.status === 'assigned' ? btn('picked', d.id, `${t('pickedUp')}`) : d.status === 'picked' ? btn('delivered', d.id, `${t('delivered')}`) : '';
  return `<h2>${t('jobs')}</h2>
    ${
      jobs
        .map((d) => {
          const trip = km(byId(donors, d.donor).pos, byId(camps, d.camp).pos);
          return card(d, `<small>${t('jobInfo', { a: dist(d, me).toFixed(1), b: trip.toFixed(1) })}</small>`, btn('accept', d.id, `${t('illDeliver')}`));
        })
        .join('') || empty(`${t('noJobs')}`)
    }
    <h2>${t('yourDeliveries')}</h2>
    ${mine.map((d) => card(d, '', actions(d))).join('') || empty(t('none'))}`;
}

// ---------- DRAW THE SCREEN ----------
function render() {
  history.replaceState(null, '', `#${role}/${who}`);

  // Keep whatever the donor was typing, so live updates from other windows don't wipe it.
  const oldForm = $('post');
  const typed = oldForm && [...oldForm.elements].map((el) => (el.type === 'checkbox' ? el.checked : el.value));
  const focusIndex = oldForm ? [...oldForm.elements].indexOf(document.activeElement) : -1;

  $('tagline').textContent = t('tagline');
  $('reset').textContent = `${t('reset')}`;
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.textContent = t(b.dataset.role);
    b.classList.toggle('active', b.dataset.role === role);
  });
  const im = impact(getDonations());
  $('impact').innerHTML = `<span>${t('meals', { n: `<b>${im.meals}</b>` })}</span><span>${t('kg', { n: `<b>${im.kg}</b>` })}</span><span>${t('co2', { n: `<b>${im.co2}</b>` })}</span>`;

  const picker = `<label class="who">${t('youAre')}
    <select id="who">${people[role].map((p) => `<option value="${p.id}" ${p.id === who ? 'selected' : ''}>${esc(p.name)}: ${p.area}</option>`).join('')}</select></label>`;
  $('panel').innerHTML = picker + { donor: donorView, camp: campView, volunteer: volunteerView }[role]();

  const newForm = $('post');
  if (typed && newForm) {
    [...newForm.elements].forEach((el, i) => (el.type === 'checkbox' ? (el.checked = typed[i]) : (el.value = typed[i])));
    if (focusIndex >= 0) newForm.elements[focusIndex]?.focus();
  }
}

// ---------- BUTTON CLICKS ----------
function act(action, id) {
  const d = getDonations().find((x) => x.id === id);
  if (!d) return;
  switch (action) {
    case 'camp':
    case 'volunteer':
      return update(id, { status: 'requested', camp: who, mode: action });
    case 'paid': {
      const fee = deliveryFee(dist(d, byId(camps, who)));
      if (confirm(t('payConfirm', { n: fee, donor: byId(donors, d.donor).name }))) update(id, { status: 'requested', camp: who, mode: 'paid', fee });
      return;
    }
    case 'cancel':
      return update(id, { status: 'available', camp: null, mode: null, fee: null, volunteer: null });
    case 'accept':
      return update(id, { status: 'assigned', volunteer: who });
    case 'picked':
      return update(id, { status: 'picked' });
    case 'delivered':
      return update(id, { status: 'delivered' });
    case 'remove':
      return removeDonation(id);
  }
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
  if (c) {
    const d = getDonations().find((x) => x.id === c.dataset.show);
    if (d) showTrip(d);
  }
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
  const food = f.get('food').trim();
  const portions = Math.round(Number(f.get('portions')));
  if (!food) return alert(t('emptyFood'));
  if (!(portions >= 1)) return;
  const newDonation = {
    donor: who,
    food,
    portions,
    cuisine: f.get('cuisine'),
    contains: f.getAll('contains'),
    halal: f.has('halal'),
    cookedAt: Date.now() - Number(f.get('ago')) * 3600e3,
  };
  e.target.reset(); // clear the form first, so render() doesn't restore the old text
  addDonation(newDonation);
});

$('lang').onchange = (e) => {
  setLang(e.target.value);
  pref.set('lang', getLang());
  render();
};

$('theme').onclick = () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  pref.set('theme', theme);
  applyTheme();
  map.setStyle(MAP_STYLES[theme]);
};

$('reset').onclick = () => confirm(t('resetConfirm')) && resetDemo();

onChange(render); // redraw whenever data changes (here or in another window)
setInterval(render, 60000); // refresh "cooked X min ago" and food-safety every minute
render();
