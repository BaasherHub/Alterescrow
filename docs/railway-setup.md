# Railway Setup

Services from same repo:
- backend (Root Directory: `backend`)
- frontend (Root Directory: `frontend`)
- realtime (Root Directory: `realtime`)

## Backend variables
- PORT=3000
- NODE_ENV=production
- DATABASE_URL=<Railway Postgres URL>
- JWT_SECRET=<strong secret>
- JWT_EXPIRES_IN=7d
- RPC_URL=https://bsc-dataseed1.binance.org/
- ESCROW_CONTRACT_ADDRESS=<address>
- USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
- KMS_PROVIDER=aws
- KMS_KEY_ID=<key id>
- ADMIN_EMAIL=admin@alterescrow.com

After backend deploy, run one-off command:
- `npm run migrate`

## Frontend variables
- NEXT_PUBLIC_API_BASE_URL=https://api.alterescrow.com
- NEXT_PUBLIC_WS_URL=wss://ws.alterescrow.com
- NEXT_PUBLIC_ESCROW_CONTRACT=<address>
- NEXT_PUBLIC_USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955

## Domains
- app.alterescrow.com -> frontend
- api.alterescrow.com -> backend
- ws.alterescrow.com -> realtime
