# Akshaya Patr

**A platform that redirects surplus food from restaurants, bakeries and events to labour camps across the UAE.**

In the Mahabharata, the *Akshaya Patra* was a vessel that never ran out of food. Akshaya Patr applies that idea to a modern problem: ensuring that good food reaches people who need it instead of ending up in a landfill.

Developed for the **"Fix It for the Future"** hackathon.

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
The platform reports meals delivered, kilograms of food saved, and estimated CO₂ emissions avoided.

---

## Technology
- **Vite and JavaScript**: browser-based application
- **MapLibre GL and OpenStreetMap**: open-source mapping of donors, camps and volunteers
- **Browser storage with cross-window synchronisation**: live updates between open windows for demonstration purposes

Development was assisted by **Claude (Anthropic)** as a coding assistant. The team reviewed and understands each component of the application.

## Demo Data
All business names in the demo are fictional. Locations correspond to real areas in Abu Dhabi and Dubai. Payments are simulated, and no real transactions take place.

## Running Locally
```bash
npm install
npm run dev
```
Open http://localhost:5173 in a browser.

## Team
- *(team member names)*

## License
Released under the MIT License.
