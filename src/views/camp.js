// SCREEN 2: LABOUR CAMP — see only food that suits the camp, request it, and track requests.
import { camps } from '../data/demo-data.js';
import { getDonations } from '../data/store.js';
import { isFresh, suits, isGoodMatch, deliveryFee, SAFE_HOURS, MAX_KM } from '../logic/rules.js';
import { t } from '../i18n/translations.js';
import { state, byId } from '../state.js';
import { card, btn, empty, dist } from './card.js';

export function campView() {
  const camp = byId(camps, state.who);
  const all = getDonations();
  const open = all.filter((d) => d.status === 'available');
  // THE MATCHING: only fresh, nearby food that suits this camp. Preferred cuisine first, then nearest.
  const good = open
    .filter((d) => isFresh(d) && suits(d, camp) && dist(d, camp) <= MAX_KM)
    .sort((a, b) => isGoodMatch(b, camp) - isGoodMatch(a, camp) || dist(a, camp) - dist(b, camp));
  const hidden = open.length - good.length;
  const mine = all.filter((d) => d.camp === state.who);

  // The camp's own rules, shown at the top.
  const rules = [
    t('workers', { n: camp.workers }),
    ...camp.cantAccept.map((i) => t('noX', { x: t(i) })),
    camp.halalOnly ? t('halalOnly') : '',
    t('prefers', { x: camp.prefers.join(', ') }),
  ].filter(Boolean);

  // Buttons on the camp's own requests.
  const actions = (d) => {
    // A camp can cancel until someone is on the way.
    if (d.status === 'requested') return (d.mode === 'camp' ? btn('picked', d.id, t('pickedUp')) : '') + btn('cancel', d.id, t('cancel'));
    if (d.mode === 'camp' && d.status === 'picked') return btn('delivered', d.id, t('arrived'));
    return '';
  };

  // Each food card gets the 3 delivery choices.
  const foodCard = (d) => {
    const k = dist(d, camp);
    const where = `<small>${t('kmAway', { n: k.toFixed(1) })} ${isGoodMatch(d, camp) ? `<span class="match">${t('goodMatch')}</span>` : ''}</small>`;
    const choices = btn('camp', d.id, t('ourPickup')) + btn('volunteer', d.id, t('askVol')) + btn('paid', d.id, t('payFee', { n: deliveryFee(k) }));
    return card(d, where, choices);
  };

  return `<p class="chips">${rules.map((r) => `<span>${r}</span>`).join('')}</p>
    <h2>${t('available')}</h2>
    ${good.map(foodCard).join('') || empty(t('noFood'))}
    ${hidden ? `<p class="note">${t('hidden', { n: hidden, h: SAFE_HOURS, km: MAX_KM })}</p>` : ''}
    <h2>${t('yourRequests')}</h2>
    ${mine.map((d) => card(d, '', actions(d))).join('') || empty(t('noRequests'))}`;
}
