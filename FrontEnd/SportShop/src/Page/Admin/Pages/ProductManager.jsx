import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, message, Image, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import "../Css/ProductManager.css";
import { getAllProduct, deleteProduct } from "../../../Api/Product";
import { getAllCategory } from "../../../Api/Category";
import { getAllBrand } from "../../../Api/Brand";

const ProductManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categoryFilters, setCategoryFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);

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

  const fetchFilters = async () => {
    try {
      // Gọi song song cả 2 API cho nhanh
      const [resCate, resBrand] = await Promise.all([
        getAllCategory(),
        getAllBrand(),
      ]);

      // Xử lý Danh mục
      if (resCate.data) {
        const cateList = Array.isArray(resCate.data)
          ? resCate.data
          : resCate.data.data || [];

        const formattedCate = cateList.map((item) => ({
          text: item.name,
          value: item.name,
        }));
        setCategoryFilters(formattedCate);
      }

      // Xử lý Thương hiệu
      if (resBrand.data) {
        const brandList = Array.isArray(resBrand.data)
          ? resBrand.data
          : resBrand.data.data || [];
        const formattedBrand = brandList.map((item) => ({
          text: item.name,
          value: item.name,
        }));
        setBrandFilters(formattedBrand);
      }
    } catch (error) {
      console.error("Lỗi lấy filter:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success("Đã xóa sản phẩm thành công!");
      fetchProducts();
    } catch (error) {
      message.error("Xóa thất bại! Có thể sản phẩm đang có đơn hàng.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "productID", key: "productID", width: 60 },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      width: 100,
      render: (images) => {
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

    {
      title: "Danh Mục",
      dataIndex: "categoryName",
      key: "categoryName",
      filters: categoryFilters,
      onFilter: (value, record) => record.categoryName === value,
    },
    {
      title: "Thương Hiệu",
      dataIndex: "brandName",
      key: "brandName",
      width: 140,
      filters: brandFilters,
      onFilter: (value, record) => record.brandName === value,
    },
    {
      title: "Size",
      dataIndex: "sizes",
      key: "sizes",
      width: 60, // <--- 1. Gán chiều rộng cố định (số nhỏ thôi)
      render: (sizes) => (
        // <--- 2. wrap: true giúp tự xuống dòng
        <Space size={[0, 4]} wrap style={{ width: "100%" }}>
          {sizes?.map((s, index) => (
            <Tag key={index} color="purple">
              {s.sizeName}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "colors",
      key: "colors",
      width: 110,
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
      width: 110,
      render: (prices) => {
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
