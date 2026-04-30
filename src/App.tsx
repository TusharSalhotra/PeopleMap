import React, { useState } from "react";
import { Alert, Layout, Menu, Typography } from "antd";
import { EnvironmentOutlined, RadarChartOutlined } from "@ant-design/icons";
import SiteMapView from "./components/SiteMapView";
import LiveTrackingView from "./components/LiveTrackingView";
import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

type View = "sitemap" | "tracking";

export default function App() {
  const [activeView, setActiveView] = useState<View>("sitemap");

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
          onClick={({ key }) => setActiveView(key as View)}
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
          ]}
          style={{ marginLeft: 24, flex: 1, minWidth: 0, background: "transparent", borderBottom: "none" }}
        />
      </Header>

      <Content className="app-content">
        <Alert
          message="Demo Mode – using dummy data. Replace GOOGLE_API_KEY in src/dummyData.ts with a valid key."
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 20 }}
        />
        {activeView === "sitemap" ? <SiteMapView /> : <LiveTrackingView />}
      </Content>
    </Layout>
  );
}
