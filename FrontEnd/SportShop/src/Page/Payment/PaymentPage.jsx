import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createVnpayPayment } from "../../Api/Payment";
import Breadcrumb from "../../Component/Breadcrumb";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import NotificationModal from "../../Component/NotificationModal";
import PaymentForm from "../../Component/PaymentForm";
// selectors từ slices của bạn
import {
  selectSelectedItems,
  selectSelectedTotalAmount,
} from "../../redux/slices/cartslice";
import { selectUserInfo } from "../../redux/slices/checkoutSlice";
import styles from "../../styles/Transaction.module.css";
import OrderSummary from "./OrderSummary";

export default function PaymentPage() {
  const selectedItems = useSelector(selectSelectedItems);
  const selectedTotalAmount = useSelector(selectSelectedTotalAmount);
  const userInfo = useSelector(selectUserInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    status: "",
    title: "",
    message: "",
  });

  // onSubmit từ PaymentForm => receives payment form data (e.g. paymentMethod, invoiceRequired, ...)
  const handleFormSubmit = async (paymentFormData) => {
    if (isSubmitting) return;

    // validation
    if (!selectedItems || selectedItems.length === 0) {
      setModal({
        isOpen: true,
        status: "error",
        title: "Lỗi đơn hàng",
        message: "Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.",
      });
      return;
    }

    const phone = userInfo?.phone || "";
    const address = userInfo?.address || "";
    if (!phone || !address) {
      setModal({
        isOpen: true,
        status: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng hoàn thành thông tin liên hệ và địa chỉ giao hàng.",
      });
      return;
    }

    const body = {
      voucherId: paymentFormData?.voucherId ?? null,
      amount: selectedTotalAmount || 0,
      deliveryAddress: address,
      phone: phone,
      items: selectedItems.map((i) => ({
        productVariantId: i.variantId,
        quantity: i.quantity,
      })),
    };

    try {
      setIsSubmitting(true);

      const res = await createVnpayPayment(body);

      if (res?.data?.data?.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
      } else {
        setModal({
          isOpen: true,
          status: "success",
          title: "Thanh toán",
          message: "Yêu cầu thanh toán đã được tạo.",
        });
      }
    } catch (error) {
      console.error("Thanh toán lỗi:", error);
      setModal({
        isOpen: true,
        status: "error",
        title: "Lỗi thanh toán",
        message: "Không thể kết nối tới cổng thanh toán. Vui lòng thử lại.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <Header />
      <div className={styles.checkoutContainer}>
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
