import React, { useState } from "react";
import { Table, Button, Space, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import "../Css/ProductManager.css";

const ProductManager = () => {
  const [data] = useState([
    {
      id: 1,
      name: "Nike Air Max",
      category: "Giày",
      price: 2500000,
      status: 1,
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      category: "Giày",
      price: 2800000,
      status: 1,
    },
  ]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    { title: "Danh Mục", dataIndex: "category", key: "category" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (p) => `${p.toLocaleString()} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (st) => (
        <Tag color={st === 1 ? "green" : "red"}>
          {st === 1 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            className="action-btn-edit"
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            className="action-btn-delete"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Thêm className cho header */}
      <div className="product-page-header">
        <h2>Quản lý sản phẩm</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ProductManager;
