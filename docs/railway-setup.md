# Railway Setup (alterescrow.com)

## Recommended services
- `backend` service from `/backend`
- `realtime` service from `/realtime`
- `frontend` service from `/frontend`

## Backend service
1. New Service -> Deploy from GitHub Repo.
2. Root Directory: `backend`.
3. Add vars: `JWT_SECRET`, `DATABASE_URL`, `REDIS_URL`, `RPC_URL`, `ESCROW_CONTRACT_ADDRESS`, `USDT_ADDRESS`.
4. Map custom domain: `api.alterescrow.com`.

## Realtime service
1. New Service -> same repo.
2. Root Directory: `realtime`.
3. Add vars: `ALLOWED_ORIGINS=https://app.alterescrow.com`.
4. Map custom domain: `ws.alterescrow.com`.

## Frontend service
1. New Service -> same repo.
2. Root Directory: `frontend`.
3. Add vars:
   - `NEXT_PUBLIC_API_BASE_URL=https://api.alterescrow.com`
   - `NEXT_PUBLIC_WS_URL=wss://ws.alterescrow.com`
   - `NEXT_PUBLIC_ESCROW_CONTRACT=<mainnet contract>`
4. Map custom domain: `app.alterescrow.com`.

## DNS records at your registrar
- CNAME `app` -> Railway frontend target
- CNAME `api` -> Railway backend target
- CNAME `ws` -> Railway realtime target
- Optional redirect root `alterescrow.com` -> `https://app.alterescrow.com`

## Mobile apps (Android/iOS)
- Use `https://api.alterescrow.com` as API base.
- Use `wss://ws.alterescrow.com` for chat/live status.
- Keep custody signing and admin logic server-side only.
