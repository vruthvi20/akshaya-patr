// SCREEN 3: VOLUNTEER — see delivery jobs near you, accept one, and mark it picked up / delivered.
import { donors, camps, volunteers } from '../data/demo-data.js';
import { getDonations } from '../data/store.js';
import { km, MAX_KM } from '../logic/rules.js';
import { t } from '../i18n/translations.js';
import { state, byId } from '../state.js';
import { card, btn, empty, dist } from './card.js';

export function volunteerView() {
  const me = byId(volunteers, state.who);
  const all = getDonations();
  // Jobs = camps that asked for an outside volunteer, with the pickup near me. Nearest first.
  const jobs = all
    .filter((d) => d.status === 'requested' && d.mode === 'volunteer' && dist(d, me) <= MAX_KM)
    .sort((a, b) => dist(a, me) - dist(b, me));
  const mine = all.filter((d) => d.volunteer === state.who);
  const actions = (d) =>
    d.status === 'assigned' ? btn('picked', d.id, t('pickedUp')) : d.status === 'picked' ? btn('delivered', d.id, t('delivered')) : '';

  const jobCard = (d) => {
    const trip = km(byId(donors, d.donor).pos, byId(camps, d.camp).pos);
    return card(d, `<small>${t('jobInfo', { a: dist(d, me).toFixed(1), b: trip.toFixed(1) })}</small>`, btn('accept', d.id, t('illDeliver')));
  };

  return `<h2>${t('jobs')}</h2>
    ${jobs.map(jobCard).join('') || empty(t('noJobs'))}
    <h2>${t('yourDeliveries')}</h2>
    ${mine.map((d) => card(d, '', actions(d))).join('') || empty(t('none'))}`;
}
