# JobMatch AI Frontend

This is the React frontend for the JobMatch AI platform.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   The app will run at http://localhost:3000

## Environment Variables
- `REACT_APP_API_URL` - The backend API URL (e.g., http://localhost:8080 or your Railway deployment URL)

## Production
- The frontend is deployed to Vercel.
- Update `REACT_APP_API_URL` in your Vercel project settings to point to your backend API.

## Build
To create a production build:
```bash
npm run build
```

## Lint & Test
```bash
npm run lint
npm run test
```

---
For more details, see the main project [README](../README.md).
