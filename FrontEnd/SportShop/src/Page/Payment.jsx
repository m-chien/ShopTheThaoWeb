import { ChevronDown, CreditCard } from "lucide-react";
import React, { useState } from "react";
import styles from "../styles/Payment.module.css";
import Breadcrumb from "../Component/Breadcrumb";
import Footer from "../Component/Footer";
import Header from "../Component/Header";

export default function CheckoutPage() {
  const [expandedPayment, setExpandedPayment] = useState("onepay");
  const [invoiceRequired, setInvoiceRequired] = useState(false);

  const cartItems = [
    {
      id: 1,
      name: "Giày Chạy Bộ Nữ Adidas Adizero Sl2 - Xám",
      size: "XÁM / UK 6",
      price: 1629000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Áo Đá Bóng Nam Puma Manchester City Fc Replica Sân Nhà 25/26 - Xanh Dương",
      size: "XANH DƯƠNG / M",
      price: 2200000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=100&h=100&fit=crop",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  return (
    <div className={styles.checkoutPage}>
      <Header />
      <div className={styles.checkoutContainer}>
        {/* Breadcrumb */}
        <Breadcrumb items={[{label: "Payment", link: "/payment"}]} />

        <div className={styles.checkoutGrid}>
          {/* Left Column - Payment Form */}
          <div className={styles.paymentSection}>
            {/* Contact Info */}
            <div className={styles.infoBox}>
              <div className={styles.infoHeader}>
                <span className={styles.infoLabel}>Liên hệ</span>
                <button className={styles.changeButton}>Thay đổi</button>
              </div>
              <p className={styles.infoValue}>chientranminh355@gmail.com</p>
            </div>

            {/* Shipping Address */}
            <div className={styles.infoBox}>
              <div className={styles.infoHeader}>
                <span className={styles.infoLabel}>Vận chuyển tới</span>
                <button className={styles.changeButton}>Thay đổi</button>
              </div>
              <p className={styles.infoValue}>
                88 nguyen gian thanh, Đà Nẵng, Việt Nam
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
                  Địa chỉ thanh toán của phương thức thanh toán phải khớp với
                  địa chỉ giao hàng. Toàn bộ các giao dịch được bảo mật và mã
                  hóa.
                </p>
              </div>

              {/* OnePay - ATM/QR/MoMo */}
              <div className={styles.paymentOptionWrapper}>
                <button
                  onClick={() =>
                    setExpandedPayment(
                      expandedPayment === "onepay" ? "" : "onepay",
                    )
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
                        Sau khi nhấp vào "Thanh toán ngay", bạn sẽ được chuyển
                        hướng đến Cổng OnePAY - Thẻ ATM/QR/MoMo để hoàn tất việc
                        mua hàng một cách an toàn.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Installment 0% */}
              <div className={styles.paymentOptionWrapper}>
                <button
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
                  onClick={() =>
                    setExpandedPayment(
                      expandedPayment === "zalopay" ? "" : "zalopay",
                    )
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
              <div className={`${styles.paymentOptionWrapper} ${styles.paymentOptionLast}`}>
                <button
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
              <input type="checkbox" id="terms" className={styles.checkbox} />
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
              <button className={styles.backButton}>‹ Quay trở lại vận chuyển</button>
              <button className={styles.submitButton}>Thanh toán ngay</button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryBox}>
              {/* Cart Items */}
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImageWrapper}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.itemImage}
                      />
                      <div className={styles.itemBadge}>{item.quantity}</div>
                    </div>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemSize}>{item.size}</p>
                    </div>
                    <div className={styles.itemPrice}>{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className={styles.promoSection}>
                <input
                  type="text"
                  placeholder="Nhập mã khuyến mãi"
                  className={styles.promoInput}
                />
                <button className={styles.promoButton}>Áp dụng</button>
              </div>

              {/* Price Summary */}
              <div className={styles.priceSummary}>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Tổng phụ - 2 mặt hàng</span>
                  <span className={styles.priceValue}>{formatPrice(subtotal)}</span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Phí vận chuyển</span>
                  <span className={`${styles.priceValue} ${styles.priceFree}`}>MIỄN PHÍ</span>
                </div>
              </div>

              {/* Total */}
              <div className={styles.totalSection}>
                <span className={styles.totalLabel}>Tổng</span>
                <div className={styles.totalAmount}>
                  <div className={styles.totalCurrency}>VND</div>
                  <div className={styles.totalPrice}>{formatPrice(total)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}