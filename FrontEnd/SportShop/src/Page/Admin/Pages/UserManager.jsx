import React, { useState, useEffect } from "react";
import { Table, Button, message, Input, Tag, Popconfirm, Space } from "antd";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";

// 1. Import CSS (Đảm bảo bạn đã tạo file này như hướng dẫn trước)
import "../Css/UserManager.css";

// 2. Import API từ Customer.js (File mới tạo)
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

      // --- THÊM DÒNG NÀY ĐỂ KIỂM TRA ---
      console.log("Dữ liệu API trả về:", res.data);
      // ---------------------------------

      if (res.data) {
        // Kiểm tra xem dữ liệu nằm ở res.data hay res.data.data (tùy backend trả về)
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setData(res.data.data); // Trường hợp backend gói trong object { data: [...] }
        } else {
          setData([]); // Không đúng định dạng
        }
      }
    } catch (error) {
      console.log("Lỗi:", error); // Log lỗi ra xem là gì
      message.error("Lỗi tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // Chạy lần đầu khi vào trang
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
      // Gọi API Toggle trạng thái
      await toggleCustomerStatus(id);
      message.success("Cập nhật trạng thái thành công!");

      // Load lại bảng dữ liệu để thấy trạng thái mới
      fetchUsers(keyword);
    } catch (error) {
      // Xử lý lỗi hiển thị message từ Backend nếu có
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
      // Xử lý an toàn nếu backend trả về UserId hoặc userId
      render: (id, record) => id || record.UserId,
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
      render: (isActive) => {
        return isActive ? (
          <Tag color="success">HOẠT ĐỘNG</Tag>
        ) : (
          <Tag color="error">ĐÃ KHÓA</Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const id = record.userId || record.UserId;
        const isActive = record.isActive;

        return (
          <Space>
            {isActive ? (
              // NẾU ĐANG HOẠT ĐỘNG -> HIỆN NÚT KHÓA MÀU ĐỎ
              <Popconfirm
                title="Khóa tài khoản này?"
                description="Người dùng sẽ không thể đăng nhập được nữa."
                onConfirm={() => handleToggleStatus(id)}
                okText="Khóa ngay"
                cancelText="Hủy"
              >
                <Button
                  size="small"
                  icon={<LockOutlined />}
                  className="btn-lock" // Class CSS màu đỏ
                >
                  Khóa
                </Button>
              </Popconfirm>
            ) : (
              // NẾU ĐANG KHÓA -> HIỆN NÚT MỞ MÀU XANH
              <Popconfirm
                title="Mở khóa tài khoản này?"
                onConfirm={() => handleToggleStatus(id)}
                okText="Mở khóa"
                cancelText="Hủy"
              >
                <Button
                  size="small"
                  icon={<UnlockOutlined />}
                  className="btn-unlock" // Class CSS màu xanh
                >
                  Mở lại
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
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
            onPressEnter={handleSearch} // Cho phép nhấn Enter để tìm
            className="search-input"
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
        rowKey={(record) => record.userId || record.UserId}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default UserManager;
