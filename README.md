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



# Code Snippets

## Wrong Page Addresses Are Handled Automatically

```tsx
<Route
  path="*"
  element={
    <Navigate
      to={VIEW_PATHS.sitemap}
      replace
    />
  }
/>
```

**Why it is useful:**  
If someone enters a wrong or unavailable page address, the application automatically redirects them to a valid page instead of showing a confusing error or empty screen. This creates a smoother and more reliable user experience.

---

## Each Feature Has Its Own Route

```tsx
<Routes>
  <Route
    path={VIEW_PATHS.sitemap}
    element={<SiteMapView apiKey={googleMapsApiKey} />}
  />

  <Route
    path={VIEW_PATHS.tracking}
    element={<LiveTrackingView apiKey={googleMapsApiKey} />}
  />

  <Route
    path={VIEW_PATHS.beats}
    element={<BeatManagementView />}
  />
</Routes>
```

**Why it is useful:**  
Each major feature has its own page and URL, keeping the application organized and easier to maintain. Users can directly access site mapping, live tracking, or beat management without navigating through unnecessary screens.

---

## Live Movement Can Be Displayed as a Real Driving Route

```tsx
<DirectionsService
  options={{
    origin: {
      lat: recentWaypoints[0].lat,
      lng: recentWaypoints[0].lng,
    },
    destination: {
      lat: recentWaypoints[recentWaypoints.length - 1].lat,
      lng: recentWaypoints[recentWaypoints.length - 1].lng,
    },
    travelMode: google.maps.TravelMode.DRIVING,
    waypoints: recentWaypoints.slice(1, -1).map((point) => ({
      location: {
        lat: point.lat,
        lng: point.lng,
      },
    })),
  }}
  callback={directionsCallback}
/>
```

**Why it is useful:**  
Instead of displaying disconnected GPS points, the application converts location data into an actual driving route. This is useful for security patrols, delivery operations, field employees, and logistics systems where organizations need to understand where someone traveled and which route they followed.

---

## Map Markers Are Optimized for Live Tracking

```tsx
const MarkerComponent = React.memo(
  ({
    point,
    index,
    activeMarker,
    setActiveMarker,
  }: MarkerComponentProps) => {

    const handleMarkerClick = useCallback(() => {
      setActiveMarker(index);
    }, [index, setActiveMarker]);

    const handleCloseClick = useCallback(() => {
      setActiveMarker(null);
    }, [setActiveMarker]);

    if (!point?.lat || !point?.lng) return null;

    return (
      <Marker
        position={{
          lat: point.lat,
          lng: point.lng,
        }}
        onClick={handleMarkerClick}
      >
        {activeMarker === index && (
          <InfoWindow onCloseClick={handleCloseClick}>
            <div>
              <b>Agent:</b> {point.agent_name}
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  }
);
```

**Why it is useful:**  
`React.memo` and `useCallback` help reduce unnecessary component updates when multiple markers are displayed. This is especially useful in live GPS tracking applications, where location information may change frequently and efficient rendering helps keep the interface responsive.


## Operational Data Can Be Filtered Instantly

```tsx
const filteredData = useMemo(() => {
  return DUMMY_BEAT_ASSIGNMENTS.filter((item) => {
    const matchesStatus = statusFilter
      ? item.status === statusFilter
      : true;

    const matchesShift = shiftFilter
      ? item.shift === shiftFilter
      : true;

    return matchesStatus && matchesShift;
  });
}, [shiftFilter, statusFilter]);

const summary = useMemo(() => {
  const active = filteredData.filter(
    (item) => item.status === "Active"
  ).length;

  const onHold = filteredData.filter(
    (item) => item.status === "On Hold"
  ).length;

  const completed = filteredData.filter(
    (item) => item.status === "Completed"
  ).length;

  return {
    total: filteredData.length,
    active,
    onHold,
    completed,
  };
}, [filteredData]);
```

**Why it is useful:**  
Managers can quickly filter assignments by status or shift while the application automatically recalculates operational totals. In real-world workforce and security systems, this makes it easier to see what is active, completed, or on hold and allows teams to make faster operational decisions.

