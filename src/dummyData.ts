// ─── Dummy data used across all map views ────────────────────────────────────

export const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your key

// Company / branch center coordinate (New York City area)
export const COMPANY_CENTER = { lat: 40.7128, lng: -74.006 };

// ─── Site-Map data (used in SiteMapView) ────────────────────────────────────
export interface SiteLocation {
  id: number;
  site_id: string;
  site_name: string;
  beat_id: string;
  location_lat: number;
  location_lon: number;
}

export const DUMMY_SITE_LOCATIONS: SiteLocation[] = [
  {
    id: 1,
    site_id: "S-001",
    site_name: "Central Park Security Post",
    beat_id: "B-01",
    location_lat: 40.7829,
    location_lon: -73.9654,
  },
  {
    id: 2,
    site_id: "S-002",
    site_name: "Times Square Patrol",
    beat_id: "B-02",
    location_lat: 40.758,
    location_lon: -73.9855,
  },
  {
    id: 3,
    site_id: "S-003",
    site_name: "Brooklyn Bridge Watch",
    beat_id: "B-03",
    location_lat: 40.7061,
    location_lon: -73.9969,
  },
  {
    id: 4,
    site_id: "S-004",
    site_name: "Midtown Office Guard",
    beat_id: "B-04",
    location_lat: 40.7549,
    location_lon: -73.984,
  },
  {
    id: 5,
    site_id: "S-005",
    site_name: "East Village Station",
    beat_id: "B-05",
    location_lat: 40.7264,
    location_lon: -73.9818,
  },
];

// ─── Live-tracking data (used in LiveTrackingView) ───────────────────────────
export interface TrackingPoint {
  id: number;
  lat: number;
  lng: number;
  agent_name: string;
  type?: string;
  patrol?: boolean;
  standing?: boolean;
  created_at: string;
}

export const DUMMY_EMPLOYEES = [
  { id: 101, badge_number: "B-101", first_name: "John", last_name: "Smith" },
  { id: 102, badge_number: "B-102", first_name: "Sarah", last_name: "Connor" },
  { id: 103, badge_number: "B-103", first_name: "Mike", last_name: "Johnson" },
];

export const DUMMY_LOGGED_USERS: TrackingPoint[] = [
  {
    id: 1,
    lat: 40.7128,
    lng: -74.006,
    agent_name: "John Smith",
    patrol: true,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 2,
    lat: 40.7215,
    lng: -73.9956,
    agent_name: "Sarah Connor",
    standing: true,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 3,
    lat: 40.73,
    lng: -74.0,
    agent_name: "Mike Johnson",
    patrol: true,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

// Waypoints for a single officer's route trace
export const DUMMY_ROUTE_WAYPOINTS: TrackingPoint[] = [
  {
    id: 10,
    lat: 40.7128,
    lng: -74.006,
    agent_name: "John Smith",
    type: "Patrol Start",
    patrol: true,
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 11,
    lat: 40.716,
    lng: -74.001,
    agent_name: "John Smith",
    type: "Checkpoint A",
    patrol: true,
    created_at: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: 12,
    lat: 40.72,
    lng: -73.997,
    agent_name: "John Smith",
    type: "Checkpoint B",
    patrol: true,
    created_at: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: 13,
    lat: 40.724,
    lng: -73.992,
    agent_name: "John Smith",
    type: "Break",
    patrol: true,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 14,
    lat: 40.728,
    lng: -73.989,
    agent_name: "John Smith",
    type: "Checkpoint C",
    patrol: true,
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 15,
    lat: 40.732,
    lng: -73.985,
    agent_name: "John Smith",
    type: "Patrol End",
    patrol: true,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
];
