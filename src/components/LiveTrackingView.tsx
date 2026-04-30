import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
} from "@react-google-maps/api";
import { Col, DatePicker, Flex, Form, Pagination, Row, Select, Spin, Button } from "antd";
import {
  GOOGLE_API_KEY,
  COMPANY_CENTER,
  DUMMY_EMPLOYEES,
  DUMMY_LOGGED_USERS,
  DUMMY_ROUTE_WAYPOINTS, live map view
  TrackingPoint,
} from "../dummyData";
import MarkerComponent from "./MarkerComponent";
import "./LiveTrackingView.css";

const mapContainerStyle = { width: "100%", height: "60vh" };

export default function LiveTrackingView() {
  const [form] = Form.useForm();
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [allWaypoints, setAllWaypoints] = useState<TrackingPoint[]>(DUMMY_LOGGED_USERS);
  const [waypoints, setWaypoints] = useState<TrackingPoint[]>([]);
  const [recentWaypoints, setRecentWaypoints] = useState<TrackingPoint[]>([]);
  const [shouldRenderPath, setShouldRenderPath] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"idle" | "done">("idle");
  const [response, setResponse] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  const paginatedMarkers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allWaypoints.slice(start, start + pageSize);
  }, [currentPage, pageSize, allWaypoints]);

  const center = useMemo(
    () => (allWaypoints.length > 0 ? { lat: allWaypoints[0].lat, lng: allWaypoints[0].lng } : COMPANY_CENTER),
    [allWaypoints]
  );

  const employeeDetail = DUMMY_EMPLOYEES.find((e) => e.id === selectedEmployee);

  const onSubmit = (values: any) => {
    setLoader(true);
    // Simulate API: if employee selected, show route waypoints; else show logged users
    setTimeout(() => {
      if (values.employee_id) {
        const data = DUMMY_ROUTE_WAYPOINTS;
        setAllWaypoints(data);
        setWaypoints(data.length > 23 ? data.slice(-23) : data);
        setShouldRenderPath(true);
      } else {
        setAllWaypoints(DUMMY_LOGGED_USERS);
        setShouldRenderPath(false);
      }
      setCurrentPage(1);
      setLoader(false);
    }, 800);
  };

  const onClear = () => {
    form.resetFields();
    setSelectedEmployee(null);
    setAllWaypoints(DUMMY_LOGGED_USERS);
    setShouldRenderPath(false);
    setCurrentPage(1);
    setResponse(null);
    setRequestStatus("idle");
  };

  const directionsCallback = useCallback(
    (res: any) => {
      if (res !== null && res.status === "OK") {
        setResponse(res);
        setRequestStatus("done");
      }
    },
    [recentWaypoints]
  );

  useEffect(() => {
    setRecentWaypoints(paginatedMarkers);
  }, [paginatedMarkers]);

  useEffect(() => {
    setRequestStatus("idle");
    setResponse(null);
  }, [recentWaypoints]);

  return (
    <div>
      <h2 className="view-title">Live Tracking View</h2>
      <p className="view-subtitle">
        Track officer locations in real-time or view historical routes by selecting an officer.
      </p>
      <Row gutter={16}>
        {/* Filter form */}
        <Col xl={7} lg={8} md={24} xs={24} className="tracking-left">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item label="Select Officer" name="employee_id">
              <Select
                placeholder="All logged-in officers"
                allowClear
                onChange={(val) => setSelectedEmployee(val ?? null)}
                options={DUMMY_EMPLOYEES.map((e) => ({
                  value: e.id,
                  label: `${e.badge_number} – ${e.first_name} ${e.last_name}`,
                }))}
              />
            </Form.Item>
            <Form.Item label="Start Time" name="start_time">
              <DatePicker
                format="MM/DD/YYYY HH:mm"
                showTime={{ use12Hours: false }}
                style={{ width: "100%" }}
                disabledDate={(d) => d && d.isAfter(new Date())}
              />
            </Form.Item>
            <Form.Item label="End Time" name="end_time">
              <DatePicker
                format="MM/DD/YYYY HH:mm"
                showTime={{ use12Hours: false }}
                style={{ width: "100%" }}
                disabledDate={(d) => d && d.isAfter(new Date())}
              />
            </Form.Item>
            <Flex justify="end" gap={8}>
              <Button onClick={onClear}>Clear</Button>
              <Button type="primary" htmlType="submit" loading={loader}>
                Submit
              </Button>
            </Flex>
          </Form>

          {allWaypoints.length > 0 && (
            <div className="tracking-summary">
              <strong>Tracking Summary</strong>
              <div>Total Activities: {allWaypoints.length}</div>
              <div>
                Showing {paginatedMarkers.length} of {allWaypoints.length} activities (Page{" "}
                {currentPage} of {Math.ceil(allWaypoints.length / pageSize)})
              </div>
            </div>
          )}
        </Col>

        {/* Map */}
        <Col xl={17} lg={16} md={24} xs={24}>
          <div className="status-heading">
            {employeeDetail
              ? `${employeeDetail.badge_number} – ${employeeDetail.first_name} ${employeeDetail.last_name}`
              : "All Logged-in Officers"}
          </div>
          <div className="map-wrapper">
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
              <Spin spinning={loader}>
                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13}>
                  {shouldRenderPath &&
                    requestStatus === "idle" &&
                    recentWaypoints.length > 1 && (
                      <DirectionsService
                        key={recentWaypoints.map((wp) => `${wp.lat},${wp.lng}`).join("-")}
                        options={{
                          origin: { lat: recentWaypoints[0].lat, lng: recentWaypoints[0].lng },
                          destination: {
                            lat: recentWaypoints[recentWaypoints.length - 1].lat,
                            lng: recentWaypoints[recentWaypoints.length - 1].lng,
                          },
                          travelMode: google.maps.TravelMode.DRIVING,
                          waypoints: recentWaypoints.slice(1, -1).map((p) => ({
                            location: { lat: p.lat, lng: p.lng },
                          })),
                        }}
                        callback={directionsCallback}
                      />
                    )}

                  {response && recentWaypoints.length > 1 && (
                    <DirectionsRenderer
                      options={{
                        directions: response,
                        suppressMarkers: true,
                        preserveViewport: true,
                        polylineOptions: {
                          strokeColor: "#FF0000",
                          strokeOpacity: 1.0,
                          strokeWeight: 5,
                        },
                      }}
                    />
                  )}

                  {paginatedMarkers.map((point, index) => (
                    <MarkerComponent
                      key={`${point.id}-${index}`}
                      point={point}
                      index={index}
                      activeMarker={activeMarker}
                      setActiveMarker={setActiveMarker}
                      markers_data={allWaypoints}
                      user_id={selectedEmployee}
                    />
                  ))}
                </GoogleMap>
              </Spin>
            </LoadScript>

            {allWaypoints.length > pageSize && (
              <Flex justify="end" style={{ padding: "10px" }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={allWaypoints.length}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  showSizeChanger
                  pageSizeOptions={["5", "10", "15", "20"]}
                />
              </Flex>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
