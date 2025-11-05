# HealthQueue (client)

This is the Next.js client for the HealthQueue app.

Quick setup (local):

1. Copy `.env.example` to `.env.local` and set `MONGODB_URI`.

2. Install deps and run dev:

   npm install
   npm run dev

3. Visit http://localhost:3000 (or the port shown in the terminal).

Production notes:

- The project expects a MongoDB URI in `MONGODB_URI`.
- For production, run `npm run build` and `npm start` (or use your platform's recommended Next.js deployment).
- The `middleware.ts` file performs a basic cookie-based redirect for unauthenticated users. Review this file before deploying to ensure it matches your auth strategy and hosting setup.

Next steps I can take (suggested):

- Add simple API endpoint tests and a CI workflow.
- Validate TypeScript types across API route handlers.
- Replace deprecated middleware conventions if upgrading to Next.js versions that require `proxy` instead of `middleware`.
