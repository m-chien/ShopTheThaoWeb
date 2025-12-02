import React, { useState } from "react";
import styles from "../styles/Payment.module.css";
import NotificationModal from "./NotificationModal";

export default function PaymentForm({
  onSubmit,
  contactInfo,
  shippingAddress,
  shippingMethod,
}) {
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
          {contactInfo || "chientranminh355@gmail.com"}
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
          {shippingAddress || "88 nguyen gian thanh, Đà Nẵng, Việt Nam"}
        </p>
      </div>

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

      {/* Payment Section */}
      <div className={styles.paymentBox}>
        <div className={styles.paymentHeader}>
          <h2 className={styles.paymentTitle}>Thanh toán</h2>
          <p className={styles.paymentDescription}>
            Địa chỉ thanh toán của phương thức thanh toán phải khớp với địa chỉ
            giao hàng. Toàn bộ các giao dịch được bảo mật và mã hóa.
          </p>
        </div>

        {/* OnePay - ATM/QR/MoMo */}
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
                className={`${styles.radio} ${expandedPayment === "onepay" ? styles.radioChecked : ""}`}
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

        {/* Installment 0% */}
        <div className={styles.paymentOptionWrapper}>
          <button
            type="button"
            onClick={() =>
              setExpandedPayment(
                expandedPayment === "installment" ? "" : "installment",
              )
            }
            className={styles.paymentOption}
          >
            <div className={styles.paymentOptionContent}>
              <div
                className={`${styles.radio} ${expandedPayment === "installment" ? styles.radioChecked : ""}`}
              >
                {expandedPayment === "installment" && (
                  <div className={styles.radioDot}></div>
                )}
              </div>
              <span className={styles.paymentName}>
                Trả góp 0% lãi suất qua thẻ tín dụng
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
              </div>
            </div>
          </button>
        </div>

        {/* ZaloPay */}
        <div className={styles.paymentOptionWrapper}>
          <button
            type="button"
            onClick={() =>
              setExpandedPayment(expandedPayment === "zalopay" ? "" : "zalopay")
            }
            className={styles.paymentOption}
          >
            <div className={styles.paymentOptionContent}>
              <div
                className={`${styles.radio} ${expandedPayment === "zalopay" ? styles.radioChecked : ""}`}
              >
                {expandedPayment === "zalopay" && (
                  <div className={styles.radioDot}></div>
                )}
              </div>
              <span className={styles.paymentName}>Ví ZaloPay</span>
              <div className={styles.paymentLogos}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  className={styles.paymentLogo}
                />
                <span className={styles.paymentMore}>+2</span>
              </div>
            </div>
          </button>
        </div>

        {/* MoMo via OnePay */}
        <div className={styles.paymentOptionWrapper}>
          <button
            type="button"
            onClick={() =>
              setExpandedPayment(expandedPayment === "momo" ? "" : "momo")
            }
            className={styles.paymentOption}
          >
            <div className={styles.paymentOptionContent}>
              <div
                className={`${styles.radio} ${expandedPayment === "momo" ? styles.radioChecked : ""}`}
              >
                {expandedPayment === "momo" && (
                  <div className={styles.radioDot}></div>
                )}
              </div>
              <span className={styles.paymentName}>
                Thanh toán MoMo qua OnePay
              </span>
            </div>
          </button>
        </div>

        {/* COD */}
        <div
          className={`${styles.paymentOptionWrapper} ${styles.paymentOptionLast}`}
        >
          <button
            type="button"
            onClick={() =>
              setExpandedPayment(expandedPayment === "cod" ? "" : "cod")
            }
            className={styles.paymentOption}
          >
            <div className={styles.paymentOptionContent}>
              <div
                className={`${styles.radio} ${expandedPayment === "cod" ? styles.radioChecked : ""}`}
              >
                {expandedPayment === "cod" && (
                  <div className={styles.radioDot}></div>
                )}
              </div>
              <span className={styles.paymentName}>
                Thanh toán khi nhận hàng (COD)
              </span>
            </div>
          </button>
        </div>
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
