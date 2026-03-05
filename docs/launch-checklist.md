# Launch Checklist (alterescrow.com)

1. Contracts
- Run compile and tests.
- Deploy on BSC testnet.
- Verify on BSCScan.
- Deploy to mainnet only after full QA.

2. Backend on Railway
- Deploy backend service from /backend.
- Set environment variables from .env.example.
- Add database and Redis addons.
- Restrict admin routes with role checks.

3. Realtime on Railway
- Deploy realtime service from /realtime.
- Configure allowed origins to app domain.
- Attach rate limiting and auth token handshake.

4. Frontend
- Deploy frontend from /frontend (or separate repo).
- Point API and WS envs to production domains.

5. Domain
- Point DNS for alterescrow.com.
- Suggested subdomains:
  - app.alterescrow.com (frontend)
  - api.alterescrow.com (backend)
  - ws.alterescrow.com (realtime)

6. Mobile
- Use the same backend API and WS endpoints.
- Keep private keys server-side only.
- Use deep links to app.alterescrow.com trade pages.
