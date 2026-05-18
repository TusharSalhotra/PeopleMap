import React, { useMemo, useState } from "react";
import { Card, Col, Flex, Row, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { BeatAssignment, DUMMY_BEAT_ASSIGNMENTS } from "../dummyData";
import "./BeatManagementView.css";

export default function BeatManagementView() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [shiftFilter, setShiftFilter] = useState<string | undefined>();

  const filteredData = useMemo(() => {
    return DUMMY_BEAT_ASSIGNMENTS.filter((item) => {
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesShift = shiftFilter ? item.shift === shiftFilter : true;
      return matchesStatus && matchesShift;
    });
  }, [shiftFilter, statusFilter]);

  const summary = useMemo(() => {
    const active = filteredData.filter((item) => item.status === "Active").length;
    const onHold = filteredData.filter((item) => item.status === "On Hold").length;
    const completed = filteredData.filter((item) => item.status === "Completed").length;
    return { total: filteredData.length, active, onHold, completed };
  }, [filteredData]);

  const columns: ColumnsType<BeatAssignment> = [
    {
      title: "Beat",
      dataIndex: "beat_id",
      key: "beat_id",
      render: (_, record) => (
        <div>
          <div className="beat-id">{record.beat_id}</div>
          <div className="beat-name">{record.beat_name}</div>
        </div>
      ),
    },
    {
      title: "Zone",
      dataIndex: "zone",
      key: "zone",
    },
    {
      title: "Officer",
      dataIndex: "assigned_officer",
      key: "assigned_officer",
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: BeatAssignment["priority"]) => {
        let color = "blue";
        if (priority === "High") {
          color = "red";
        } else if (priority === "Medium") {
          color = "gold";
        }
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: BeatAssignment["status"]) => {
        let color = "default";
        if (status === "Active") {
          color = "green";
        } else if (status === "On Hold") {
          color = "orange";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Checkpoints",
      dataIndex: "checkpoints",
      key: "checkpoints",
      align: "right",
    },
    {
      title: "Last Patrol",
      dataIndex: "last_patrol_at",
      key: "last_patrol_at",
      render: (value: string) => dayjs(value).format("MM/DD/YYYY HH:mm"),
    },
  ];

  return (
    <div>
      <h2 className="view-title">Beat Management</h2>
      <p className="view-subtitle">Manage patrol beats with local dummy records for development and demo use.</p>

      <Row gutter={[16, 16]} className="summary-grid">
        <Col xs={12} md={6}>
          <Card className="summary-card">
            <div className="summary-label">Total Beats</div>
            <div className="summary-value">{summary.total}</div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="summary-card active">
            <div className="summary-label">Active</div>
            <div className="summary-value">{summary.active}</div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="summary-card hold">
            <div className="summary-label">On Hold</div>
            <div className="summary-value">{summary.onHold}</div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="summary-card done">
            <div className="summary-label">Completed</div>
            <div className="summary-value">{summary.completed}</div>
          </Card>
        </Col>
      </Row>

      <Flex gap={12} wrap="wrap" className="beat-filters">
        <Select
          allowClear
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          placeholder="Filter by status"
          style={{ minWidth: 220 }}
          options={[
            { value: "Active", label: "Active" },
            { value: "On Hold", label: "On Hold" },
            { value: "Completed", label: "Completed" },
          ]}
        />
        <Select
          allowClear
          value={shiftFilter}
          onChange={(val) => setShiftFilter(val)}
          placeholder="Filter by shift"
          style={{ minWidth: 220 }}
          options={[
            { value: "Morning", label: "Morning" },
            { value: "Evening", label: "Evening" },
            { value: "Night", label: "Night" },
          ]}
        />
      </Flex>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}
