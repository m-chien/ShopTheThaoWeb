import { useEffect, useState } from "react";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/IMG_6162.JPG";
import Breadcrumb from "../Component/Breadcrumb";
import { User } from "../Api/User";

export default function Profile() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    fullName: "Trần Minh Chiến",
    email: "chientranminh355@gmail.com",
    phone: "0969827284",
    address: "88 Nguyễn Giản Thanh",
    city: "TP. Đà Nẵng",
    district: "Thanh Khê",
    ward: "Phường An Khê",
    postalCode: "700000",
    avatar: avatar,
  });
  console.log("🚀 ~ Profile ~ userInfo:", userInfo)

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await User().getUserInfo(); // gọi trực tiếp
      console.log("🚀 ~ fetchUser ~ data:", data)
      setUserInfo(data.data);
    } catch (err) {
      console.log("Lỗi:", err);
    }
  };

  fetchUser();
}, []);


  const [orders] = useState([
    {
      id: "ORD001",
      date: "2025-11-10",
      total: 2200000,
      status: "Đã giao",
      items: ["Áo Đá Bóng Nam Puma Manchester City"],
    },
    {
      id: "ORD002",
      date: "2025-11-08",
      total: 1500000,
      status: "Đang xử lý",
      items: ["Giày chạy bộ Nike", "Túi xách thể thao"],
    },
    {
      id: "ORD003",
      date: "2025-11-05",
      total: 850000,
      status: "Đã giao",
      items: ["Quần shorts thể thao"],
    },
  ]);

  const [editForm, setEditForm] = useState(userInfo);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveProfile = () => {
    setUserInfo(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(userInfo);
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "status-completed";
      case "Đang xử lý":
        return "status-processing";
      case "Đang giao":
        return "status-shipping";
      default:
        return "status-pending";
    }
  };

  if (!sessionStorage.getItem("accessToken")) {
    alert("Vui lòng đăng nhập trước khi vào");
    navigate("/");
    return <div>đăng nhập đi bạn eyy!!</div>;
  }

  return (
    <div className="profile-page">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Breadcrumb items={[{ label: "Hồ sơ", link: "" }]} />

      <div className="profile-container">
        <h1 className="page-title">Tài khoản của tôi</h1>

        <div className="profile-content">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="user-card">
              <img src={ "../../public/useAva.png"} alt="Avatar" className="user-avatar" />
              <h2>{userInfo.fullName}</h2>
              <p className="user-email">{userInfo.email}</p>
            </div>

            <nav className="profile-nav">
              <button
                className={`nav-item ${activeTab === "info" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("info");
                  setIsEditing(false);
                }}
              >
                ℹ️ Thông tin tài khoản
              </button>
              <button
                className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("orders");
                  setIsEditing(false);
                }}
              >
                📦 Đơn hàng của tôi
              </button>
              <button
                className={`nav-item ${
                  activeTab === "addresses" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab("addresses");
                  setIsEditing(false);
                }}
              >
                📍 Địa chỉ giao hàng
              </button>
              <button
                className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("settings");
                  setIsEditing(false);
                }}
              >
                ⚙️ Cài đặt
              </button>
              <button className="nav-item logout-btn">🚪 Đăng xuất</button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            {/* Tab: Thông tin tài khoản */}
            {activeTab === "info" && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Thông tin tài khoản</h2>
                  {!isEditing && (
                    <button
                      className="edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Chỉnh sửa
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="info-display">
                    <div className="info-row">
                      <label>Họ và tên:</label>
                      <span>{userInfo.fullName}</span>
                    </div>
                    <div className="info-row">
                      <label>Email:</label>
                      <span>{userInfo.email}</span>
                    </div>
                    <div className="info-row">
                      <label>Số điện thoại:</label>
                      <span>{userInfo.phone}</span>
                    </div>
                    <div className="info-row">
                      <label>Địa chỉ:</label>
                      <span>{userInfo.address}</span>
                    </div>
                    <div className="info-row">
                      <label>Thành phố:</label>
                      <span>{userInfo.city}</span>
                    </div>
                    <div className="info-row">
                      <label>Quận/Huyện:</label>
                      <span>{userInfo.district}</span>
                    </div>
                    <div className="info-row">
                      <label>Phường/Xã:</label>
                      <span>{userInfo.ward}</span>
                    </div>
                    <div className="info-row">
                      <label>Mã bưu chính:</label>
                      <span>{userInfo.postalCode}</span>
                    </div>
                  </div>
                ) : (
                  <div className="info-edit">
                    <div className="form-group">
                      <label>Họ và tên</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={editForm.address}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Thành phố</label>
                      <input
                        type="text"
                        name="city"
                        value={editForm.city}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Quận/Huyện</label>
                      <input
                        type="text"
                        name="district"
                        value={editForm.district}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phường/Xã</label>
                      <input
                        type="text"
                        name="ward"
                        value={editForm.ward}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mã bưu chính</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={editForm.postalCode}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-actions">
                      <button className="save-btn" onClick={handleSaveProfile}>
                        💾 Lưu thay đổi
                      </button>
                      <button className="cancel-btn" onClick={handleCancel}>
                        ❌ Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Đơn hàng của tôi */}
            {activeTab === "orders" && (
              <div className="tab-content">
                <h2>Đơn hàng của tôi</h2>

                {orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>Đơn hàng #{order.id}</h3>
                            <p className="order-date">
                              Ngày đặt:{" "}
                              {new Date(order.date).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div
                            className={`order-status ${getStatusColor(order.status)}`}
                          >
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
                          <button className="order-detail-btn">
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
              </div>
            )}

            {/* Tab: Địa chỉ giao hàng */}
            {activeTab === "addresses" && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Địa chỉ giao hàng</h2>
                  <button className="add-btn">+ Thêm địa chỉ mới</button>
                </div>

                <div className="addresses-list">
                  <div className="address-card">
                    <div className="address-header">
                      <h3>Nhà riêng</h3>
                      <span className="badge-default">Mặc định</span>
                    </div>
                    <p>{userInfo.address}</p>
                    <p>
                      {userInfo.ward}, {userInfo.district}, {userInfo.city}
                    </p>
                    <p>{userInfo.phone}</p>
                    <div className="address-actions">
                      <button className="edit-link">Chỉnh sửa</button>
                      <button className="delete-link">Xóa</button>
                    </div>
                  </div>

                  <div className="address-card">
                    <div className="address-header">
                      <h3>Nơi làm việc</h3>
                    </div>
                    <p>456 Đường XYZ, Quận 3, TP.HCM</p>
                    <p>Phường 5, Quận 3, TP.HCM</p>
                    <p>0912345678</p>
                    <div className="address-actions">
                      <button className="edit-link">Chỉnh sửa</button>
                      <button className="delete-link">Xóa</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Cài đặt */}
            {activeTab === "settings" && (
              <div className="tab-content">
                <h2>Cài đặt tài khoản</h2>

                <div className="settings-section">
                  <h3>Bảo mật</h3>
                  <div className="setting-item">
                    <div>
                      <h4>Mật khẩu</h4>
                      <p>Đổi mật khẩu của tài khoản</p>
                    </div>
                    <button className="setting-btn">Đổi mật khẩu</button>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>Thông báo</h3>
                  <div className="setting-item">
                    <div>
                      <h4>Email thông báo</h4>
                      <p>Nhận thông báo về đơn hàng qua email</p>
                    </div>
                    <label className="checkbox">
                      <input type="checkbox" defaultChecked />
                      <span>Bật</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>SMS thông báo</h4>
                      <p>Nhận thông báo về đơn hàng qua SMS</p>
                    </div>
                    <label className="checkbox">
                      <input type="checkbox" defaultChecked />
                      <span>Bật</span>
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>Dữ liệu</h3>
                  <div className="setting-item">
                    <div>
                      <h4>Tải xuống dữ liệu cá nhân</h4>
                      <p>Tải xuống toàn bộ thông tin cá nhân của bạn</p>
                    </div>
                    <button className="setting-btn">Tải xuống</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Xóa tài khoản</h4>
                      <p>Xóa vĩnh viễn tài khoản và dữ liệu liên quan</p>
                    </div>
                    <button className="setting-btn delete-btn">
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
