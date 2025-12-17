import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, message, Image, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// Đảm bảo đường dẫn import đúng file api của bạn
import { getAllProduct } from "../../../Api/Product"; // Hoặc đường dẫn file api của bạn

import "../Css/ProductManager.css";

const ProductManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. SỬA HÀM FETCH DATA ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProduct();

      console.log("Response Full:", response); // Log để debug

      // Kiểm tra cấu trúc Wrapper của Middleware
      if (response.data && Array.isArray(response.data.data)) {
        // Trường hợp có Middleware: dữ liệu nằm trong response.data.data
        setData(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Trường hợp không có Middleware (dự phòng)
        setData(response.data);
      } else {
        console.error("Cấu trúc API không đúng:", response.data);
        setData([]);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    message.info("Chức năng xóa đang phát triển");
  };

  // --- 2. CẬP NHẬT CỘT CHO KHỚP API GetGroupedProducts ---
  // API trả về: { productID, name, description, colors: [], images: [], prices: [] }
  const columns = [
    { title: "ID", dataIndex: "productID", key: "productID", width: 60 },
    {
      title: "Hình ảnh",
      dataIndex: "images", // API trả về mảng images
      key: "images",
      render: (images) => {
        // Lấy ảnh đầu tiên trong mảng để hiển thị
        const firstImage = images && images.length > 0 ? images[0] : null;
        return (
          <Image
            width={50}
            src={
              firstImage
                ? `/Product/${firstImage}`
                : "https://via.placeholder.com/50"
            }
            fallback="https://via.placeholder.com/50"
          />
        );
      },
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },

    { title: "Danh Mục", dataIndex: "categoryName", key: "categoryName" },
    { title: "Thương Hiệu", dataIndex: "brandName", key: "brandName" },

    {
      title: "Màu sắc",
      dataIndex: "colors",
      key: "colors",
      render: (colors) => (
        <Space size={[0, 8]} wrap>
          {colors?.map((c, index) => (
            <Tag key={index} color="blue">
              {c.colorName}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "prices",
      key: "prices",
      render: (prices) => {
        // Tìm giá nhỏ nhất và lớn nhất để hiển thị khoảng giá
        if (!prices || prices.length === 0) return "Liên hệ";
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        return min === max ? (
          <span style={{ color: "#d4380d", fontWeight: "bold" }}>
            {min.toLocaleString()} đ
          </span>
        ) : (
          <span style={{ color: "#d4380d", fontWeight: "bold" }}>
            {min.toLocaleString()} - {max.toLocaleString()} đ
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            className="action-btn-edit"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm?"
            onConfirm={() => handleDelete(record.productID)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="action-btn-delete"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="product-page-header">
        <h2>Quản lý sản phẩm</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="productID" // API trả về productID (chữ thường hoặc hoa tùy json config)
        loading={loading}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default ProductManager;
