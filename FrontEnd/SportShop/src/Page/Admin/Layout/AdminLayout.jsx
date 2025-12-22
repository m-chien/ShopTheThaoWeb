import React, { useState } from "react";
import { Layout, Menu, Avatar, Space, Dropdown, message } from "antd";
import {
  PieChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  SkinOutlined,
  TagsOutlined,
  AppstoreOutlined,
  SketchOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

// Import API
import { api } from "../../../Api/Api";

// Import CSS
import "../Css/AdminLayout.css";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

// Menu Configuration
const items = [
  getItem("Dashboard", "/admin", <PieChartOutlined />),
  getItem("Danh Mục", "/admin/categories", <AppstoreOutlined />),
  getItem("Thương Hiệu", "/admin/brands", <SketchOutlined />),
  getItem("Sản Phẩm", "/admin/products", <SkinOutlined />),
  getItem("Đơn Hàng", "/admin/orders", <ShoppingOutlined />),
  getItem("Khách Hàng", "/admin/users", <UserOutlined />),
  getItem("Khuyến Mãi", "/admin/vouchers", <TagsOutlined />),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/User/logout", null, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("accessToken");
      message.success("Đăng xuất thành công!");
      navigate("/login", { replace: true });
    }
  };

  const userMenuItems = [
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="admin-layout-container">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="admin-logo">{collapsed ? "AD" : "TO LA ADMIN NE"}</div>

        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header className="admin-header">
          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
            <a
              className="admin-user-dropdown"
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#87d068" }}
                />
                <span className="admin-username">Xin chào, Admin</span>
                <DownOutlined style={{ fontSize: "12px", color: "#666" }} />
              </Space>
            </a>
          </Dropdown>
        </Header>

        <Content>
          <div className="admin-content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
