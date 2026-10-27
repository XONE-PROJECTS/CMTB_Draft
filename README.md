# CMTBuilders website

Next.js and TypeScript website for CMTBuilders & RapidMix Concrete Solutions Inc. The application uses the App Router, Tailwind CSS, Supabase Auth, and Supabase Postgres.

## Requirements

- Node.js 20 or newer
- npm
- A Supabase project
- Optional: Graphify for local codebase analysis

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set these values in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The service-role key is server-only and must never be prefixed with `NEXT_PUBLIC_`.

## Supabase configuration

Apply the migrations in `supabase/migrations/` to create the inquiry and admin tables. Add authorized users to `public.admin_users` with `role = 'super_admin'`. Configure Google OAuth and email templates in Supabase Auth. Signup confirmation emails should contain the six-digit `{{ .Token }}` value so `/register` can verify it with Supabase OTP.

Add these redirect URLs in Supabase:

- `http://localhost:3000/auth/callback`
- `https://YOUR_DOMAIN/auth/callback`

The inquiry form posts to `/api/inquiries`. The route validates input, ignores honeypot submissions, inserts through the server-only service-role client, and returns `{ ok, reference }` on success.

## Routes

- `/`, `/about`, `/services`, `/equipment`, `/projects`, `/projects/[slug]`, `/compliance`, `/contact`
- `/login`, `/register`, `/forgot-password`, `/reset-password`
- `/admin` — server-protected super-admin inquiry dashboard
- `/auth/callback` and `/api/inquiries`

The `/admin` route requires a Supabase user with `app_metadata.role` set to `super_admin`. The role is checked server-side with `auth.getUser()` before the server-only client reads inquiries.

## Checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run start
```

## Deployment

Deploy to any Node-compatible host or Vercel. Configure the four environment variables in the deployment environment, add the production callback URL to Supabase, and run the normal Next.js build.

## Graphify

Install the current code-knowledge tool outside the project:

```bash
uv tool install graphifyy
graphify install
```

Graphify is intentionally not an application dependency and generated graph data should remain untracked.
