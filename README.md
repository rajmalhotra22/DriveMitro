## DriveMitro

DriveMitro is a local-first prototype for booking personal drivers in Patna. It includes public service and driver pages, customer and driver dashboards, admin workflows, booking/pricing APIs, seed data, and role-based demo accounts. All bundled people and activity are fictitious demo records; this is not a live driver service.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

```bash
npm ci
cp .env.example .env.local
```

Set `JWT_SECRET` in `.env.local` to a random value of at least 32 characters. For example, generate one with `openssl rand -base64 32`. Then start the app:

```bash
npm run dev
```

Open http://localhost:3000.

The app uses `.data/store.json` as a local development store and creates it on first run. This file is ignored by Git. To restore the sample dataset, run:

```bash
npm run seed
```

Seeding overwrites `.data/store.json` and resets local changes made through the app.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@drivemitro.com` | `MitroCustomer123!` |
| Driver | `driver@drivemitro.com` | `MitroDriver123!` |
| Admin | `admin@drivemitro.com` | `MitroAdmin123!` |

Use these accounts only in the local demo. Seeded drivers, reviews, verification states, prices, and bookings are illustrative, not claims about real people or service availability.

## Checks

```bash
npm test
npm run lint
npm run build
```

Vitest covers authentication helpers, booking rules/state transitions, and pricing calculations. `npm run lint` currently reports existing lint errors in parts of the UI; the production build and TypeScript check are separate and should also be run.

## Configuration and deployment status

- `.env.example` documents the local app URL, session secret, and optional support/email settings.
- Authentication uses bcrypt password hashes and an HTTP-only session cookie. Production startup requires `JWT_SECRET`.
- The current data adapter is a JSON file on local disk. It is intended for a single-process development demo only; it is not safe for multi-instance deployment and may not persist on serverless hosts.
- `mongoose` is present as a dependency, but no MongoDB/Atlas adapter is connected. Setting `MONGODB_URI` alone does not enable Atlas persistence. A production deployment requires implementing and validating a persistent database adapter first.
- Password reset does not deliver email without a configured provider. Demo payment is not a real payment, and driver verification must not be treated as a real-world background check.
- Before public bookings, arrange appropriate driver eligibility checks, legal and insurance review, operational support, secure production persistence, and payment/email integrations. Do not collect real card data in this prototype.

For a future Vercel deployment, configure `JWT_SECRET` and any provider credentials in Vercel's environment settings, but do not deploy this file-backed store for real customer data. Move persistence to a managed database and test authorization, backups, and concurrency before enabling production bookings.
