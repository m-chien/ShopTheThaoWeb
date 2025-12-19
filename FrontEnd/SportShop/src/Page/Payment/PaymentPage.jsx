import React, { useState } from "react";
import { useSelector } from "react-redux";
import Breadcrumb from "../../Component/Breadcrumb";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import NotificationModal from "../../Component/NotificationModal";
import PaymentForm from "../../Component/PaymentForm";
import styles from "../../styles/Transaction.module.css";
import OrderSummary from "./OrderSummary";

export default function PaymentPage() {
  const checkout = useSelector((state) => state.checkout);
  const [modal, setModal] = useState({
    isOpen: false,
    status: "",
    title: "",
    message: "",
  });

  const handleFormSubmit = async (data) => {
    try {
      const res = await fetch("https://localhost:7299/api/checkout/vnpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: checkout.userInfo,
          shippingInfo: checkout.shippingInfo,
          items: checkout.cartItems,
          amount: checkout.cartItems.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0,
          ),
        }),
      });

      const result = await res.json();

      // Redirect sang VNPAY
      window.location.href = result.data.paymentUrl;
    } catch (error) {
      setModal({
        isOpen: true,
        status: "error",
        title: "Lỗi thanh toán",
        message: "Không thể kết nối tới cổng thanh toán.",
      });
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <Header />
      <div className={styles.checkoutContainer}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Thông tin", link: "/information" },
            { label: "Vận chuyển", link: "/transportation" },
            { label: "Thanh toán", link: "/payment" },
          ]}
        />

        <div className={styles.checkoutGrid}>
          {/* Left Column - Payment Form */}
          <PaymentForm onSubmit={handleFormSubmit} />

          {/* Right Column - Order Summary */}
          <OrderSummary />
        </div>
      </div>
      <Footer />
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        status={modal.status}
        title={modal.title}
        message={modal.message}
        showButtons={false}
      />
    </div>
  );
}
