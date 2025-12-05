# START HERE - Project Status & Recovery

## Context
This project was migrated from a nested monorepo structure (`atap-solar/atap-solar`) to this clean root directory (`E:\atap-solar-web`) to resolve Railway deployment issues ("Script start.sh not found").

## Current State
1. **Files Moved**: All source code has been copied to this new root. `package.json` is now at the top level.
2. **Admin UI**: Features for the "News Portal Workflow" (Task Discovery -> Rewriter Batch Process -> Editorial Review) were implemented in `app/admin/page.tsx`.
3. **API Config**: `railway.json` was modified with `NEXT_PUBLIC_ADMIN_TOKEN`.

## Immediate Tasks for the Next Agent
The deployment pipeline needs a clean reset. Please perform the following:

1. **Clean Build Artifacts**: Remove any lingering `.next`, `node_modules`, or lock files that might have carried over paths from the old location.
   - `rm -rf .next node_modules package-lock.json`
2. **Re-install & Verify**:
   - `npm install`
   - `npm run build` (Ensure local build succeeds first)
3. **Git Initialization**:
   - This is a NEW folder. You need to initialize a fresh git repo.
   - `git init`
   - `git branch -M main`
   - `git add .`
   - `git commit -m "feat: migrate to clean repository structure for deployment"`
4. **Push & Deploy**:
   - Ask the user for the remote repository URL to push to.
   - Verify Railway detects the Node.js environment correctly (it should now, as `package.json` is in root).

## Known Configuration
- **Admin Token**: `@Eternalgy2025` (Configured in `railway.json` env vars)
- **API Base URL**: `https://api-atap-solar-production.up.railway.app` (Hardcoded fallback in `lib/` files)
