// SCREEN 1: DONOR (restaurant, bakery, hotel, event) — post leftover food and see your donations.
import { CUISINES, INGREDIENTS } from '../data/demo-data.js';
import { getDonations, addDonation } from '../data/store.js';
import { t } from '../i18n/translations.js';
import { state, esc } from '../state.js';
import { card, btn, empty } from './card.js';

export function donorView() {
  const mine = getDonations().filter((d) => d.donor === state.who);
  // Buttons a donor sees: remove food nobody asked for yet, or deliver it if the camp paid.
  const actions = (d) => {
    if (d.status === 'available') return btn('remove', d.id, t('remove'));
    if (d.mode !== 'paid') return '';
    if (d.status === 'requested') return btn('picked', d.id, t('outForDelivery'));
    if (d.status === 'picked') return btn('delivered', d.id, t('markDelivered'));
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

// The donor pressed "Post donation".
export function submitDonation(form) {
  const f = new FormData(form);
  const food = f.get('food').trim();
  const portions = Math.round(Number(f.get('portions')));
  if (!food) return alert(t('emptyFood'));
  if (!(portions >= 1)) return;
  const newDonation = {
    donor: state.who,
    food,
    portions,
    cuisine: f.get('cuisine'),
    contains: f.getAll('contains'),
    halal: f.has('halal'),
    cookedAt: Date.now() - Number(f.get('ago')) * 3600e3,
  };
  form.reset(); // clear the form first, so the redraw doesn't bring the old text back
  addDonation(newDonation);
}
