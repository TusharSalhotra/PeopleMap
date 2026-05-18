# Live Entities Google Maps

React dashboard for showcasing live entity tracking with Google Maps. The app includes:

- Site map with location markers and a polygon boundary
- Live tracking view with officer filters, route rendering, and pagination
- Beat management dashboard with summary cards and table filters
- Local dummy data for demo and portfolio use

## Tech Stack

- React 18
- TypeScript
- Create React App
- Ant Design
- Google Maps JavaScript API

## Local Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Add your Google Maps browser key:

   ```bash
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_browser_key
   ```

4. Start the app:

   ```bash
   npm start
   ```

## Deploy To Vercel

Import this repository in Vercel:

```text
TusharSalhotra/Live-Entities-Google-Maps
```

Use these project settings:

- Framework Preset: Create React App
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `build`

Add this environment variable in Vercel Project Settings:

```text
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_browser_key
```

After saving the variable, redeploy the project. The included `vercel.json` handles the production build and SPA routing fallback.
