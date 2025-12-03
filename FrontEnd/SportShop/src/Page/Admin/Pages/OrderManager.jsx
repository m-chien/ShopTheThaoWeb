import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Select,
  message,
  Divider,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";

// Import CSS
import "../Css/OrderManager.css";

const { Option } = Select;

const OrderManager = () => {
  // 1. Giả lập dữ liệu Đơn hàng (giống bảng Order trong SQL)
  // Trong thực tế, bạn sẽ gọi API ở useEffect để lấy dữ liệu này
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "Trần Đăng Tuấn Khanh",
      date: "2025-10-25 09:30",
      total: 5000000,
      status: "Paid",
      address: "Đà Nẵng",
      phone: "0900000001",
      // Giả lập chi tiết đơn hàng (OrderDetail)
      details: [
        {
          id: 1,
          product: "Nike Air Max - Đỏ (S)",
          quantity: 2,
          price: 2500000,
        },
        {
          id: 2,
          product: "Nike Revolution 6 - Đen (M)",
          quantity: 1,
          price: 500000,
        }, // Tặng kèm/giảm giá ví dụ
      ],
    },
    {
      id: 2,
      customer: "Khách vãng lai",
      date: "2025-10-26 14:15",
      total: 2800000,
      status: "Pending",
      address: "Hồ Chí Minh",
      phone: "0987654321",
      details: [
        {
          id: 3,
          product: "Adidas Ultraboost - Đen (M)",
          quantity: 1,
          price: 2800000,
        },
      ],
    },
  ]);

  // State cho Modal chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Hàm xử lý màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "gold";
      case "Shipping":
        return "blue";
      case "Paid":
        return "green";
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Hàm mở Modal xem chi tiết
  const handleViewDetail = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  // Hàm thay đổi trạng thái đơn hàng
  const handleChangeStatus = (value) => {
    // Cập nhật lại state (Sau này sẽ gọi API update xuống DB)
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id ? { ...order, status: value } : order
    );
    setOrders(updatedOrders);

    // Cập nhật luôn cái đang mở trong modal để hiển thị ngay
    setSelectedOrder({ ...selectedOrder, status: value });

    message.success(
      `Đã cập nhật trạng thái đơn hàng #${selectedOrder.id} thành ${value}`
    );
  };

  // Cấu hình cột cho bảng danh sách chính
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Ngày đặt", dataIndex: "date", key: "date" },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (price) => (
        <b style={{ color: "#d4380d" }}>{price.toLocaleString()} đ</b>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Cấu hình cột cho bảng chi tiết sản phẩm trong Modal
  const detailColumns = [
    { title: "Sản phẩm", dataIndex: "product", key: "product" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (p) => `${p.toLocaleString()} đ`,
    },
    {
      title: "Thành tiền",
      key: "subtotal",
      render: (_, r) => <b>{(r.quantity * r.price).toLocaleString()} đ</b>,
    },
  ];

  return (
    <div>
      <div className="order-page-header">
        <h2>Quản lý đơn hàng</h2>
      </div>

      <Table columns={columns} dataSource={orders} rowKey="id" />

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // Tắt nút mặc định, tự custom nếu cần
        width={700}
      >
        {selectedOrder && (
          <div>
            {/* Thông tin khách hàng */}
            <div className="customer-info-section">
              <div className="info-row">
                <span className="info-label">Khách hàng:</span>{" "}
                {selectedOrder.customer}
              </div>
              <div className="info-row">
                <span className="info-label">SĐT:</span> {selectedOrder.phone}
              </div>
              <div className="info-row">
                <span className="info-label">Địa chỉ:</span>{" "}
                {selectedOrder.address}
              </div>
              <div className="info-row">
                <span className="info-label">Ngày đặt:</span>{" "}
                {selectedOrder.date}
              </div>
              <div
                className="info-row"
                style={{ marginTop: 10, display: "flex", alignItems: "center" }}
              >
                <span className="info-label">Cập nhật trạng thái:</span>
                <Select
                  defaultValue={selectedOrder.status}
                  style={{ width: 150 }}
                  onChange={handleChangeStatus}
                >
                  <Option value="Pending">Pending</Option>
                  <Option value="Shipping">Shipping</Option>
                  <Option value="Paid">Paid</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </div>
            </div>

            <Divider orientation="left">Danh sách sản phẩm</Divider>

            {/* Bảng sản phẩm bên trong */}
            <Table
              columns={detailColumns}
              dataSource={selectedOrder.details}
              rowKey="id"
              pagination={false}
              size="small"
              bordered
            />

            <div className="total-price-highlight">
              Tổng cộng: {selectedOrder.total.toLocaleString()} VNĐ
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManager;
