# DeployTrack Backend

Node.js + Express + MongoDB API for DeployTrack.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env` and set `MONGODB_URI`, `JWT_SECRET`, etc.
   - Defaults: `PORT=5000`, `MONGODB_URI=mongodb://localhost:27017/deploytrack`

3. **MongoDB**
   - Ensure MongoDB is running locally, or use a cloud URI in `.env`.

## Run

```bash
npm run dev   # development (watch mode)
npm start     # production
```

Server runs at `http://localhost:5000`. API base: `http://localhost:5000/api`.

## API

- `POST /api/auth/signup` – register; body `{ name, email, password }`
- `POST /api/auth/login` – login; body `{ email, password }`
- `GET /api/projects` – list projects (auth)
- `POST /api/projects` – create project (auth); body `{ name, description? }`
- `GET /api/deployments/:projectId` – list deployments (auth)
- `GET /api/incidents` – list incidents (auth)
- `GET /api/logs/:deploymentId` – list logs (auth)
- `POST /api/webhooks/projects/:projectId` – webhook for CI/CD (no auth; uses `X-Webhook-Signature`)

All success responses: `{ success: true, data }`. Errors: `{ success: false, message }`.
