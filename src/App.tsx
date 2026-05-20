import React, { useState } from "react";
import { Alert, Button, Input, Layout, Menu, Space, Typography } from "antd";
import { EnvironmentOutlined, RadarChartOutlined, DeploymentUnitOutlined } from "@ant-design/icons";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SiteMapView from "./components/SiteMapView";
import LiveTrackingView from "./components/LiveTrackingView";
import BeatManagementView from "./components/BeatManagementView";
import { DEFAULT_GOOGLE_API_KEY, GOOGLE_MAPS_API_KEY_STORAGE_KEY } from "./dummyData";
import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

const VIEW_PATHS = {
  sitemap: "/sitemap",
  tracking: "/tracking",
  beats: "/beats",
} as const;

type View = keyof typeof VIEW_PATHS;

function getViewFromPath(pathname: string): View {
  if (pathname.startsWith(VIEW_PATHS.tracking)) return "tracking";
  if (pathname.startsWith(VIEW_PATHS.beats)) return "beats";
  return "sitemap";
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeView = getViewFromPath(location.pathname);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_GOOGLE_API_KEY;
    }

    return localStorage.getItem(GOOGLE_MAPS_API_KEY_STORAGE_KEY) ?? DEFAULT_GOOGLE_API_KEY;
  });
  const [apiKeyDraft, setApiKeyDraft] = useState(googleMapsApiKey);

  const applyGoogleMapsApiKey = () => {
    const nextKey = apiKeyDraft.trim();
    setGoogleMapsApiKey(nextKey);

    if (typeof window !== "undefined") {
      if (nextKey) {
        localStorage.setItem(GOOGLE_MAPS_API_KEY_STORAGE_KEY, nextKey);
      } else {
        localStorage.removeItem(GOOGLE_MAPS_API_KEY_STORAGE_KEY);
      }
    }
  };

  const resetGoogleMapsApiKey = () => {
    setApiKeyDraft("");
    setGoogleMapsApiKey("");

    if (typeof window !== "undefined") {
      localStorage.removeItem(GOOGLE_MAPS_API_KEY_STORAGE_KEY);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="app-header">
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          🗺️ Live Entities – Google Maps
        </Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeView]}
          onClick={({ key }) => navigate(VIEW_PATHS[key as View])}
          items={[
            {
              key: "sitemap",
              icon: <EnvironmentOutlined />,
              label: "Site Map",
            },
            {
              key: "tracking",
              icon: <RadarChartOutlined />,
              label: "Live Tracking",
            },
            {
              key: "beats",
              icon: <DeploymentUnitOutlined />,
              label: "Beat Management",
            },
          ]}
          style={{ marginLeft: 24, flex: 1, minWidth: 0, background: "transparent", borderBottom: "none" }}
        />
      </Header>

      <Content className="app-content">
        <Alert
          message="Google Maps API Key"
          description={
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>Enter a key below to render maps immediately without redeploying. The value is stored in this browser.</div>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  placeholder="Enter Google Maps API key"
                  value={apiKeyDraft}
                  onChange={(event) => setApiKeyDraft(event.target.value)}
                  onPressEnter={applyGoogleMapsApiKey}
                />
                <Button type="primary" onClick={applyGoogleMapsApiKey}>
                  Apply Key
                </Button>
                <Button onClick={resetGoogleMapsApiKey}>Reset</Button>
              </Space.Compact>
            </Space>
          }
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 20 }}
        />
        <Routes>
          <Route path="/" element={<Navigate to={VIEW_PATHS.sitemap} replace />} />
          <Route path={VIEW_PATHS.sitemap} element={<SiteMapView apiKey={googleMapsApiKey} />} />
          <Route path={VIEW_PATHS.tracking} element={<LiveTrackingView apiKey={googleMapsApiKey} />} />
          <Route path={VIEW_PATHS.beats} element={<BeatManagementView />} />
          <Route path="*" element={<Navigate to={VIEW_PATHS.sitemap} replace />} />
        </Routes>
      </Content>
    </Layout>
  );
}
