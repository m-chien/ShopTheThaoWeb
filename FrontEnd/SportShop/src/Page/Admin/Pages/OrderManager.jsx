import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Modal,
  Select,
  Tag,
  Space,
  Divider,
} from "antd";
import {
  ShoppingOutlined,
  EyeOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { getAllOrders, updateOrder, getOrderDetails } from "../../../Api/Order";
import "../Css/OrderManager.css";

const { Option } = Select;

const OrderManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // --- 1. LẤY DANH SÁCH ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      // Code xử lý data cũ của bạn
      const rawData = res.data;
      if (Array.isArray(rawData)) setData(rawData);
      else if (rawData && Array.isArray(rawData.data)) setData(rawData.data);
      else setData([]);
    } catch (error) {
      message.error("Lỗi tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 2. XEM CHI TIẾT ---
  const handleViewDetail = async (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
    setOrderDetails([]);

    if (record.id) {
      setLoadingDetails(true);
      try {
        const res = await getOrderDetails(record.id);
        if (res.data && Array.isArray(res.data.data))
          setOrderDetails(res.data.data);
        else if (Array.isArray(res.data)) setOrderDetails(res.data);
        else setOrderDetails([]);
      } catch (error) {
        message.error("Không thể tải chi tiết sản phẩm!");
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  // --- 3. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (GIỮ NGUYÊN) ---
  const handleChangeStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const id = selectedOrder.id;
      const cleanPayload = {
        id: parseInt(id),
        userId: selectedOrder.userId,
        status: newStatus, // Đây là trạng thái ĐƠN HÀNG
        totalAmount: selectedOrder.totalAmount,
        deliveryAddress: selectedOrder.deliveryAddress,
        phone: selectedOrder.phone,
        orderDate: selectedOrder.orderDate
          ? dayjs(selectedOrder.orderDate).toISOString()
          : new Date().toISOString(),
        voucherId: selectedOrder.voucherId || null,
      };
      await updateOrder(id, cleanPayload);
      message.success(`Cập nhật trạng thái đơn #${id} thành công!`);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      fetchOrders();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  // --- RENDER TAG TRẠNG THÁI ĐƠN HÀNG ---
  const renderOrderStatusTag = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s.includes("đang xử lý")) return <Tag color="blue">Đang xử lý</Tag>;
    if (s.includes("giao")) return <Tag color="cyan">Đang giao</Tag>;
    if (s.includes("hoàn thành")) return <Tag color="green">Hoàn thành</Tag>;
    if (s.includes("hủy")) return <Tag color="red">Đã hủy</Tag>;
    return <Tag>{status}</Tag>;
  };

  // --- MỚI: RENDER TAG TRẠNG THÁI THANH TOÁN ---
  const renderPaymentStatusTag = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s.includes("đã thanh toán") || s.includes("paid")) {
      return <Tag color="#87d068">Đã thanh toán</Tag>;
    } else if (s.includes("chờ") || s.includes("pending")) {
      return <Tag color="gold">Chờ thanh toán</Tag>;
    } else {
      return <Tag color="default">{status || "Chưa thanh toán"}</Tag>;
    }
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "id",
      width: 70,
      render: (id) => <b>#{id}</b>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      render: (name) => <b>{name}</b>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (amount) => (
        <b style={{ color: "#d48806" }}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </b>
      ),
    },
    // 👇 CỘT MỚI: THANH TOÁN
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Hiển thị trạng thái thanh toán */}
          {renderPaymentStatusTag(status)}
          {/* Hiển thị phương thức nhỏ ở dưới */}
          <small style={{ color: "#888" }}>
            <CreditCardOutlined /> {record.paymentMethod}
          </small>
        </div>
      ),
    },
    {
      title: "TT Đơn hàng",
      dataIndex: "status",
      render: (status) => renderOrderStatusTag(status),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  // (Giữ nguyên detailColumns)
  const detailColumns = [
    { title: "Sản phẩm", dataIndex: "product", key: "product" },
    { title: "SL", dataIndex: "quantity", key: "quantity", align: "center" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      align: "right",
      render: (p) => new Intl.NumberFormat("vi-VN").format(p) + " đ",
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      align: "right",
      render: (t) => <b>{new Intl.NumberFormat("vi-VN").format(t)} đ</b>,
    },
  ];

  return (
    <div>
      <div className="order-page-header">
        <h2>
          <ShoppingOutlined style={{ marginRight: 8 }} /> Quản lý Đơn Hàng
        </h2>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="order-detail-modal-content">
            <div
              className="customer-info-section"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Cột Trái: Thông tin khách & Ship */}
              <div>
                <Divider orientation="left" style={{ margin: "0 0 10px 0" }}>
                  Thông tin vận chuyển
                </Divider>
                <div className="info-row">
                  <span className="info-label">Khách hàng:</span>{" "}
                  <b>{selectedOrder.customerName}</b>
                </div>
                <div className="info-row">
                  <span className="info-label">SĐT:</span> {selectedOrder.phone}
                </div>
                <div className="info-row">
                  <span className="info-label">Địa chỉ:</span>{" "}
                  {selectedOrder.deliveryAddress}
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày đặt:</span>{" "}
                  {dayjs(selectedOrder.orderDate).format("DD/MM/YYYY HH:mm")}
                </div>
              </div>

              {/* Cột Phải: Thông tin Thanh toán & Trạng thái */}
              <div>
                <Divider orientation="left" style={{ margin: "0 0 10px 0" }}>
                  Thông tin thanh toán
                </Divider>
                <div className="info-row">
                  <span className="info-label">Phương thức:</span>
                  <Tag color="blue">{selectedOrder.paymentMethod}</Tag>
                </div>
                <div className="info-row" style={{ marginTop: 5 }}>
                  <span className="info-label">TT Thanh toán:</span>
                  {renderPaymentStatusTag(selectedOrder.paymentStatus)}
                </div>

                <div
                  className="info-row status-update-row"
                  style={{ marginTop: 20 }}
                >
                  <span className="info-label">
                    <b>TT Đơn hàng:</b>
                  </span>
                  <Select
                    value={selectedOrder.status}
                    style={{ width: "100%", marginTop: 5 }}
                    onChange={handleChangeStatus}
                  >
                    <Option value="Đang xử lý">Đang xử lý</Option>
                    <Option value="Đang giao hàng">Đang giao hàng</Option>
                    <Option value="Hoàn thành">Hoàn thành</Option>
                    <Option value="Đã hủy">Đã hủy</Option>
                  </Select>
                </div>
              </div>
            </div>

            <Divider plain>Danh sách sản phẩm</Divider>

            <Table
              columns={detailColumns}
              dataSource={orderDetails}
              rowKey="id"
              pagination={false}
              loading={loadingDetails}
              size="small"
              bordered
            />

            <div
              className="total-price-highlight"
              style={{ textAlign: "right", marginTop: 15, fontSize: 16 }}
            >
              Tổng cộng:{" "}
              <span style={{ color: "#d48806", fontWeight: "bold" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(selectedOrder.totalAmount)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManager;
