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
- Run one-off: `npm run migrate`


Railway note: backend start script now auto-runs migration (
pm run migrate && node src/server.js).

