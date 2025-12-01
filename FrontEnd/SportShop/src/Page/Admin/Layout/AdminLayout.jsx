import React, { useState } from "react";
import { Layout, Menu, Avatar, Space } from "antd";
import {
  PieChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  SkinOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import "../Css/AdminLayout.css";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

// Menu cấu hình
const items = [
  getItem("Dashboard", "/admin", <PieChartOutlined />),
  getItem("Sản Phẩm", "/admin/products", <SkinOutlined />),
  getItem("Đơn Hàng", "/admin/orders", <ShoppingOutlined />),
  getItem("Khách Hàng", "/admin/users", <UserOutlined />),
  getItem("Khuyến Mãi", "/admin/vouchers", <TagsOutlined />),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar bên trái */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* LOGIC XỬ LÝ LOGO: Nếu đóng thì hiện AD, mở thì hiện TO LA ADMIN NE */}
        <div className="admin-logo">{collapsed ? "AD" : "TO LA ADMIN NE"}</div>

        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      {/* Phần nội dung bên phải */}
      <Layout>
        <Header className="admin-header">
          <Space>
            <span className="admin-username">Xin chào, Admin</span>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#87d068" }}
            />
          </Space>
        </Header>

        <Content>
          <div className="admin-content-wrapper">
            {/* Nơi hiển thị các trang con (Dashboard, Product...) */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
