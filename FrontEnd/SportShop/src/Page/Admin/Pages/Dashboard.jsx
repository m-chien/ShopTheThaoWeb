import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";

// --- IMPORT CSS ---
import "../Css/Dashboard.css";

const Dashboard = () => {
  return (
    <div>
      <h2 className="dashboard-title">Tổng quan báo cáo</h2>
      <Row gutter={24}>
        <Col span={8}>
          <Card className="dashboard-card">
            <Statistic
              title="Doanh thu"
              value={112893000}
              precision={0}
              valueStyle={{ color: "#3f8600", fontWeight: "bold" }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="dashboard-card">
            <Statistic
              title="Đơn hàng mới"
              value={15}
              valueStyle={{ color: "#cf1322", fontWeight: "bold" }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
