import { useState } from "react";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { api } from "../Api/Api";
import avatar from "../assets/IMG_6162.JPG";
import Breadcrumb from "../Component/Breadcrumb";
import NotificationModal from "../Component/NotificationModal";
import Addresses from "../Component/Profile/Addresses";
import Info from "../Component/Profile/Info";
import { Orders } from "../Component/Profile/Orders";
import Setting from "../Component/Profile/Setting";
import useFetchAll from "../hooks/useFetchAll";
import { useAuth } from "../Component/AuthProvider";

export default function Profile() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {logout} = useAuth();

  // Dùng useFetchAll cho user info
  const { data: userInfo, loading: loadingUser } = useFetchAll(
    "/User/profile",
    {
      avatar,
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      postalCode: "",
    },
  );

  // Dùng useFetchAll cho orders
  const { data: ordersData, loading: loadingOrders } = useFetchAll(
    "/Order/my-orders",
    {
      orders: [],
      products: [],
    },
  );

  // Map orders giống trước
  const orders =
    ordersData?.orders?.map((order) => {
      const productsOfOrder = ordersData.products.filter(
        (p) => p.OrderID === order.id,
      );
      return {
        id: order.id,
        date: order.orderDate,
        total: order.totalAmount,
        status: order.status,
        items: productsOfOrder.map(
          (p) => `${p.ProductName} (${p.SizeName} - ${p.ColorName})`,
        ),
      };
    }) || [];

  const [editForm, setEditForm] = useState(userInfo);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveProfile = () => {
    // Lưu editForm lên server nếu cần
    setEditForm(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(userInfo);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      // Gọi BE để xoá refreshToken (HttpOnly cookie)
      await api.post("/User/logout", null, {
        withCredentials: true,
      });
      logout();
    } catch (err) {
      console.error("Logout error:", err);
      // lỗi cũng kệ, vẫn cho logout FE
    } finally {
      // Xoá access token phía client
      sessionStorage.removeItem("accessToken");

      // Điều hướng về login
      navigate("/login", { replace: true });
    }
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

  if (loadingUser || loadingOrders) return <div>Loading...</div>;

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
              <img
                src={userInfo.avatar || avatar}
                alt="Avatar"
                className="user-avatar"
              />
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
                className={`nav-item ${activeTab === "addresses" ? "active" : ""}`}
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
              <button className="nav-item logout-btn" onClick={handleLogout}>
                🚪 Đăng xuất
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            {activeTab === "info" && (
              <Info
                userInfo={userInfo}
                isEditing={isEditing}
                editForm={editForm}
                handleEditChange={handleEditChange}
                setIsEditing={setIsEditing}
                handleSaveProfile={handleSaveProfile}
                handleCancel={handleCancel}
              />
            )}
            {activeTab === "orders" && (
              <Orders orders={orders} getStatusColor={getStatusColor} />
            )}
            {activeTab === "addresses" && <Addresses userInfo={userInfo} />}
            {activeTab === "settings" && <Setting />}
          </div>
        </div>
      </div>

      <Footer />
      <NotificationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          navigate("/login");
        }}
        status="error"
        title="Phiên đăng nhập hết hạn"
        message="Vui lòng đăng nhập để xem giỏ hàng"
        primaryButtonText="Đăng nhập"
        onPrimaryClick={() => navigate("/login")}
        showButtons={true}
      />
    </div>
  );
}
