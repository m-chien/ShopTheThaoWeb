import { useState } from "react";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import "../styles/CartPage.css";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Áo Đá Bóng Nam Puma Manchester City Fc Replica Sân Nhà 25/26",
      price: 2200000,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop",
      quantity: 1,
      size: "M",
      color: "Xanh Dương",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const applyVoucher = () => {
    if (voucherCode === "VOUCHER150000") {
      setAppliedVoucher({
        code: voucherCode,
        discount: 150000,
      });
      setVoucherCode("");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedVoucher ? appliedVoucher.discount : 0;
  const shippingFee = 0; // Miễn phí vận chuyển
  const total = subtotal - discount + shippingFee;

  return (
    <div className="cart-page">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="breadcrumb">
        <span className="HomePage">Trang chủ</span>
        <span>›</span>
        <span>Giỏ hàng</span>
      </div>
      <div className="cart-container">
        {/* Breadcrumb */}

        <h1 className="cart-title">Giỏ hàng</h1>

        <div className="cart-content">
          {/* Left: Cart Items */}
          <div className="cart-items">
            <h2 className="section-title">Tiếp tục mua sắm</h2>

            {cartItems.length > 0 ? (
              <div className="items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />

                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-meta">
                        {item.size} / {item.color}
                      </p>
                      <p className="item-price">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="item-quantity">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        min="1"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-cart">
                <p>Giỏ hàng của bạn đang trống</p>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="cart-summary">
            <div className="summary-section">
              <div className="summary-row">
                <span>({cartItems.length} sản phẩm)</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className="summary-row">
                <span>Giảm giá</span>
                <span>Áp dụng tại trang thanh toán</span>
              </div>

              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>Phí ship sẽ được tính tại trang thanh toán</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Thành tiền:</span>
                <span className="total-amount">
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button className="checkout-btn">THANH TOÁN</button>

            <p className="payment-note">
              *Phí ship và voucher áp dụng tại trang thanh toán
            </p>

            <div className="voucher-section">
              <h3>Có mã voucher?</h3>
              <div className="voucher-input">
                <input
                  type="text"
                  placeholder="Nhập mã voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button onClick={applyVoucher}>Áp dụng</button>
              </div>
              {appliedVoucher && (
                <p className="voucher-applied">
                  ✓ Đã áp dụng: {appliedVoucher.code}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
