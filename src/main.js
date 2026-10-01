// MAIN: starts the app and connects everything — buttons, language, theme, and redrawing the screen.
import { state, people, $, checkWho, pref, byId, esc } from './state.js';
import { drawPins, setMapTheme, setJoinPos, clearJoinPin, showTrip } from './map/map.js';
import './styles/style.css';
import { camps, donors } from './data/demo-data.js';
import { getDonations, onChange, update, removeDonation, resetDemo } from './data/store.js';
import { deliveryFee, impact } from './logic/rules.js';
import { t, setLang, getLang, LANGS } from './i18n/translations.js';
import { dist } from './views/card.js';
import { donorView, submitDonation } from './views/donor.js';
import { campView } from './views/camp.js';
import { volunteerView } from './views/volunteer.js';
import { joinView, submitJoin, AREAS } from './views/join.js';

// ---------- LANGUAGE ----------
setLang(pref.get('lang') || 'en');
$('lang').innerHTML = LANGS.map((l) => `<option value="${l.code}">${l.name}</option>`).join('');
$('lang').value = getLang();

// ---------- THEME (light / dark) ----------
function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  $('theme').textContent = state.theme === 'dark' ? t('lightMode') : t('darkMode');
}

// ---------- DRAW THE SCREEN ----------
const VIEWS = { donor: donorView, camp: campView, volunteer: volunteerView };

function render() {
  if (state.role !== 'join') {
    history.replaceState(null, '', `#${state.role}/${state.who}`);
    clearJoinPin();
  }

  // Remember whatever was being typed, so live updates from other windows don't wipe it.
  const oldForm = $('panel').querySelector('form');
  const oldFormId = oldForm?.id;
  const isTick = (el) => el.type === 'checkbox' || el.type === 'radio';
  const typed = oldForm && [...oldForm.elements].map((el) => (isTick(el) ? el.checked : el.value));
  const focusIndex = oldForm ? [...oldForm.elements].indexOf(document.activeElement) : -1;

  // Top bar and tabs, in the chosen language.
  $('tagline').textContent = t('tagline');
  $('reset').textContent = t('reset');
  $('joinBtn').textContent = t('join');
  $('joinBtn').classList.toggle('active', state.role === 'join');
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.textContent = t(b.dataset.role);
    b.classList.toggle('active', b.dataset.role === state.role);
  });

  // Impact counters.
  const im = impact(getDonations());
  $('impact').innerHTML = [
    t('meals', { n: `<b>${im.meals}</b>` }),
    t('kg', { n: `<b>${im.kg}</b>` }),
    t('co2', { n: `<b>${im.co2}</b>` }),
    t('water', { n: `<b>${im.water.toLocaleString('en')}</b>` }),
  ].map((s) => `<span>${s}</span>`).join('');

  // The main panel: either the Join form, or "You are: [person]" + that role's screen.
  const picker = () => `<label class="who">${t('youAre')}
    <select id="who">${people[state.role].map((p) => `<option value="${p.id}" ${p.id === state.who ? 'selected' : ''}>${esc(`${p.name}: ${p.area}`)}</option>`).join('')}</select></label>`;
  $('panel').innerHTML = state.role === 'join' ? joinView() : picker() + VIEWS[state.role]();

  // Put the typed text back.
  const newForm = $('panel').querySelector('form');
  if (typed && newForm && newForm.id === oldFormId) {
    [...newForm.elements].forEach((el, i) => (isTick(el) ? (el.checked = typed[i]) : (el.value = typed[i])));
    if (focusIndex >= 0) newForm.elements[focusIndex]?.focus();
    if (newForm.id === 'join') newForm.dataset.r = newForm.elements.role.value;
  }
}

// ---------- WHAT EACH DONATION BUTTON DOES ----------
// The life of a donation: available → requested → (assigned) → picked → delivered
function act(action, id) {
  const d = getDonations().find((x) => x.id === id);
  if (!d) return;
  switch (action) {
    case 'camp': // camp collects it themselves
    case 'volunteer': // camp asks an outside volunteer
      return update(id, { status: 'requested', camp: state.who, mode: action });
    case 'paid': { // camp pays the donor to deliver
      const fee = deliveryFee(dist(d, byId(camps, state.who)));
      if (confirm(t('payConfirm', { n: fee, donor: byId(donors, d.donor).name }))) update(id, { status: 'requested', camp: state.who, mode: 'paid', fee });
      return;
    }
    case 'cancel':
      return update(id, { status: 'available', camp: null, mode: null, fee: null, volunteer: null });
    case 'accept': // a volunteer takes the job
      return update(id, { status: 'assigned', volunteer: state.who });
    case 'picked':
      return update(id, { status: 'picked' });
    case 'delivered':
      return update(id, { status: 'delivered' });
    case 'remove':
      return removeDonation(id);
  }
}

// ---------- LISTENING FOR CLICKS, CHANGES AND FORMS ----------
document.addEventListener('click', (e) => {
  const tab = e.target.closest('#tabs button');
  if (tab) {
    state.role = tab.dataset.role;
    state.who = people[state.role][0].id;
    return render();
  }
  const b = e.target.closest('button[data-action]');
  if (b) return act(b.dataset.action, b.dataset.id);
  const c = e.target.closest('[data-show]'); // clicking a card shows the trip on the map
  if (c) {
    const d = getDonations().find((x) => x.id === c.dataset.show);
    if (d) showTrip(d);
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'who') {
    state.who = e.target.value;
    render();
  }
  // Join form: show the right fields for donor / camp / volunteer.
  if (e.target.name === 'role') e.target.form.dataset.r = e.target.value;
  // Join form: picking an area moves the red pin there and zooms in.
  if (e.target.name === 'area' && e.target.form?.id === 'join') {
    const a = AREAS.find((x) => x.name === e.target.value);
    if (a) setJoinPos(a.pos, true);
  }
});

document.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.id === 'join') submitJoin(e.target);
  if (e.target.id === 'post') submitDonation(e.target);
});

// ---------- TOP BAR BUTTONS ----------
$('lang').onchange = (e) => {
  setLang(e.target.value);
  pref.set('lang', getLang());
  applyTheme(); // re-label the theme button in the new language
  render();
};

$('theme').onclick = () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  pref.set('theme', state.theme);
  applyTheme();
  setMapTheme(state.theme);
};

$('reset').onclick = () => confirm(t('resetConfirm')) && resetDemo();

$('joinBtn').onclick = () => {
  state.role = 'join';
  render();
};

// ---------- START ----------
// Redraw whenever data changes (here or in another window).
onChange(() => {
  drawPins();
  checkWho();
  render();
});
// Refresh "cooked X min ago" and food safety every minute (but not while a dropdown is open).
setInterval(() => document.activeElement?.tagName !== 'SELECT' && render(), 60000);

applyTheme();
drawPins();
render();
