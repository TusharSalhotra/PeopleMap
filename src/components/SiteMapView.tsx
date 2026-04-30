import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  Polygon,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Spin } from "antd";
import { GOOGLE_API_KEY, DUMMY_SITE_LOCATIONS, SiteLocation } from "../dummyData";
import "./SiteMapView.css";

type Coordinate = { lat: number; lng: number };

function findCenter(points: Coordinate[]): Coordinate {
  const len = points.length;
  if (!len) return { lat: 0, lng: 0 };
  const sum = points.reduce((acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }), { lat: 0, lng: 0 });
  return { lat: sum.lat / len, lng: sum.lng / len };
}

function findAngles(center: Coordinate, points: any[]) {
  return points.map((p) => ({
    ...p,
    angle: Math.atan2(p.lng - center.lng, p.lat - center.lat),
  }));
}

export default function SiteMapView() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_API_KEY,
  });

  const mapRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const listenersRef = useRef<any[]>([]);

  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [path, setPath] = useState<Coordinate[]>([]);
  const [centerPath, setCenterPath] = useState<Coordinate | undefined>();
  const [markersData, setMarkersData] = useState<any[]>([]);

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng: any) => ({ lat: latLng.lat(), lng: latLng.lng() }));
      setPath(nextPath);
    }
  }, []);

  const onLoad = useCallback(
    (polygon: any) => {
      polygonRef.current = polygon;
      const p = polygon.getPath();
      listenersRef.current.push(
        p.addListener("set_at", onEdit),
        p.addListener("insert_at", onEdit),
        p.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((l) => l.remove());
    polygonRef.current = null;
  }, []);

  useEffect(() => {
    const latLng: (Coordinate & SiteLocation)[] = DUMMY_SITE_LOCATIONS.map((loc) => ({
      ...loc,
      lat: loc.location_lat,
      lng: loc.location_lon,
    }));

    latLng.sort((a, b) => a.lat - b.lat);

    if (latLng.length > 3 && latLng[0] !== latLng[latLng.length - 1]) {
      latLng.push({ ...latLng[0] });
    }

    const polygonCenter = findCenter(latLng);
    const withAngles = findAngles(polygonCenter, latLng).sort((a: any, b: any) =>
      a.angle > b.angle ? 1 : a.angle < b.angle ? -1 : 0
    );

    setCenterPath(findCenter(latLng));
    setMarkersData(latLng);
    setPath(withAngles.length < 3 ? [] : withAngles);
  }, []);

  const getCurrentLocationAndRedirect = (destLat: number, destLon: number) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${destLat},${destLon}`;
        window.open(url, "_blank");
      },
      () => {
        alert("Unable to get current location.");
      }
    );
  };

  if (!isLoaded) {
    return (
      <div className="map-loader">
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <h2 className="view-title">Site Map View</h2>
      <p className="view-subtitle">
        Showing {DUMMY_SITE_LOCATIONS.length} security sites with polygon boundary overlay.
      </p>
      <GoogleMap
        center={centerPath}
        ref={mapRef}
        mapContainerClassName="map-container"
        zoom={12}
        onUnmount={onUnmount}
        mapTypeId="terrain"
      >
        {markersData.map((markerValue: any) => (
          <Marker
            key={markerValue.id}
            position={{ lat: markerValue.lat, lng: markerValue.lng }}
            onClick={() => setActiveMarker(markerValue.id === activeMarker ? null : markerValue.id)}
          >
            {activeMarker === markerValue.id && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="info-marker-wrap">
                  <div className="site-name-marker">
                    {markerValue.site_id} – {markerValue.site_name}
                  </div>
                  <div className="marker-cont c-mb-2">
                    <span className="key-value">Beat Id:</span>
                    <span className="label-values">{markerValue.beat_id}</span>
                  </div>
                  <div
                    onClick={() =>
                      getCurrentLocationAndRedirect(markerValue.location_lat, markerValue.location_lon)
                    }
                    className="get-directions"
                  >
                    Get Directions&nbsp;
                    <i className="fa fa-location-arrow" style={{ color: "#1890ff" }} />
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}

        {path.length >= 3 && (
          <Polygon
            path={path}
            onMouseUp={onEdit}
            onDragEnd={onEdit}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              fillColor: "#1890ff",
              fillOpacity: 0.1,
              strokeColor: "#1890ff",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
