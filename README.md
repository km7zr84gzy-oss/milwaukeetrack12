# MilwaukeeTrack

Professional real-time shipment tracking platform.

**Stack:** Next.js 15 (App Router) + Prisma 7 + Aurora PostgreSQL + NextAuth + Amazon SES + Tailwind

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Required Environment Variables (`.env`)

```env
DATABASE_URL="postgresql://...aurora...amazonaws.com:5432/postgres?sslmode=require"

NEXTAUTH_SECRET="your-strong-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

SES_ACCESS_KEY_ID="AKIA..."
SES_SECRET_ACCESS_KEY="..."
SES_REGION="us-east-2"
SES_FROM_EMAIL="markdietz112@icloud.com"
SES_FROM_NAME="MilwaukeeTrack"
```

## Production: AWS Amplify Deployment

This project is configured for **Amplify Hosting** with Prisma.

### 1. Connect Repository in Amplify Console

1. Go to AWS Amplify → Hosting → Create new app
2. Connect GitHub / GitLab / Bitbucket (or manual deploy)
3. Select branch `main`

### 2. Add All Required Environment Variables

**In Amplify Console → App Settings → Environment variables**, add:

- `DATABASE_URL` (Aurora Postgres connection string)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (https://your-app.amplifyapp.com)
- `SES_ACCESS_KEY_ID`
- `SES_SECRET_ACCESS_KEY`
- `SES_REGION`
- `SES_FROM_EMAIL`
- `SES_FROM_NAME`

### 3. Build Settings (Amplify auto-detects `amplify.yml`)

The included [amplify.yml](amplify.yml) handles:
- `npm ci`
- `npx prisma generate`
- `npm run build` (which runs `prisma generate && next build`)

Node version is pinned via [.nvmrc](.nvmrc) (Node 22.12 — required by Prisma 7).

### 4. Common Amplify + Prisma Fixes (Already Applied Here)

- `prisma generate` runs in both `postinstall` and the build script
- `serverExternalPackages: ['@prisma/client']` in `next.config.ts`
- `prisma.config.ts` + dotenv for flexible datasource loading
- Proper Prisma singleton in `lib/prisma.ts`

### 5. After First Deploy

- Run any needed `prisma db push` or migrations via Amplify SSH or locally with production `DATABASE_URL`
- Seed data if required

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` — Full production build (includes Prisma generate)
- `npm run postinstall` — Auto-generates Prisma client after install
- `npx prisma studio` — GUI for your Aurora DB

## Architecture Highlights

- **Public tracking** — `/api/track?number=...` works without login
- **Protected dashboard** — `/dashboard` (NextAuth + middleware)
- **Registration & login** — Credentials provider with bcrypt
- **Email notifications** — Amazon SES via `@aws-sdk/client-ses` (see `lib/email.ts`)
- **Models** — User, Shipment, TrackingEvent (full history)

---

**Status:** ✅ Ready for Amplify (see build results below)
