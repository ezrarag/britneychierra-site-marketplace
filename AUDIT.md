# Data Audit (2026-03-06)

## Current hard-coded data locations (before Firebase migration)

- `music` entries were hard-coded in:
  - `app/music/page.tsx` (`const tracks = [...]`)
- `shop` entries were hard-coded in:
  - `app/marketplace/page.tsx` (`const featuredOutfits = [...]`)

## Migration approach implemented

- Seed values extracted into:
  - `lib/seed-data.ts`
- API routes now read from Firebase Admin (with seed fallback if Firebase is not configured):
  - `GET/POST/PUT/DELETE /api/music`
  - `GET/POST/PUT/DELETE /api/shop`
- Admin-only seed endpoint:
  - `POST /api/admin/seed`
- Front-end pages now consume API data:
  - `app/music/page.tsx`
  - `app/marketplace/page.tsx`

## New admin and commerce capabilities

- Added `ADMIN` entry in hamburger menu (`components/navigation.tsx`)
- Added password-gated admin dashboard (`app/admin/page.tsx`)
  - default password: `temp123` (overridable via `ADMIN_DASHBOARD_PASSWORD`)
- Added cart for both music + shop items (`components/cart-provider.tsx`, `app/cart/page.tsx`)
- Added Stripe Checkout session route:
  - `POST /api/checkout`
