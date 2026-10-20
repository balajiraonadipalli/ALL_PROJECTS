MERN Airbnb-style Booking Platform

Overview

This is a full‑stack MERN project to build an Airbnb‑like site: responsive UI, listings, search/filters, booking, auth, and payment‑ready integration.

Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, Zod validation
- Frontend: React (Vite), React Router, Axios, Tailwind CSS
- Integrations (planned): Cloudinary/S3 for images, Stripe for payments, Mapbox/Google for maps
  - Optional local dev for images: If Cloudinary env is set on client, images can be uploaded directly from the browser.

Local Setup (Quick Start)

1) Server

```bash
cd server
npm install
cp .env.example .env # set values
npm run dev
```

2) Client

```bash
cd client
npm install
npm run dev
```

Environment Variables

Create `server/.env` from `.env.example`:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/airbnb_clone
JWT_SECRET=replace_me
CLIENT_ORIGIN=http://localhost:5173
```

Optionally, configure client `.env` for Cloudinary unsigned uploads:

```
VITE_CLOUDINARY_CLOUD=your_cloud_name
VITE_CLOUDINARY_UNSIGNED_PRESET=your_unsigned_preset
```

Optional Mapbox static map preview on client:

```
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

Project Structure

```
server/
  src/
    app.js
    index.js
    config/
      env.js
      db.js
    middleware/
      auth.js
    routes/
      health.routes.js
      auth.routes.js
client/
  src/
    main.jsx
    App.jsx
    pages/
      Home.jsx
    components/
      Layout.jsx
    styles/
      index.css
```

Milestone Plan & Schedule (Aggressive, 2–3 weeks)

- Week 1
  - Day 1–2: Scaffold repo, auth API (signup/login), responsive UI shell
  - Day 3–4: Listings model + CRUD API, image upload stub, Home/Listing pages
  - Day 5: Search + filters (dates, guests, price), basic map stub

- Week 2
  - Day 6–7: Booking flow (availability, pricing, reservations)
  - Day 8: Host dashboard (manage listings/reservations)
  - Day 9: Payments integration (Stripe in test), server hooks
  - Day 10: Hardening (validation, rate limits, error handling)

- Week 3 (buffer / polish)
  - UI polish, accessibility, Lighthouse pass, e2e tests, deploy (Render + Vercel)

High‑Level Approach

1. Deliver thin vertical slices: auth → listings → booking → payments
2. Keep strong contracts via REST and consistent validation (Zod)
3. Prioritize responsive design and fast perceived performance
4. Use feature flags/placeholders for integrations; swap real keys later

Scripts

- Server
  - `npm run dev`: start with nodemon
  - `npm run start`: start production server

- Client
  - `npm run dev`: Vite dev server
  - `npm run build`: production build
  - `npm run preview`: preview production build

Notes

- Payments, maps, and image storage are pluggable; providers can be swapped
- Payments: a mock endpoint `POST /api/bookings/mock-pay` marks a booking as paid in dev. Replace with Stripe later (add a PaymentIntent step and webhooks).
- Add unit/integration tests as features stabilize


