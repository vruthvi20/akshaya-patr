// SHARED PIECES for the screens: the donation "card", its status line, and small helpers.
import { donors, camps, volunteers } from '../data/demo-data.js';
import { isFresh, hoursOld, km } from '../logic/rules.js';
import { t } from '../i18n/translations.js';
import { byId, esc } from '../state.js';

// Distance (km) from a donation's restaurant to a place (camp or volunteer).
export const dist = (d, place) => km(byId(donors, d.donor).pos, place.pos);
// A button that main.js knows how to handle (see act() in main.js).
export const btn = (action, id, text) => `<button data-action="${action}" data-id="${id}">${text}</button>`;
export const empty = (text) => `<p class="empty">${text}</p>`;

const campName = (id) => esc(byId(camps, id)?.name ?? '');

// "cooked 20 min ago" / "cooked 1.5 h ago"
function ago(d) {
  const h = hoursOld(d);
  return h < 1 ? t('minAgo', { n: Math.max(0, Math.round(h * 60)) }) : t('hAgo', { n: h.toFixed(1) });
}

// What stage is this donation at?  available → requested → assigned → picked → delivered
export function statusText(d) {
  const camp = campName(d.camp);
  const how = { camp: t('howCamp'), volunteer: t('howVol'), paid: t('howPaid', { n: d.fee }) }[d.mode];
  switch (d.status) {
    case 'available': return isFresh(d) ? t('sAvailable') : t('sOld');
    case 'requested': return t('sRequested', { camp, how }) + (d.mode === 'volunteer' ? ' · ' + t('waiting') : '');
    case 'assigned': return t('sAssigned', { vol: esc(byId(volunteers, d.volunteer)?.name ?? ''), camp });
    case 'picked': return t('sPicked', { camp });
    case 'delivered': return t('sDelivered', { camp });
  }
  return '';
}

// One donation box: food, portions, who gave it, what's in it, its status, and buttons.
export function card(d, extra = '', actions = '') {
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
