import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const paymentId = params.get("paymentId");
  const code = params.get("code");
  const transNo = params.get("transNo");

  const success = code === "00";

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      {success ? (
        <>
          <h2 style={{ color: "green" }}>✅ Thanh toán thành công</h2>
          <p>Mã giao dịch: {transNo}</p>
          <p>Mã thanh toán: {paymentId}</p>

          <button onClick={() => navigate("/")}>Về trang chủ</button>
        </>
      ) : (
        <>
          <h2 style={{ color: "red" }}>❌ Thanh toán thất bại</h2>

          <button onClick={() => navigate("/cart")}>Quay lại giỏ hàng</button>
        </>
      )}
    </div>
  );
}
