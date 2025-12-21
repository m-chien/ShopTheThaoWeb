import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, List, Avatar, message } from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

// Import CSS
import "../Css/Dashboard.css";

// Import API
import {
  getDashboardSummary,
  getRevenueChart,
  getTopProducts,
} from "../../../Api/Statistics";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    revenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // --- Helpers ---
  const normalizeSummary = (res) => {
    let data = res.data?.data || res.data;
    if (!data) return null;
    return {
      revenue: data.revenue || data.Revenue || 0,
      totalOrders: data.totalOrders || data.TotalOrders || 0,
      totalCustomers: data.totalCustomers || data.TotalCustomers || 0,
      totalProducts: data.totalProducts || data.TotalProducts || 0,
    };
  };

  const extractArray = (res) => {
    let data = res.data?.data || res.data;
    return Array.isArray(data) ? data : [];
  };

  useEffect(() => {
    // 1. Tổng quan
    getDashboardSummary()
      .then((res) => {
        const data = normalizeSummary(res);
        if (data) setSummary(data);
      })
      .catch(() => message.error("Lỗi tải thông tin tổng quan"));

    // 2. Biểu đồ
    getRevenueChart()
      .then((res) => {
        const rawData = extractArray(res);
        const formattedData = rawData.map((item) => ({
          ...item,
          Date: dayjs(item.date || item.Date).format("DD/MM"),
          revenue: item.revenue || item.Revenue || 0,
        }));
        setChartData(formattedData);
      })
      .catch(() => console.error("Lỗi tải biểu đồ"));

    // 3. Top sản phẩm
    getTopProducts()
      .then((res) => {
        const rawData = extractArray(res);
        const cleanList = rawData.map((item) => ({
          productName: item.productName || item.ProductName,
          totalSold: item.totalSold || item.TotalSold,
        }));
        setTopProducts(cleanList);
      })
      .catch(() => console.error("Lỗi tải top sản phẩm"));
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Tổng Quan Hệ Thống</h2>

      {/* --- CARDS THỐNG KÊ --- */}
      <Row gutter={16}>
        <Col span={6}>
          <Card variant="borderless" className="stat-card-revenue">
            <Statistic
              title="Doanh Thu"
              value={summary.revenue}
              prefix={<DollarCircleOutlined />}
              precision={0}
              formatter={(val) => val?.toLocaleString("vi-VN") + " đ"}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="stat-card-orders">
            <Statistic
              title="Đơn Hàng"
              value={summary.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="stat-card-customers">
            <Statistic
              title="Khách Hàng"
              value={summary.totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="stat-card-products">
            <Statistic
              title="Sản Phẩm"
              value={summary.totalProducts}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>

      <div className="dashboard-chart-row">
        {/* --- BIỂU ĐỒ DOANH THU --- */}
        <div className="dashboard-box box-left">
          <h3 className="box-title">Doanh Thu</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis width={80} />
                <Tooltip
                  formatter={(value) => value.toLocaleString("vi-VN") + " đ"}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Doanh Thu"
                  fill="#1890ff"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-data">Chưa có dữ liệu biểu đồ</div>
          )}
        </div>

        {/* --- TOP SẢN PHẨM --- */}
        <div className="dashboard-box box-right">
          <h3 className="box-title">
            <TrophyOutlined style={{ color: "#faad14", marginRight: 8 }} />
            Top Sản Phẩm
          </h3>
          {topProducts.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={topProducts}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: index < 3 ? "#faad14" : "#d9d9d9",
                          color: "#fff",
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    }
                    title={<b>{item.productName}</b>}
                    description={`Đã bán: ${item.totalSold}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="empty-data">Chưa có dữ liệu</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
