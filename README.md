# Akshaya Patr

**A platform that redirects surplus food from restaurants, bakeries and events to labour camps across the UAE.**

In the Mahabharata, the *Akshaya Patra* was a vessel that never ran out of food. Akshaya Patr applies that idea to a modern problem: ensuring that good food reaches people who need it instead of ending up in a landfill.

Developed for the **"Fix It for the Future"** hackathon in Bright Riders School.

**Live demo:** https://akshaya-patr.vercel.app

**Open a screen directly:**
- [Donor screen (Spice Route Restaurant)](https://akshaya-patr.vercel.app/#donor/d1)
- [Labour camp screen (Mussafah Workers Village)](https://akshaya-patr.vercel.app/#camp/c1)
- [Volunteer screen (Ahmed K.)](https://akshaya-patr.vercel.app/#volunteer/v1)

Tip: open the donor and camp links in two windows side by side. Food posted by the donor appears on the camp's screen straight away.

---

## Problem Statement
- Restaurants, bakeries, weddings and corporate events in the UAE discard large quantities of edible food every day.
- Food waste in landfills produces **methane**, a greenhouse gas significantly more potent than carbon dioxide.
- At the same time, many workers living in labour accommodation would benefit from additional meals.
- The main barrier is not the availability of food, but **matching** it to suitable recipients and **transporting** it safely and on time.

## Solution
Akshaya Patr connects three groups on a single platform:

| Participant | Role |
|---|---|
| **Donors**: restaurants, bakeries, event organisers | List surplus food, including quantity, cuisine, ingredients and preparation time |
| **Labour camps** | View suitable donations and submit requests |
| **Volunteers** | Collect and deliver food to camps |

### Joining the Platform
Donors, labour camps and volunteers can join through a simple sign-up form and choose their location on the map. Camps record their dietary requirements when they join. In this demonstration no password is required; a production version would add secure login and verify every member before activation.

### Delivery Options
When requesting a donation, a camp selects one of three delivery methods:
1. **Camp collection**: a representative from the camp collects the food using the camp's vehicle.
2. **Community volunteer**: a registered volunteer collects and delivers the food.
3. **Paid delivery**: the camp covers the delivery charge and the donor delivers the food.

### Dietary Suitability
Each camp specifies the ingredients it cannot accept (for example beef, pork, or non-halal food) and its preferred cuisines. Camps are shown only donations that meet their requirements, and preferred cuisines are highlighted. Requirements are set at camp level, and no individual is categorised.

### Food Safety
Donors record when the food was prepared. Donations older than four hours are automatically hidden from camps.

### Impact Tracking
The platform reports meals delivered, kilograms of food saved, estimated CO₂ emissions avoided, and the estimated water saved. Growing food uses large amounts of water, so every wasted meal also wastes that water, a serious issue in a country that depends on desalination.

### Languages and Accessibility
- Available in 10 languages spoken widely in the UAE: English, Arabic, Hindi, Urdu, Malayalam, Tamil, Telugu, Bengali, Nepali and Filipino. Arabic and Urdu are displayed right-to-left.
- Light and dark themes.
- Works on phones, tablets and computers.

---

## Technology
- **Vite and JavaScript**: browser-based application
- **MapLibre GL, OpenStreetMap and OpenFreeMap**: free, open-source mapping of donors, camps and volunteers
- **Vercel**: hosting, with automatic updates from GitHub
- **Browser storage with cross-window synchronisation**: live updates between open windows for demonstration purposes

This project was built using an AI-assisted workflow. I used Claude as a coding assistant to help write the code. I came up with the idea, made the design and feature decisions, tested the app, found problems and directed the fixes, and studied the code so I can explain how each part works.


## Project Structure
```
src/
  main.js            starts the app and connects everything
  state.js           who is using this window
  data/              demo data, saving and live sync
  logic/rules.js     food safety, matching, distance, impact
  i18n/              translations (10 languages)
  map/map.js         the map
  views/             donor, camp, volunteer and join screens
  styles/style.css   colours, layout, dark mode
scripts/             build helper for the map
docs/                how the code works
```
A full explanation is in [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md).

## Demo Data
All business names in the demo are fictional. Locations correspond to real areas in Abu Dhabi, Dubai and Sharjah. The demo includes 25 donors, 19 labour camps, 23 volunteers and 47 donations. Payments are simulated, and no real transactions take place.

## Running Locally
```bash
npm install
npm run dev
```
Open http://localhost:5173 in a browser. Requires [Node.js](https://nodejs.org) 20 or newer.

To build the version that goes online: `npm run build`

## Team
**Built by:**
- Himani Varma
- Ruthvika Vankadhara

**Team members:**
- Rahil Afsal
- Riyansh Varma

## License
Released under the MIT License.
