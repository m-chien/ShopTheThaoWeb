import { useEffect, useState } from "react";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import "../styles/CartPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Component/Breadcrumb";
import NotificationModal from "../Component/NotificationModal";
import {
  decrementQty,
  incrementQty,
  removeFromCart,
  selectCartDistinctCount,
  selectCartItems,
  selectCartTotalAmount,
  selectSelectedItems,
  selectSelectedTotalAmount,
  toggleSelect,
} from "../redux/slices/cartslice";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const distinctCount = useSelector(selectCartDistinctCount);
  const totalAmount = useSelector(selectCartTotalAmount);
  const selectedItems = useSelector(selectSelectedItems);
  const selectedSubtotal = useSelector(selectSelectedTotalAmount);

  const [searchTerm, setSearchTerm] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // tăng/xuống bằng action
  const handleIncrement = (variantId) => {
    dispatch(incrementQty(variantId));
  };

  const handleDecrement = (variantId) => {
    dispatch(decrementQty(variantId));
  };

  const handleRemove = (variantId) => {
    dispatch(removeFromCart(variantId));
  };

  const handleToggleSelect = (variantId) => {
    dispatch(toggleSelect(variantId));
  };

  // user nhập số trực tiếp: điều chỉnh bằng số lần increment/decrement
  const handleQuantityChange = (variantId, newQty) => {
    if (!Number.isFinite(newQty) || newQty < 1) return;
    const item = cartItems.find((i) => i.variantId === variantId);
    if (!item) return;
    const diff = newQty - item.quantity;
    if (diff === 0) return;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) dispatch(incrementQty(variantId));
    } else {
      for (let i = 0; i < -diff; i++) dispatch(decrementQty(variantId));
    }
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

  const discount = appliedVoucher ? appliedVoucher.discount : 0;
  // dùng subtotal dựa trên selected items (nếu muốn tính theo các item được tick)
  const subtotal = selectedSubtotal; // đổi thành totalAmount nếu muốn toàn giỏ
  const total = subtotal - discount;

  const handleCheckoutClick = () => {
    if (!selectedItems || selectedItems.length === 0) {
      alert("lỗi");
      // nếu chưa tick gì -> show modal hoặc yêu cầu chọn
      setShowModal({
        isOpen: true,
        status: "error",
        title: "Lỗi Thanh Toán",
        message: "Vui lòng chọn ít nhất 1 sản phẩm để tiến hành thanh toán",
      });
      return;
    }
    // }
    // tạo order với selectedItems -> gọi BE hoặc navigate đến thông tin (ghi order tạm)
    navigate("/information");
  };
  // useEffect(() => {
  //   if (!sessionStorage.getItem("accessToken")) {
  //     setShowModal({
  //       isOpen: true,
  //       status: "error",
  //       title: "Lỗi Xác Thực",
  //       message: "Vui lòng Đăng nhập trước khi vào trang này",
  //     });
  //     navigate("/login");
  //     return () => clearTimeout(timer);
  //   }
  // }, [navigate]);

  return (
    <div className="cart-page">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Breadcrumb items={[{ label: "Giỏ Hàng", link: "/cart" }]} />
      <div className="cart-container">
        <h1 className="cart-title">Giỏ hàng</h1>

        <div className="cart-content">
          {/* Left: Cart Items */}
          <div className="cart-items">
            <h2 className="section-title">Tiếp tục mua sắm</h2>

            {cartItems.length > 0 ? (
              <div className="items-list">
                {cartItems.map((item) => (
                  <div key={item.variantId} className="cart-item">
                    {/* Checkbox chọn mua */}
                    <input
                      type="checkbox"
                      checked={!!item.isSelected}
                      onChange={() => handleToggleSelect(item.variantId)}
                      style={{ marginRight: 12 }}
                    />

                    <img
                      src={`../Product/${item.image}`}
                      alt={item.name}
                      className="item-image"
                    />

                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-meta">
                        {item.size?.name || ""} / {item.color?.name || ""}
                      </p>
                      <p className="item-price">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.variantId)}
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="item-quantity">
                      <button onClick={() => handleDecrement(item.variantId)}>
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.variantId,
                            parseInt(e.target.value, 10) || 1,
                          )
                        }
                        min="1"
                      />
                      <button onClick={() => handleIncrement(item.variantId)}>
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
                {/* Hiển thị số sản phẩm được chọn (distinct) */}
                <span>({selectedItems.length} sản phẩm được chọn)</span>
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

            <button className="checkout-btn" onClick={handleCheckoutClick}>
              THANH TOÁN
            </button>

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
      <NotificationModal
        isOpen={showModal.isOpen}
        onClose={() => setShowModal({ ...showModal, isOpen: false })}
        status={showModal.status}
        title={showModal.title}
        message={showModal.message}
        primaryButtonText="Đóng"
        showButtons={false}
      />
    </div>
  );
}
