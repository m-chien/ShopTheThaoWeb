import React, { useState } from "react";
import { Layout, Menu, theme, Avatar, Space } from "antd";
import {
  PieChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  SkinOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

// Lưu ý: Key ở đây phải trùng với đường dẫn URL bạn muốn điều hướng tới
const items = [
  getItem("Dashboard", "/admin", <PieChartOutlined />),
  getItem("Sản Phẩm", "/admin/products", <SkinOutlined />),
  getItem("Đơn Hàng", "/admin/orders", <ShoppingOutlined />),
  getItem("Khách Hàng", "/admin/users", <UserOutlined />),
  getItem("Khuyến Mãi", "/admin/vouchers", <TagsOutlined />),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          SHOP ADMIN
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            textAlign: "right",
          }}
        >
          <Space>
            <span>Xin chào, Admin</span>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Header>
        <Content style={{ margin: "16px 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Đây là nơi các trang con (Dashboard, Product...) sẽ hiện ra */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
