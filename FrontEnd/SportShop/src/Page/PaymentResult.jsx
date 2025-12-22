import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/PaymentResult.css";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const paymentId = params.get("paymentId");
  const code = params.get("code");
  const transNo = params.get("transNo"); // Mã giao dịch VNPAY/MOMO

  // Giả sử code "00" là thành công (tuỳ cổng thanh toán)
  const success = code === "00";

  return (
    <div className="payment-result-container">
      <div className="payment-card">
        {success ? (
          // --- TRƯỜNG HỢP THÀNH CÔNG ---
          <>
            <div className="status-icon success-icon">
              {/* Icon dấu tích SVG */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h2 className="payment-title text-success">
              Thanh toán thành công!
            </h2>
            <p className="payment-message">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </p>

            <div className="transaction-details">
              <div className="detail-row">
                <span className="label">Mã giao dịch:</span>
                <span className="value">{transNo || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mã thanh toán:</span>
                <span className="value">{paymentId || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Trạng thái:</span>
                <span className="value" style={{ color: "green" }}>
                  Đã thanh toán
                </span>
              </div>
            </div>

            <div className="actions">
              <button
                className="btn btn-outline"
                onClick={() => navigate("/trangchu")}
              >
                Về trang chủ
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/profile")}
              >
                Xem đơn hàng
              </button>
            </div>
          </>
        ) : (
          // --- TRƯỜNG HỢP THẤT BẠI ---
          <>
            <div className="status-icon error-icon">
              {/* Icon dấu X SVG */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>

            <h2 className="payment-title text-error">Thanh toán thất bại</h2>
            <p className="payment-message">
              Giao dịch không thành công hoặc đã bị hủy. Vui lòng kiểm tra lại.
            </p>

            <div className="transaction-details">
              <div className="detail-row">
                <span className="label">Mã lỗi:</span>
                <span className="value">{code}</span>
              </div>
            </div>

            <div className="actions">
              <button
                className="btn btn-outline"
                onClick={() => navigate("/trangchu")}
              >
                Về trang chủ
              </button>
              <button
                className="btn btn-danger"
                onClick={() => navigate("/cart")}
              >
                Quay lại giỏ hàng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
