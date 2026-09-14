# Redline Supplements — store

A complete storefront: **Next.js** (frontend) + **Supabase** (Postgres database) + **Stripe Checkout** (payments). Sells standard retail supplements. You can have this live today.

---

## What you'll need (all have free tiers)

- A [Supabase](https://supabase.com) account
- A [Stripe](https://stripe.com) account
- A [Vercel](https://vercel.com) account (to host it)
- [Node.js](https://nodejs.org) 18+ installed locally

---

## Step 1 — Set up the database (5 min)

1. Create a new project at supabase.com.
2. In the left menu open **SQL Editor** → **New query**.
3. Paste the entire contents of `supabase/schema.sql` and click **Run**. This creates the tables, security rules, and 6 starter products.
4. Go to **Project Settings → API** and copy three values, you'll need them in Step 3:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key

## Step 2 — Set up payments (5 min)

1. In Stripe, switch to **Test mode** (toggle, top right) while you build.
2. **Developers → API keys** → copy the **Secret key** (`sk_test_…`).
3. Leave the webhook for now — you'll wire it up in Step 6.

## Step 3 — Configure the app (2 min)

1. In this folder, copy `.env.local.example` to a new file called `.env.local`.
2. Fill in the five values from Steps 1–2. Leave `STRIPE_WEBHOOK_SECRET` blank for now.

## Step 4 — Run it locally (2 min)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Add items, click **Checkout** → you'll land on Stripe's hosted payment page. Use test card `4242 4242 4242 4242`, any future expiry, any CVC.

## Step 5 — Deploy live (10 min)

1. Push this folder to a new GitHub repo.
2. At vercel.com → **Add New → Project** → import that repo.
3. Before deploying, add all the environment variables from your `.env.local` in Vercel's **Environment Variables** screen. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL (e.g. `https://redline-store.vercel.app`).
4. Deploy. You now have a live store.

## Step 6 — Record paid orders (optional but recommended)

1. In Stripe → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://YOUR-SITE/api/webhook`
3. Event to send: `checkout.session.completed`.
4. Copy the **Signing secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy. Paid orders will now be written to your `orders` table.

## Step 7 — Go live for real

1. In Stripe, complete account activation and switch from Test to **Live** mode; swap the `sk_test_…` key for the live one in Vercel.
2. Point your domain (`redlinesupplements.com.au`) at the Vercel project (**Settings → Domains**).

---

## Managing products

Edit products straight from **Supabase → Table Editor → products**. Add a row, set `active` to `true`, and it appears on the site within a minute. `price_cents` is in cents (4995 = $49.95). Drop an image URL into `image_url` if you want product photos (or extend the card in `app/StoreClient.jsx`).

## File map

```
supabase/schema.sql        tables + security + seed data
lib/supabase.js            database connections
app/page.jsx               loads products (server)
app/StoreClient.jsx        product grid + cart (browser)
app/api/checkout/route.js  creates the Stripe payment session
app/api/webhook/route.js   saves orders after payment
app/success/page.jsx       post-purchase thank-you page
```

## One thing to keep in mind

Stripe (and every mainstream card processor) only lets you sell products that are legal to sell direct to the public. This build is seeded for standard retail supplements — creatine, protein, pre-workout and the like — which is exactly what keeps your Stripe account in good standing. Keep the catalogue to that and you're set. Prescription-only products can't run through a checkout like this.
