# AGENTS.md

## Project

CMTBuilders is a Next.js App Router application written in TypeScript. The public site is under `app/(site)`, reusable UI is under `src/components`, static content is under `src/components/data`, and Supabase integration is under `src/supabase`.

## Local setup

1. Install Node.js 20+ and npm.
2. Copy `.env.example` to `.env.local` and fill in the Supabase project values.
3. Run `npm install`.
4. Apply the SQL migrations in `supabase/migrations/` to the Supabase project.
5. Run `npm run dev` and open `http://localhost:3000`.

## Commands

- `npm run dev` — local Next.js development server.
- `npm run typecheck` — TypeScript validation.
- `npm run lint` — ESLint validation.
- `npm run test` — Vitest unit tests.
- `npm run build` — production build.
- `npm run start` — serve the production build.

## Architecture rules

- Use App Router route files instead of React Router.
- Use `next/link`, `next/navigation`, and route handlers under `app/api`.
- Add `"use client"` only to components that require state, effects, event handlers, or browser APIs.
- Keep public Supabase values in `NEXT_PUBLIC_*`; never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.
- All inquiry input must be validated again in `app/api/inquiries/route.ts`; browser validation is only a usability feature.
- Keep the inquiry table inaccessible to direct anonymous database writes. The server route uses the service-role client.
- Protect `/admin` with server-side `auth.getUser()` plus a row in `public.admin_users` with `role = "super_admin"`. Keep `app_metadata.role` as a secondary claim only; never authorize from `user_metadata` or client-only state.
- Keep admin inquiry reads on the server; never import the service-role client into a client component.
- Preserve the existing content, accessibility labels, responsive behavior, and external image URLs unless the task explicitly changes them.

## Authentication

Supabase Auth provides email/password login, six-digit signup verification, Google OAuth, password reset, and cookie-based sessions. OAuth and recovery links return through `/auth/callback`. Same-origin return URLs must continue to be validated by `safeReturnTo`.

## Graphify

Graphify is a developer tool installed outside the app. Install it with `uv tool install graphifyy` and register it with `graphify install`. Do not add it to `package.json` or commit generated graph output.

## Completion checks

Run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` before handing off changes. Do not commit `.env.local`, secrets, `.next`, `.next-build`, coverage output, or generated Graphify data.
