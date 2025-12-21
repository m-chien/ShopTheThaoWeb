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
import { ShoppingOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// Import API
import { getAllOrders, updateOrder, getOrderDetails } from "../../../Api/Order";
import "../Css/OrderManager.css";

const { Option } = Select;

const OrderManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State chi tiết đơn hàng
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // --- 1. LẤY DANH SÁCH ĐƠN HÀNG ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      const rawData = res.data;

      // Xử lý dữ liệu trả về
      if (Array.isArray(rawData)) {
        setData(rawData);
      } else if (rawData && Array.isArray(rawData.data)) {
        setData(rawData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      message.error("Lỗi tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 2. XỬ LÝ MỞ MODAL & GỌI API CHI TIẾT ---
  const handleViewDetail = async (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
    setOrderDetails([]); // Reset bảng trước khi load mới

    if (record.id) {
      setLoadingDetails(true);
      try {
        const res = await getOrderDetails(record.id);

        // Xử lý dữ liệu chi tiết trả về
        if (res.data && Array.isArray(res.data.data)) {
          setOrderDetails(res.data.data);
        } else if (Array.isArray(res.data)) {
          setOrderDetails(res.data);
        } else {
          setOrderDetails([]);
        }
      } catch (error) {
        message.error("Không thể tải chi tiết sản phẩm!");
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  // --- 3. CẬP NHẬT TRẠNG THÁI ---
  const handleChangeStatus = async (newStatus) => {
    if (!selectedOrder) return;

    try {
      const id = selectedOrder.id;

      const cleanPayload = {
        id: parseInt(id),
        userId: selectedOrder.userId,
        status: newStatus,
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

      // Cập nhật UI ngay lập tức
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      fetchOrders();
    } catch (error) {
      if (error.response?.status === 400) {
        message.error("Lỗi dữ liệu (400). Kiểm tra lại Backend.");
      } else {
        message.error("Có lỗi xảy ra khi cập nhật!");
      }
    }
  };

  // --- HELPER: RENDER TRẠNG THÁI ---
  const renderStatusTag = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s.includes("đang xử lý") || s.includes("pending")) {
      return <span className="order-status-pending">Đang xử lý</span>;
    } else if (s.includes("giao") || s.includes("shipping")) {
      return <span className="order-status-shipping">Đang giao hàng</span>;
    } else if (s.includes("hoàn thành") || s.includes("paid")) {
      return <span className="order-status-completed">Hoàn thành</span>;
    } else if (s.includes("hủy") || s.includes("cancelled")) {
      return <span className="order-status-cancelled">Đã hủy</span>;
    }
    return <Tag>{status}</Tag>;
  };

  // --- CẤU HÌNH CỘT BẢNG CHÍNH ---
  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <b>#{id}</b>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <div>
          <b>{name}</b>
          <div style={{ fontSize: 12, color: "#888" }}>ID: {record.userId}</div>
        </div>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "..."),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <b style={{ color: "#d48806" }}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </b>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xử lý
          </Button>
        </Space>
      ),
    },
  ];

  // --- CẤU HÌNH CỘT CHI TIẾT SẢN PHẨM (TRONG MODAL) ---
  const detailColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (p) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(p ?? 0),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (t) => (
        <b>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(t ?? 0)}
        </b>
      ),
    },
  ];

  return (
    <div>
      <div className="order-page-header">
        <h2>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          Quản lý Đơn Hàng
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

      {/* --- MODAL CHI TIẾT --- */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={750}
      >
        {selectedOrder && (
          <div className="order-detail-modal-content">
            <div className="customer-info-section">
              <div className="info-row">
                <span className="info-label">Khách hàng:</span>{" "}
                <b>{selectedOrder.customerName || selectedOrder.userId}</b>
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

              {/* Select Cập nhật trạng thái */}
              <div
                className="info-row status-update-row"
                style={{ marginTop: 15 }}
              >
                <span className="info-label">Cập nhật trạng thái:</span>
                <Select
                  value={selectedOrder.status}
                  style={{ width: 200, marginLeft: 10 }}
                  onChange={handleChangeStatus}
                >
                  <Option value="Đang xử lý">Đang xử lý</Option>
                  <Option value="Đang giao hàng">Đang giao hàng</Option>
                  <Option value="Hoàn thành">Hoàn thành / Đã thanh toán</Option>
                  <Option value="Đã hủy">Đã hủy</Option>
                </Select>
              </div>
            </div>

            <Divider titlePlacement="left" plain>
              Danh sách sản phẩm
            </Divider>

            <Table
              columns={detailColumns}
              dataSource={orderDetails}
              rowKey="id"
              pagination={false}
              loading={loadingDetails}
              size="small"
              bordered
              locale={{ emptyText: "Đang tải hoặc không có sản phẩm..." }}
            />

            <div className="total-price-highlight">
              Tổng cộng:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(selectedOrder.totalAmount)}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManager;
