import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/slices/checkoutSlice";
import styles from "../styles/Payment.module.css";
import NotificationModal from "./NotificationModal";

export default function PaymentForm({ onSubmit}) {
  const userInfo = useSelector(selectUserInfo) || {};
  const contactPhone = userInfo.phone || "";
  const shippingAddress = userInfo.address || "";

  const [expandedPayment, setExpandedPayment] = useState("onepay");
  const [invoiceRequired, setInvoiceRequired] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    status: "",
    title: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setModal({
        isOpen: true,
        status: "error",
        title: "Lỗi Điều khoản",
        message: "Vui lòng đồng ý với Điều khoản và Chính sách để tiếp tục",
      });
      return;
    }

    const data = {
      paymentMethod: expandedPayment,
      invoiceRequired,
      termsAccepted,
      // thêm phone/address vào payload nếu cần gửi lên BE từ đây
      contactPhone,
      shippingAddress,
    };

    if (onSubmit) onSubmit(data);
  };

  return (
    <form className={styles.paymentSection} onSubmit={handleSubmit}>
      {/* Contact Info */}
      <div className={styles.infoBox}>
        <div className={styles.infoHeader}>
          <span className={styles.infoLabel}>Liên hệ</span>
          <a href="/information" className={styles.changeButton}>
            Thay đổi
          </a>
        </div>
        <p className={styles.infoValue}>
          {contactPhone || "Chưa có số điện thoại — vui lòng nhập ở bước Thông tin"}
        </p>
      </div>

      {/* Shipping Address */}
      <div className={styles.infoBox}>
        <div className={styles.infoHeader}>
          <span className={styles.infoLabel}>Vận chuyển tới</span>
          <a href="/information" className={styles.changeButton}>
            Thay đổi
          </a>
        </div>
        <p className={styles.infoValue}>
          {shippingAddress || "Chưa có địa chỉ giao hàng — vui lòng nhập ở bước Thông tin"}
        </p>
      </div>

      {/* ... phần còn lại giữ nguyên ... */}
      {/* Shipping Method */}
      <div className={styles.infoBox}>
        <div className={styles.infoHeader}>
          <span className={styles.infoLabel}>Phương thức vận chuyển</span>
        </div>
        <p className={styles.infoValue}>
          Phí vận chuyển · <span className={styles.freeShipping}>MIỄN PHÍ</span>
        </p>
      </div>

      {/* Invoice Checkbox */}
      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="invoice"
          checked={invoiceRequired}
          onChange={(e) => setInvoiceRequired(e.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor="invoice" className={styles.checkboxLabel}>
          Yêu cầu xuất hóa đơn
        </label>
      </div>

      {/* Payment options (giữ nguyên) */}
      <div className={styles.paymentBox}>
        {/* OnePay */}
        <div className={styles.paymentOptionWrapper}>
          <button
            type="button"
            onClick={() =>
              setExpandedPayment(expandedPayment === "onepay" ? "" : "onepay")
            }
            className={styles.paymentOption}
          >
            <div className={styles.paymentOptionContent}>
              <div
                className={`${styles.radio} ${
                  expandedPayment === "onepay" ? styles.radioChecked : ""
                }`}
              >
                {expandedPayment === "onepay" && (
                  <div className={styles.radioDot}></div>
                )}
              </div>
              <span className={styles.paymentName}>
                Cổng OnePAY - Thẻ ATM/QR/MoMo
              </span>
              <div className={styles.paymentLogos}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                  alt="Visa"
                  className={styles.paymentLogo}
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  className={styles.paymentLogo}
                />
                <span className={styles.paymentMore}>+2</span>
              </div>
            </div>
          </button>
          {expandedPayment === "onepay" && (
            <div className={styles.paymentExpanded}>
              <div className={styles.paymentInfo}>
                <div className={styles.paymentPlaceholder}></div>
                <p className={styles.paymentText}>
                  Sau khi nhấp vào "Thanh toán ngay", bạn sẽ được chuyển hướng
                  đến Cổng OnePAY - Thẻ ATM/QR/MoMo để hoàn tất việc mua hàng
                  một cách an toàn.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* các payment option khác giữ nguyên... (installment, zalopay, momo, cod) */}
        {/* ... */}
      </div>

      {/* Terms */}
      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor="terms" className={styles.checkboxLabel}>
          Tôi đồng ý với{" "}
          <a href="#" className={styles.termsLink}>
            Điều khoản và Chính sách
          </a>{" "}
          quy định bởi Supersports*
        </label>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button type="submit" className={styles.submitButton}>
          Thanh toán ngay
        </button>
      </div>

      <NotificationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        status={modal.status}
        title={modal.title}
        message={modal.message}
        primaryButtonText="Đóng"
        showButtons={true}
      />
    </form>
  );
}
