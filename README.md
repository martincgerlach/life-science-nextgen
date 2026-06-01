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
