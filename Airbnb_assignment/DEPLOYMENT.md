# Deployment Guide

This project is split into two apps:
- API: `server/` (Node + Express)
- Web: `client/` (React + Vite)

## 1) Environment Variables

Server `.env` (see `server/.env.example`):
- `PORT` (default 4000)
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN` (your web origin, e.g. https://your-web.vercel.app)

Client `.env` (optional):
- `VITE_CLOUDINARY_CLOUD`, `VITE_CLOUDINARY_UNSIGNED_PRESET` (image uploads)
- `VITE_MAPBOX_TOKEN` (map preview)

## 2) Deploy API (Render or Railway)

Render (recommended quick start):
- New Web Service → Connect repo → Root: `server/`
- Runtime: Node
- Build command: `npm install`
- Start command: `npm run start`
- Add environment variables from above
- Set Health Check Path: `/api/health`

Railway (alternative):
- Create new service from repo, set root to `server/`
- Add env vars; set Start: `npm run start`

CORS: Ensure `CLIENT_ORIGIN` matches your deployed web URL.

## 3) Deploy Web (Vercel)

- New Project → Import repo → Root: `client/`
- Framework preset: Vite
- Build command: `npm run build`
- Output dir: `dist`
- Add client env vars if using Cloudinary or Mapbox
- After deploy, update API `CLIENT_ORIGIN` to the Vercel URL

## 4) Post-Deploy Checklist

- Open API `/api/health` and confirm `{ status: 'ok' }`
- Seed data (optional): POST to `/api/seed/seed`
- Verify Home page loads listings and filters
- Signup/Login works, create listing, book, mock pay

## 5) Custom Domain

- Point your domain to Vercel for the web
- API: add a custom domain in Render or use Render-provided subdomain

## 6) Next Steps (Prod Hardening)

- Add rate limiting and helmet on API
- Add logging, monitoring
- Stripe real payments (PaymentIntent + webhooks)
- Image moderation if needed
