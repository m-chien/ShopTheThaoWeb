import { ChevronDown, CreditCard } from "lucide-react";
import React, { useState } from "react";
import "../styles/Payment.css";
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
    <div className="checkout-page">
      <Header />
      <div className="checkout-container">
        {/* Breadcrumb */}
        <Breadcrumb type="payment" />

        <div className="checkout-grid">
          {/* Left Column - Payment Form */}
          <div className="payment-section">
            {/* Contact Info */}
            <div className="info-box">
              <div className="info-header">
                <span className="info-label">Liên hệ</span>
                <button className="change-button">Thay đổi</button>
              </div>
              <p className="info-value">chientranminh355@gmail.com</p>
            </div>

            {/* Shipping Address */}
            <div className="info-box">
              <div className="info-header">
                <span className="info-label">Vận chuyển tới</span>
                <button className="change-button">Thay đổi</button>
              </div>
              <p className="info-value">
                88 nguyen gian thanh, Đà Nẵng, Việt Nam
              </p>
            </div>

            {/* Shipping Method */}
            <div className="info-box">
              <div className="info-header">
                <span className="info-label">Phương thức vận chuyển</span>
              </div>
              <p className="info-value">
                Phí vận chuyển · <span className="free-shipping">MIỄN PHÍ</span>
              </p>
            </div>

            {/* Invoice Checkbox */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="invoice"
                checked={invoiceRequired}
                onChange={(e) => setInvoiceRequired(e.target.checked)}
                className="checkbox"
              />
              <label htmlFor="invoice" className="checkbox-label">
                Yêu cầu xuất hóa đơn
              </label>
            </div>

            {/* Payment Section */}
            <div className="payment-box">
              <div className="payment-header">
                <h2 className="payment-title">Thanh toán</h2>
                <p className="payment-description">
                  Địa chỉ thanh toán của phương thức thanh toán phải khớp với
                  địa chỉ giao hàng. Toàn bộ các giao dịch được bảo mật và mã
                  hóa.
                </p>
              </div>

              {/* OnePay - ATM/QR/MoMo */}
              <div className="payment-option-wrapper">
                <button
                  onClick={() =>
                    setExpandedPayment(
                      expandedPayment === "onepay" ? "" : "onepay",
                    )
                  }
                  className="payment-option"
                >
                  <div className="payment-option-content">
                    <div
                      className={`radio ${expandedPayment === "onepay" ? "radio-checked" : ""}`}
                    >
                      {expandedPayment === "onepay" && (
                        <div className="radio-dot"></div>
                      )}
                    </div>
                    <span className="payment-name">
                      Cổng OnePAY - Thẻ ATM/QR/MoMo
                    </span>
                    <div className="payment-logos">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                        alt="Visa"
                        className="payment-logo"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="payment-logo"
                      />
                      <span className="payment-more">+2</span>
                    </div>
                  </div>
                </button>
                {expandedPayment === "onepay" && (
                  <div className="payment-expanded">
                    <div className="payment-info">
                      <div className="payment-placeholder"></div>
                      <p className="payment-text">
                        Sau khi nhấp vào "Thanh toán ngay", bạn sẽ được chuyển
                        hướng đến Cổng OnePAY - Thẻ ATM/QR/MoMo để hoàn tất việc
                        mua hàng một cách an toàn.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Installment 0% */}
              <div className="payment-option-wrapper">
                <button
                  onClick={() =>
                    setExpandedPayment(
                      expandedPayment === "installment" ? "" : "installment",
                    )
                  }
                  className="payment-option"
                >
                  <div className="payment-option-content">
                    <div
                      className={`radio ${expandedPayment === "installment" ? "radio-checked" : ""}`}
                    >
                      {expandedPayment === "installment" && (
                        <div className="radio-dot"></div>
                      )}
                    </div>
                    <span className="payment-name">
                      Trả góp 0% lãi suất qua thẻ tín dụng
                    </span>
                    <div className="payment-logos">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                        alt="Visa"
                        className="payment-logo"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="payment-logo"
                      />
                    </div>
                  </div>
                </button>
              </div>

              {/* ZaloPay */}
              <div className="payment-option-wrapper">
                <button
                  onClick={() =>
                    setExpandedPayment(
                      expandedPayment === "zalopay" ? "" : "zalopay",
                    )
                  }
                  className="payment-option"
                >
                  <div className="payment-option-content">
                    <div
                      className={`radio ${expandedPayment === "zalopay" ? "radio-checked" : ""}`}
                    >
                      {expandedPayment === "zalopay" && (
                        <div className="radio-dot"></div>
                      )}
                    </div>
                    <span className="payment-name">Ví ZaloPay</span>
                    <div className="payment-logos">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="payment-logo"
                      />
                      <span className="payment-more">+2</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* MoMo via OnePay */}
              <div className="payment-option-wrapper">
                <button
                  onClick={() =>
                    setExpandedPayment(expandedPayment === "momo" ? "" : "momo")
                  }
                  className="payment-option"
                >
                  <div className="payment-option-content">
                    <div
                      className={`radio ${expandedPayment === "momo" ? "radio-checked" : ""}`}
                    >
                      {expandedPayment === "momo" && (
                        <div className="radio-dot"></div>
                      )}
                    </div>
                    <span className="payment-name">
                      Thanh toán MoMo qua OnePay
                    </span>
                  </div>
                </button>
              </div>

              {/* COD */}
              <div className="payment-option-wrapper payment-option-last">
                <button
                  onClick={() =>
                    setExpandedPayment(expandedPayment === "cod" ? "" : "cod")
                  }
                  className="payment-option"
                >
                  <div className="payment-option-content">
                    <div
                      className={`radio ${expandedPayment === "cod" ? "radio-checked" : ""}`}
                    >
                      {expandedPayment === "cod" && (
                        <div className="radio-dot"></div>
                      )}
                    </div>
                    <span className="payment-name">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="checkbox-group">
              <input type="checkbox" id="terms" className="checkbox" />
              <label htmlFor="terms" className="checkbox-label">
                Tôi đồng ý với{" "}
                <a href="#" className="terms-link">
                  Điều khoản và Chính sách
                </a>{" "}
                quy định bởi Supersports*
              </label>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="back-button">‹ Quay trở lại vận chuyển</button>
              <button className="submit-button">Thanh toán ngay</button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary">
            <div className="summary-box">
              {/* Cart Items */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image-wrapper">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-badge">{item.quantity}</div>
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-size">{item.size}</p>
                    </div>
                    <div className="item-price">{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="promo-section">
                <input
                  type="text"
                  placeholder="Nhập mã khuyến mãi"
                  className="promo-input"
                />
                <button className="promo-button">Áp dụng</button>
              </div>

              {/* Price Summary */}
              <div className="price-summary">
                <div className="price-row">
                  <span className="price-label">Tổng phụ - 2 mặt hàng</span>
                  <span className="price-value">{formatPrice(subtotal)}</span>
                </div>
                <div className="price-row">
                  <span className="price-label">Phí vận chuyển</span>
                  <span className="price-value price-free">MIỄN PHÍ</span>
                </div>
              </div>

              {/* Total */}
              <div className="total-section">
                <span className="total-label">Tổng</span>
                <div className="total-amount">
                  <div className="total-currency">VND</div>
                  <div className="total-price">{formatPrice(total)}</div>
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
