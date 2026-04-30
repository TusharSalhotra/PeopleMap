import React, { useState, useCallback, useRef } from "react";
import { Marker, InfoWindow, Circle } from "@react-google-maps/api";
import moment from "moment";
import { TrackingPoint } from "../dummyData";

interface MarkerComponentProps {
  point: TrackingPoint;
  index: number;
  activeMarker: number | null;
  setActiveMarker: (index: number | null) => void;
  markers_data: TrackingPoint[];
  user_id: number | null;
}

const MarkerComponent = React.memo(
  ({ point, index, activeMarker, setActiveMarker, markers_data, user_id }: MarkerComponentProps) => {
    const markerRef = useRef<google.maps.Marker | null>(null);

    const handleMarkerClick = useCallback(() => {
      setActiveMarker(index);
    }, [index, setActiveMarker]);

    const handleCloseClick = useCallback(() => {
      setActiveMarker(null);
    }, [setActiveMarker]);

    if (!point?.lat || !point?.lng) return null;

    const first_last_user = index === 0 || markers_data.length - 1 === index;

    const iconUrl =
      first_last_user && point.standing
        ? "https://cwps-bucket.sfo3.cdn.digitaloceanspaces.com/v2/icons/policeman.png"
        : first_last_user && point.patrol
        ? "https://cwps-bucket.sfo3.cdn.digitaloceanspaces.com/v2/icons/police.png"
        : !user_id
        ? "https://cwps-bucket.sfo3.cdn.digitaloceanspaces.com/v2/icons/policeman.png"
        : undefined;

    return (
      <>
        <Marker
          position={{ lat: point.lat, lng: point.lng }}
          icon={
            iconUrl
              ? {
                  url: iconUrl,
                  scaledSize: new window.google.maps.Size(30, 30),
                }
              : undefined
          }
          label={
            !first_last_user && user_id
              ? {
                  text: String(index + 1),
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                }
              : { text: ".", color: "" }
          }
          onClick={handleMarkerClick}
          onLoad={(m) => {
            markerRef.current = m;
          }}
        >
          {activeMarker === index && (
            <InfoWindow onCloseClick={handleCloseClick}>
              <div>
                {point.type && (
                  <p>
                    <b>Activity:</b> {point.type}
                  </p>
                )}
                <p>
                  <b>
                    Agent
                    {point.patrol ? " (Patrol)" : point.standing ? " (Standing)" : ""}:
                  </b>{" "}
                  {point.agent_name}
                </p>
                <p>
                  <b>Created At:</b>{" "}
                  {point.created_at ? moment(point.created_at).format("MM/DD/YYYY, HH:mm") : ""}
                </p>
              </div>
            </InfoWindow>
          )}
        </Marker>

        {user_id && first_last_user && (
          <Circle
            center={{ lat: Number(point.lat), lng: Number(point.lng) }}
            radius={50}
            options={{
              strokeColor: index === 0 ? "green" : "red",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: index === 0 ? "green" : "red",
              fillOpacity: 0.2,
            }}
          />
        )}
      </>
    );
  }
);

export default MarkerComponent;
