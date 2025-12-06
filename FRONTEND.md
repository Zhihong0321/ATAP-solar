# Frontend Preview Guide

## Prereqs
- Node 18+ and PNPM (recommended) or npm.

## Install
```sh
pnpm install
# or
npm install
```

## Run Dev Server
```sh
pnpm dev
# or
npm run dev
```
Visit http://localhost:3000

## Build & Start (Railway-ready)
```sh
pnpm build
pnpm start
```

## Notes
- Layout uses Next.js App Router with Tailwind; output is `standalone` for Railway.
- To use live API, set `NEXT_PUBLIC_API_BASE_URL` (and `API_BASE_URL` for SSR) to your API service URL.

## Admin UI (simple CMS)
- Visit `/admin` in the app to manage news (create, edit, publish/unpublish, highlight, delete).
- Enter your admin token (`x-admin-token`, e.g., from `ADMIN_TOKEN` env) in the token field; it is stored in localStorage for convenience.
- Changes call the backend API directly; ensure `NEXT_PUBLIC_API_BASE_URL` points to the live API.
