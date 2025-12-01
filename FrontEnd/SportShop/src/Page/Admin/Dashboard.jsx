import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const Dashboard = () => {
  return (
    <div>
      <h2>Tổng quan báo cáo</h2>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={112893000}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng mới"
              value={15}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
