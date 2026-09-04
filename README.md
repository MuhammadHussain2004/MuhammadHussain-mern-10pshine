# MuhammadHussain-mern-10pshine

A MERN notes application with backend and frontend components.

## Project structure

- `backend/` — Express API, MySQL database, authentication, notes logic
- `frontend/` — React app for login, register, dashboard, and notes management

## Run locally

1. Start backend:
   - `cd backend`
   - `npm install`
   - Copy `.env.example` to `.env` and fill in your MySQL credentials (the app auto-creates the database and tables on first run)
   - `npm start`

2. Start frontend:
   - `cd frontend`
   - `npm install`
   - `npm start`

## Deploying to Vercel (backend + frontend)

Both the backend and frontend can be deployed as separate Vercel projects.

### Backend

1. In Vercel, add the **TiDB Cloud** integration (Marketplace → TiDB Cloud) to provision a free MySQL-compatible database — this automatically injects `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD`, and `TIDB_DATABASE` into your project's environment variables.
2. Create a new Vercel project from this repo with **Root Directory** set to `backend`.
3. Add these additional environment variables in the Vercel project settings: `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `BYPASS_EMAIL`.
4. Deploy. The API will be served at `https://<your-backend-project>.vercel.app/api/...`.

### Frontend

1. Create a Vercel project from this repo with **Root Directory** set to `frontend`.
2. Set the environment variable `REACT_APP_API_URL` to `https://<your-backend-project>.vercel.app/api`.
3. Deploy (or redeploy, since Create React App bakes environment variables in at build time — changing this variable requires a new build).
