# JobMatch AI Backend

This is the Express.js backend for the JobMatch AI platform.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables in `.env`:
   ```env
   DB=mongodb://localhost:27017/jobboard
   JWTPRIVATEKEY=your_jwt_key
   SALT=10
   OPENAI_API_KEY=your_openai_api_key
   ALLOWED_ORIGINS=http://localhost:3000
   ```
3. (Optional) Initialize admin user and seed jobs:
   ```bash
   node initAdmin.js
   node seedJobs.js
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The API will run at http://localhost:8080

## API Endpoints
- See the API documentation at the root endpoint (`/`).

## Production
- The backend is deployed to Railway.
- Set all environment variables in Railway dashboard, including `ALLOWED_ORIGINS` (comma-separated for multiple origins).

## Lint & Test
```bash
npm run lint
npm run test
```

---
For more details, see the main project [README](../README.md).
