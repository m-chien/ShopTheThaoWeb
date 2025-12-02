import React from "react";
import styles from "../../styles/OrderSummary.module.css";

const OrderSummary = () => {
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
            <span className={`${styles.priceValue} ${styles.priceFree}`}>
              MIỄN PHÍ
            </span>
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
  );
};

export default OrderSummary;
