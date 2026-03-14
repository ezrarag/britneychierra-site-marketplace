# Britney Chierra Site Marketplace

## What Was Added

- Admin area in hamburger menu (`/admin`)
- Password-gated admin dashboard (default password: `temp123`)
- Firebase-backed music + shop catalog APIs
- Firebase-backed editable About page (`/about`)
- Seed endpoint to move default entries into Firestore
- Cart that supports both music and shop items
- Stripe Checkout API route ready for Connect destination account

## Data Audit

Hard-coded arrays were previously in:
- `app/music/page.tsx`
- `app/marketplace/page.tsx`

Audit details: `AUDIT.md`

## Required Environment Variables

Create `.env.local` with:

```bash
# Admin UI password (optional; defaults to temp123)
ADMIN_DASHBOARD_PASSWORD=temp123

# Firebase client (public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_CONNECT_ACCOUNT_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## How Admin Works

1. Open `/admin`
2. Sign in with password (`temp123` unless overridden)
3. Click `Seed Firestore from current defaults` once (after Firebase env vars are set)
4. Add/edit/delete entries in Music, Shop, and About
5. Use the image upload inputs to push photos into Firebase Storage and auto-fill the image URL

## Stripe Checkout

`POST /api/checkout` creates a Checkout Session from the cart.

- Uses catalog prices from Firestore (`priceCents`)
- Supports optional Connect destination transfer when `STRIPE_CONNECT_ACCOUNT_ID` is set

## Development

```bash
pnpm install
pnpm dev
```
