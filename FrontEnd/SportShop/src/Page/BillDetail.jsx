import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../Api/Api";
import { User } from "../Api/User";
import Breadcrumb from "../Component/Breadcrumb";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import styles from "../styles/BillDetail.module.css";

export default function BillDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [billData, setBillData] = useState(null);

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
    );
    if (!confirmCancel) return;

    try {
      await api.delete(`/order/${billData.orderId}`);

      alert("Hủy đơn hàng thành công!");
      navigate("/profile");
    } catch (err) {
      console.error("Cancel order error:", err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Không thể hủy đơn hàng. Vui lòng thử lại!");
      }
    }
  };

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const [orderRes, userRes] = await Promise.all([
          api.get("/Order/my-orders"),
          User().getUserInfo(),
        ]);

        const orderData = orderRes.data.data;
        const user = userRes.data;
        console.log("🚀 ~ fetchBill ~ user:", user);

        // 1. Tìm đơn hàng hiện tại
        const order = orderData.orders.find((o) => o.id === Number(id));

        // 2. Lấy danh sách chi tiết đơn hàng (để lấy quantity)
        const currentOrderDetails = orderData.orderDetails.filter(
          (d) => d.orderId === Number(id),
        );

        // 3. Lấy danh sách thông tin sản phẩm
        const products = orderData.products.filter(
          (p) => p.OrderID === Number(id),
        );

        const payment = orderData.payments.find(
          (p) => p.orderId === Number(id),
        );

        setBillData({
          orderId: order.id,
          orderDate: order.orderDate,
          orderStatus: order.status,

          paymentMethod: payment?.method,
          paymentStatus: payment?.status,

          contact: {
            email: user.email,
            phone: user.phone,
          },

          shippingAddress: {
            name: user.fullName,
            address: order.deliveryAddress,
            // Nếu API không trả về ward/district/city ở đây thì bạn cần xử lý chuỗi address hoặc lấy từ user info nếu có
            ward: "",
            district: "",
            city: "",
            postalCode: "",
          },

          // --- ĐÂY LÀ PHẦN QUAN TRỌNG ĐÃ SỬA ---
          items: products.map((p) => {
            // Tìm detail tương ứng với product này qua ProductVariantID
            const detail = currentOrderDetails.find(
              (d) => d.productVariantId === p.ProductVariantID,
            );

            return {
              id: p.ProductVariantID, // Thêm key id để React render list không bị lỗi
              name: p.ProductName,
              image: `/public/Product/${p.Image}`, // Lưu ý đường dẫn ảnh
              price: p.Price,
              // Lấy quantity từ detail tìm được, nếu không thấy thì mặc định là 1
              quantity: detail ? detail.quantity : 1,
              size: p.SizeName,
              color: p.ColorName,
            };
          }),
          // -------------------------------------

          subtotal: order.totalAmount,
          total: order.totalAmount,
        });
      } catch (err) {
        console.log("Fetch bill error:", err);
        navigate("/login");
      }
    };

    fetchBill();
  }, [id]);

  if (!billData) return <div>Đang tải đơn hàng...</div>;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };
  const getDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className={styles.billDetailPage}>
      <Header />
      <Breadcrumb
        items={[
          { label: "Tài Khoản", link: "/profile" },
          { label: "Chi tiết đơn hàng", link: "/bill-detail" },
        ]}
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chi tiết đơn hàng</h1>
          <div className={styles.orderMeta}>
            <span className={styles.orderId}>{billData.orderId}</span>
            <span className={`${styles.status} ${styles.delivered}`}>
              {billData.orderStatus}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Order Status */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Trạng thái đơn hàng</h2>
              <div className={styles.statusBox}>
                <div className={styles.statusRow}>
                  <span className={styles.label}>Ngày đặt hàng:</span>
                  <span className={styles.value}>
                    {formatDate(billData.orderDate)}
                  </span>
                </div>

                <div className={styles.statusRow}>
                  <span className={styles.label}>
                    {billData.orderStatus == "Đã hoàn thành"
                      ? "Ngày Giao:"
                      : "Ngày giao dự kiến:"}
                  </span>
                  <span className={styles.value}>
                    {getDeliveryDate(billData.orderDate)}
                  </span>
                </div>

                <div className={styles.statusRow}>
                  <span className={styles.label}>Hình thức thanh toán:</span>
                  <span className={styles.value}>{billData.paymentMethod}</span>
                </div>
                <div className={styles.statusRow}>
                  <span className={styles.label}>Trạng thái thanh toán:</span>
                  <span className={`${styles.value} ${styles.paid}`}>
                    {billData.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Liên hệ</h2>
              <div className={styles.infoBox}>
                <p className={styles.infoItem}>
                  <strong>Email:</strong> {billData.contact.email}
                </p>
                <p className={styles.infoItem}>
                  <strong>Số điện thoại:</strong> {billData.contact.phone}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Địa chỉ giao hàng</h2>
              <div className={styles.infoBox}>
                <p className={styles.infoItem}>
                  <strong>{billData.shippingAddress.name}</strong>
                </p>
                <p className={styles.infoItem}>
                  {billData.shippingAddress.address}
                </p>
              </div>
            </div>

            {/* Shipping Method */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Phương thức vận chuyển</h2>
              <div className={styles.infoBox}>
                <p className={styles.infoItem}>Vận Chuyển bởi chienShip</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Order Items */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Sản phẩm</h2>
              <div className={styles.itemsList}>
                {billData.items.map((item) => (
                  <div key={item.id} className={styles.itemRow}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemDetails}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className={styles.itemTotal}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Tóm tắt đơn hàng</h2>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Tiền Hàng:</span>
                  <span>{formatPrice(billData.subtotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Vận chuyển:</span>
                  <span className={styles.free}>Miễn phí</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(billData.total)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <a href="/cart" className={styles.backBtn}>
                ‹ Quay trở lại
              </a>

              {billData.orderStatus === "Đang xử lý" && (
                <button
                  className={styles.cancelBtn}
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </button>
              )}

              <button
                className={styles.continueBtn}
                onClick={() => navigate("/ProductList")}
              >
                Mua hàng tiếp »
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
