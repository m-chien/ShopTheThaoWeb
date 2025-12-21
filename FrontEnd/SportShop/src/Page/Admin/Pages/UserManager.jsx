import React, { useState, useEffect } from "react";
import { Table, Button, message, Input, Tag, Popconfirm, Space } from "antd";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";

// Import CSS
import "../Css/UserManager.css";

// Import API
import { getAllCustomers, toggleCustomerStatus } from "../../../Api/Customer";

const UserManager = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  // --- HÀM LẤY DỮ LIỆU ---
  const fetchUsers = async (searchVal = "") => {
    setLoading(true);
    try {
      const res = await getAllCustomers(searchVal);

      // Xử lý dữ liệu trả về từ API (hỗ trợ cả dạng mảng và dạng wrapper object)
      const rawData = res.data;
      if (Array.isArray(rawData)) {
        setData(rawData);
      } else if (rawData && Array.isArray(rawData.data)) {
        setData(rawData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      message.error("Lỗi tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- XỬ LÝ TÌM KIẾM ---
  const handleSearch = () => {
    fetchUsers(keyword);
  };

  // --- XỬ LÝ KHÓA / MỞ KHÓA ---
  const handleToggleStatus = async (id) => {
    try {
      await toggleCustomerStatus(id);
      message.success("Cập nhật trạng thái thành công!");
      fetchUsers(keyword); // Load lại bảng
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
      }
    }
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      width: 60,
      render: (id) => id,
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => (
        <>
          {roles &&
            roles.map((role) => {
              let color = role === "Admin" ? "geekblue" : "green";
              return (
                <Tag color={color} key={role}>
                  {role.toUpperCase()}
                </Tag>
              );
            })}
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <Tag color="success">HOẠT ĐỘNG</Tag>
        ) : (
          <Tag color="error">ĐÃ KHÓA</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.isActive ? (
            <Popconfirm
              title="Khóa tài khoản này?"
              description="Người dùng sẽ không thể đăng nhập được nữa."
              onConfirm={() => handleToggleStatus(record.userId)}
              okText="Khóa ngay"
              cancelText="Hủy"
            >
              <Button
                size="small"
                icon={<LockOutlined />}
                className="btn-lock"
                danger // Thêm thuộc tính danger của Antd cho nút đỏ
              >
                Khóa
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Mở khóa tài khoản này?"
              onConfirm={() => handleToggleStatus(record.userId)}
              okText="Mở khóa"
              cancelText="Hủy"
            >
              <Button
                size="small"
                icon={<UnlockOutlined />}
                className="btn-unlock"
                type="primary" // Thêm type primary cho nút xanh
                ghost // Thêm ghost để nút nhìn nhẹ nhàng hơn (tuỳ chọn)
              >
                Mở lại
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header trang */}
      <div className="user-page-header">
        <h2>
          <UserOutlined style={{ marginRight: 8 }} />
          Quản lý Khách Hàng
        </h2>

        {/* Khu vực tìm kiếm */}
        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="Tìm theo tên, email, username..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            className="search-input"
            allowClear // Cho phép xóa nhanh nội dung tìm kiếm
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        rowKey="userId" // Antd tự lấy trường .userId
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default UserManager;
