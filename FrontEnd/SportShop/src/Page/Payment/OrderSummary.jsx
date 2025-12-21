import React from "react";
import { useSelector } from "react-redux";
import {
  selectSelectedItems,
  selectSelectedTotalAmount,
} from "../../redux/slices/cartslice";
import styles from "../../styles/OrderSummary.module.css";

const OrderSummary = () => {
  // 👉 LẤY TỪ REDUX
  const selectedItems = useSelector(selectSelectedItems);
  const subtotal = useSelector(selectSelectedTotalAmount);

  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " ₫";

  return (
    <div className={styles.orderSummary}>
      <div className={styles.summaryBox}>
        {/* Cart Items */}
        <div className={styles.cartItems}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <div key={item.variantId} className={styles.cartItem}>
                <div className={styles.itemImageWrapper}>
                  <img
                    src={`../Product/${item.image}`}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemBadge}>{item.quantity}</div>
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemSize}>
                    {item.size?.name || ""} / {item.color?.name || ""}
                  </p>
                </div>

                <div className={styles.itemPrice}>
                  {formatPrice(item.price)}
                </div>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào được chọn</p>
          )}
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
            <span className={styles.priceLabel}>
              Tổng phụ - {selectedItems.length} mặt hàng
            </span>
            <span className={styles.priceValue}>
              {formatPrice(subtotal)}
            </span>
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
            <div className={styles.totalPrice}>
              {formatPrice(total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
