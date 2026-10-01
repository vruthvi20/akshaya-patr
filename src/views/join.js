// SCREEN 4: JOIN — sign up as a donor, labour camp or volunteer (demo only: no passwords).
import { donors, camps, CUISINES, INGREDIENTS } from '../data/demo-data.js';
import { addMember } from '../data/store.js';
import { t } from '../i18n/translations.js';
import { state, esc } from '../state.js';

const DONOR_TYPES = ['Restaurant', 'Bakery', 'Hotel', 'Events', 'Café', 'Canteen', 'Food court'];

// Every area name we already know, with its map position, for the "Area" dropdown.
export const AREAS = [...new Map([...donors, ...camps].map((p) => [p.area, p.pos]))]
  .map(([name, pos]) => ({ name, pos }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function joinView() {
  return `<h2>${t('joinTitle')}</h2>
    <form id="join" data-r="donor">
      <div class="row">${['donor', 'camp', 'volunteer']
        .map((r, i) => `<label><input type="radio" name="role" value="${r}" ${i === 0 ? 'checked' : ''} /> ${t(r)}</label>`)
        .join('')}</div>
      <label>${t('yourName')} <input name="name" maxlength="60" /></label>
      <label class="only-donor">${t('type')} <select name="type">${DONOR_TYPES.map((x) => `<option>${x}</option>`).join('')}</select></label>
      <label>${t('area')} <select name="area"><option value="">--</option>${AREAS.map((a) => `<option>${esc(a.name)}</option>`).join('')}</select></label>
      <p class="note">${t('mapHint')} <b id="joinLoc">${state.joinPos ? t('locationSet') + ' ✓' : ''}</b></p>
      <div class="only-camp">
        <label>${t('numWorkers')} <input name="workers" type="number" min="1" max="20000" value="100" /></label>
        <fieldset><legend>${t('cantAccept')}</legend>
          ${INGREDIENTS.map((i) => `<label><input type="checkbox" name="cant" value="${i}" /> ${t(i)}</label>`).join('')}
        </fieldset>
        <label><input type="checkbox" name="halalOnly" /> ${t('halalOnly')}</label>
        <fieldset><legend>${t('prefers2')}</legend>
          ${CUISINES.map((c) => `<label><input type="checkbox" name="prefers" value="${c}" /> ${c}</label>`).join('')}
        </fieldset>
      </div>
      <button class="primary">${t('submitJoin')}</button>
      <p class="note">${t('joinNote')}</p>
    </form>`;
}

// The person pressed "Join now": check the form, save them, and open their own screen.
export function submitJoin(form) {
  const f = new FormData(form);
  const role = f.get('role');
  const name = f.get('name').trim();
  if (!name) return alert(t('needName'));
  if (!f.get('area') || !state.joinPos) return alert(t('needLocation'));
  const member = { role, id: role[0] + Date.now(), name, area: f.get('area'), pos: state.joinPos };
  if (role === 'donor') member.type = f.get('type');
  if (role === 'camp') {
    const prefers = f.getAll('prefers');
    if (!prefers.length) return alert(t('needPrefer'));
    Object.assign(member, {
      workers: Math.max(1, Math.round(Number(f.get('workers')) || 1)),
      cantAccept: f.getAll('cant'),
      halalOnly: f.has('halalOnly'),
      prefers,
    });
  }
  form.reset();
  state.role = role;
  state.who = member.id;
  addMember(member); // saves it, which redraws everything
}
