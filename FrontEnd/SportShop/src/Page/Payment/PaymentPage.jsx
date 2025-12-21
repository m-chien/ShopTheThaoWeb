import React, { useState } from "react";
import { useSelector } from "react-redux";
import Breadcrumb from "../../Component/Breadcrumb";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import NotificationModal from "../../Component/NotificationModal";
import PaymentForm from "../../Component/PaymentForm";
import styles from "../../styles/Transaction.module.css";
import OrderSummary from "./OrderSummary";

// selectors từ slices của bạn
import {
  selectSelectedItems,
  selectSelectedTotalAmount,
} from "../../redux/slices/cartslice";
import { selectUserInfo } from "../../redux/slices/checkoutSlice";
import { createVnpayPayment } from "../../Api/Payment";

export default function PaymentPage() {
  const selectedItems = useSelector(selectSelectedItems); // items đã tick
  console.log("🚀 ~ PaymentPage ~ selectedItems:", selectedItems)
  const selectedTotalAmount = useSelector(selectSelectedTotalAmount); // tổng tiền của items đã tick
  console.log("🚀 ~ PaymentPage ~ selectedTotalAmount:", selectedTotalAmount)
  const userInfo = useSelector(selectUserInfo); // { phone, address }
  console.log("🚀 ~ PaymentPage ~ userInfo:", userInfo)

  const [modal, setModal] = useState({
    isOpen: false,
    status: "",
    title: "",
    message: "",
  });

  // onSubmit từ PaymentForm => receives payment form data (e.g. paymentMethod, invoiceRequired, ...)
  const handleFormSubmit = async (paymentFormData) => {
    // validation: phải có hàng được chọn
    if (!selectedItems || selectedItems.length === 0) {
      setModal({
        isOpen: true,
        status: "error",
        title: "Lỗi đơn hàng",
        message: "Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.",
      });
      return;
    }

    // validation: cần có phone và address trong checkout.userInfo
    const phone = (userInfo && userInfo.phone) || "";
    const address = (userInfo && userInfo.address) || "";
    if (!phone || !address) {
      setModal({
        isOpen: true,
        status: "error",
        title: "Thiếu thông tin",
        message:
          "Vui lòng hoàn thành thông tin liên hệ (số điện thoại) và địa chỉ giao hàng trước khi thanh toán.",
      });
      return;
    }

    // build body theo cấu trúc backend yêu cầu
    const body = {
      voucherId: paymentFormData?.voucherId ?? null,
      amount: selectedTotalAmount || 0,
      deliveryAddress: address,
      phone: phone,
      items: selectedItems.map((i) => ({
        productVariantId: i.variantId, // đổi theo key của bạn
        quantity: i.quantity,
      })),
    };

    try {
      const res = await createVnpayPayment(body);
      if (res?.data?.data?.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
      } else {
        setModal({
          isOpen: true,
          status: "success",
          title: "Thanh toán",
          message: "Yêu cầu thanh toán đã được tạo. Kiểm tra hướng dẫn tiếp theo.",
        });
      }
    } catch (error) {
      console.error("Thanh toán lỗi:", error);
      setModal({
        isOpen: true,
        status: "error",
        title: "Lỗi thanh toán",
        message:
          "Không thể kết nối tới cổng thanh toán. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ.",
      });
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
