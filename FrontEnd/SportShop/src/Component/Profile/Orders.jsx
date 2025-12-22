import { useNavigate } from "react-router-dom";
import "../../Component/Profile/Orders.css";

export const Orders = ({ orders, getStatusColor }) => {
  const navigate = useNavigate();

  return (
    <>
      <h2>Đơn hàng của tôi</h2>

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Đơn hàng #{order.id}</h3>
                  <p className="order-date">
                    Ngày đặt: {new Date(order.date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <p key={idx}>• {item}</p>
                ))}
              </div>

              <div className="order-footer">
                <span className="order-total">
                  Tổng cộng: {order.total.toLocaleString("vi-VN")}đ
                </span>
                <button
                  className="order-detail-btn"
                  onClick={() => navigate(`/bill-detail/${order.id}`)}
                >
                  Chi tiết đơn hàng
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Bạn chưa có đơn hàng nào</p>
        </div>
      )}
    </>
  );
};
