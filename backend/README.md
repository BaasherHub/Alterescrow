# Backend Service

## Run locally
1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL`
3. `npm install`
4. `npm run migrate`
5. `npm run dev`

## Railway
- Root Directory: `backend`
- Start command: `npm run start`
- Startup auto-runs migration.

## Custodial wallet model
- Users get internal custody accounts (not self-custody private keys).
- `wallets.custody_account_id` is the user-facing internal wallet identifier.
- `treasury_address` points to your platform hot/treasury wallet.
- `ledger_available` and `ledger_locked` store internal balances.

## Env keys to set
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `CUSTODY_TREASURY_ADDRESS`
- `ADMIN_EMAIL`
