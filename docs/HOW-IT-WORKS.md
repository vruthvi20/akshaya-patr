# How Akshaya Patr Works

This guide explains every part of the code in plain language.

## The big picture

```
index.html ──► src/main.js (the conductor)
                 │
                 ├── src/state.js           who is using this window right now
                 ├── src/data/              the information (demo data + saving)
                 ├── src/logic/rules.js     the rules (food safety, matching, distance, impact)
                 ├── src/i18n/              all the words, in 10 languages
                 ├── src/map/map.js         the map
                 ├── src/views/             the 4 screens (donor, camp, volunteer, join)
                 └── src/styles/style.css   the colours and layout
```

Think of it like a restaurant kitchen. `main.js` is the head chef who tells everyone what to do. The other files each have one job.

---

## Folder by folder

### `index.html`: the skeleton
The empty page: top bar, three tabs, a panel on the left and the map on the right. JavaScript fills it in.

### `src/main.js`: the conductor
- Starts the app (language, theme, map dots, first screen).
- `render()` redraws the screen whenever something changes.
- `act()` decides what each button does, for example "Ask a volunteer" or "Delivered".
- Listens for clicks, form submits and dropdown changes.

### `src/state.js`: who is using this window
- Remembers the **role** (donor, camp, volunteer or join) and **who** (which restaurant, camp or person).
- These are saved in the web address (e.g. `#camp/c1`). That's why two windows can be two different people.
- Also holds small helpers, like `esc()`, which makes typed text safe to show.

### `src/data/demo-data.js`: the demo information
- 25 donors, 19 camps, 23 volunteers and 47 donations. The areas are real; the names are made up.
- Each camp lists what it **can't accept** (e.g. beef, pork), whether it's **halal only**, and its **preferred food**.

### `src/data/store.js`: saving and live sync
- Saves all donations, and anyone who joined, in the browser (`localStorage`).
- When one window saves, the browser tells all the other open windows, so they redraw instantly. That's the **live sync**.
- Demo data older than 6 hours is refreshed, so the demo always looks fresh.

### `src/logic/rules.js`: the brain
| Rule | How it works |
|---|---|
| **Food safety** | Food cooked more than 4 hours ago is hidden. |
| **Matching** | `suits()` checks a donation against a camp's rules: no forbidden ingredients, halal if needed. |
| **Good match** | A star if the cuisine is one the camp prefers. |
| **Distance** | The *haversine formula* works out the distance between two points on a round Earth. |
| **60 km limit** | Camps and volunteers only see food within 60 km. |
| **Delivery price** | AED 10 + AED 2 per km. |
| **Impact** | 1 portion ≈ 0.4 kg. 1 kg of wasted food ≈ 2.5 kg CO₂. |
| **Water saved** | Growing food uses water: about 1,500 L per kg for rice and vegetables, and much more for meat (beef about 15,400 L/kg). A meat dish counts as about ⅓ meat. |

### `src/i18n/translations.js`: 10 languages
- Every word on screen lives here, in English, Arabic, Hindi, Urdu, Malayalam, Tamil, Telugu, Bengali, Nepali and Filipino.
- `t('meals', { n: 5 })` gives "5 meals shared" in the chosen language.
- Arabic and Urdu are right-to-left, so the whole page flips for them.

### `src/map/map.js`: the map
- Uses **MapLibre** (free, open-source) with free map tiles from **OpenFreeMap**.
- Draws a dot for everyone: **D** donor (orange), **C** camp (blue), **V** volunteer (green).
- Clicking a food card draws a dashed line from the donor to the camp.
- While joining, a red pin shows the location you picked.

### `src/views/`: the 4 screens
| File | Screen |
|---|---|
| `card.js` | The food "card" used on every screen, and its status line |
| `donor.js` | Post leftover food and see your donations |
| `camp.js` | See only food that suits the camp and pick one of 3 delivery options |
| `volunteer.js` | See delivery jobs nearby, accept one, and mark it picked up / delivered |
| `join.js` | Sign up as a donor, camp or volunteer |

### `src/styles/style.css`: the look
Colours, layout and dark mode. Colours are set once at the top (`--green`, `--blue`…) and changed for dark mode.

### `scripts/copy-map-worker.mjs`: a build helper
The map does its heavy work in a background "worker" file. Building the app leaves that file out, so this script copies it in. Without it, the map was blank on the live website.

---

## The life of a donation
```
available ──► requested ──► (assigned to a volunteer) ──► picked up ──► delivered
     ▲             │
     └── cancel ───┘
```
1. **Donor** posts food → `available`
2. **Camp** picks a delivery option → `requested`
   - Camp collects it → the camp marks *Picked up* then *Arrived*
   - Outside volunteer → a **volunteer** accepts (`assigned`), then *Picked up*, then *Delivered*
   - Paid delivery → the **donor** marks *Out for delivery* then *Delivered*
3. `delivered` food is added to the impact counters.

## What a real launch would add
- Secure login, and checking every camp and restaurant before they join
- A real online database instead of browser storage
- Real payments for paid delivery
- Notifications when food is posted nearby
