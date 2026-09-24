# Life Science NEXTGEN

One-page website skeleton for Life Science NEXTGEN, with a Cloudflare Pages
Function and D1 database migration for network/event sign-ups.

## Project Structure

- `public/` contains the static website.
- `public/assets/` contains the temporary brand image Julie sent by email.
- `functions/api/signups.js` handles `POST /api/signups`.
- `migrations/0001_create_signups.sql` creates the D1 `signups` table.
- `wrangler.jsonc` contains the Cloudflare Pages and D1 binding config.

## D1 Setup

Create the D1 database in Cloudflare, then replace the placeholder UUID
`database_id` in `wrangler.jsonc` with the database ID returned by Wrangler.

```bash
npx wrangler d1 create life-science-nextgen-signups
npx wrangler d1 migrations apply life-science-nextgen-signups --remote
```

For local D1 testing:

```bash
npm install
npm run d1:migrate:local
npm run dev
```

The sign-up form stores:

- email
- role
- created_at timestamp

Duplicate email submissions return as already registered and do not create a
second row.

## Signup email notification

Each newly saved signup can send one notification through Resend. Duplicate
submissions do not send another notification. The signup remains saved even if
Resend is unavailable; a failed notification is logged by the Pages Function.

Configure these Cloudflare Pages environment variables for the production
deployment (and any preview environment where notifications are wanted):

- `RESEND_API_KEY` — a Resend sending API key; store this as a secret.
- `SIGNUP_NOTIFICATION_FROM` — sender address on a verified Resend domain;
  configured in `wrangler.jsonc` as `updates@lifesciencenextgen.com`.
- `SIGNUP_NOTIFICATION_TO` — recipient, configured in `wrangler.jsonc` as
  `Lene@womeninlifescience.dk`.

For local testing, set the same values in a gitignored `.dev.vars` file. Never
commit the API key. If any value is missing, signups still save but no email is
sent. Deploy the updated Pages Function after configuring the variables.
