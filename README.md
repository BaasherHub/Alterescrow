# AlterEscrow Monorepo

Production-oriented project structure for launch on web, Android, and iOS.

## Structure
- contracts/: Solidity contracts
- scripts/: Hardhat deploy scripts
- test/: Hardhat tests
- backend/: API and transaction services (Phase 2)
- frontend/: web app scaffold and plan (Phase 3)
- realtime/: Socket.io service scaffold (Phase 4)
- docs/: launch and operations docs

## Smart Contract Commands
- npm install
- npm run compile
- npm test
- npm run deploy:testnet
- npm run deploy:mainnet

## Current Contract Rules
- Disputes are allowed only after buyer marks payment as sent.
- Auto-release is allowed 1 hour after paidAt.
- Seller can still manually release while disputed.

## Domain Plan
- app.alterescrow.com for web UI
- api.alterescrow.com for backend API
- ws.alterescrow.com for Socket.io updates

## Next Actions
- Git push guide: `docs/github-push.md`
- Railway deployment guide: `docs/railway-setup.md`
- Launch checklist: `docs/launch-checklist.md`

## Frontend Quickstart
```bash
cd frontend
npm install
npm run dev
```

## Backend Quickstart
```bash
cd backend
npm install
npm run dev
```

## Realtime Quickstart
```bash
cd realtime
npm install
npm run dev
```
