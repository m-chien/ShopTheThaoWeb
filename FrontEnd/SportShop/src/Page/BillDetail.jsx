import React, { useState } from "react";
import Breadcrumb from "../Component/Breadcrumb";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import styles from "../styles/BillDetail.module.css";

export default function BillDetail() {
  const [billData] = useState({
    orderId: "#DH-2025-001234",
    orderDate: "05/12/2025",
    orderStatus: "Đã giao",
    deliveryDate: "07/12/2025",
    paymentMethod: "Thanh toán khi nhận hàng",
    paymentStatus: "Đã thanh toán",
    contact: {
      email: "chientranminh355@gmail.com",
      phone: "0969827284",
    },
    shippingAddress: {
      name: "Trần Minh Chiến",
      address: "88 Nguyễn Giản Thanh",
      ward: "Phường An Khê",
      district: "Quận Thanh Khé",
      city: "Đà Nẵng",
      postalCode: "550000",
    },
    shippingMethod: "Minh Chiến Logistics (NTL) - Miễn phí",
    items: [
      {
        id: 1,
        name: "Áo Đá Bóng Nam Puma Manchester City Fc Replica Sân Nhà 25/26",
        price: 2200000,
        quantity: 1,
        image: "/public/Product/ManchesterCityHome.png",
      },
      {
        id: 2,
        name: "Áo Đá Bóng Nam Puma Manchester City Fc Replica Sân Khách 25/26",
        price: 2200000,
        quantity: 1,
        image: "/public/Product/ManchesterCityAway.png",
      },
    ],
    subtotal: 4400000,
    shipping: 0,
    total: 4400000,
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
                  <span className={styles.value}>{billData.orderDate}</span>
                </div>
                <div className={styles.statusRow}>
                  <span className={styles.label}>Ngày giao:</span>
                  <span className={styles.value}>{billData.deliveryDate}</span>
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
                  {billData.shippingAddress.address},{" "}
                  {billData.shippingAddress.ward}
                </p>
                <p className={styles.infoItem}>
                  {billData.shippingAddress.district},{" "}
                  {billData.shippingAddress.city}{" "}
                  {billData.shippingAddress.postalCode}
                </p>
              </div>
            </div>

            {/* Shipping Method */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Phương thức vận chuyển</h2>
              <div className={styles.infoBox}>
                <p className={styles.infoItem}>{billData.shippingMethod}</p>
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
              <button className={styles.continueBtn}>Mua hàng tiếp »</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
