import { useEffect, useState } from "react";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { User } from "../Api/User";
import avatar from "../assets/IMG_6162.JPG";
import Breadcrumb from "../Component/Breadcrumb";
import NotificationModal from "../Component/NotificationModal";
import Setting from "../Component/Profile/Setting";
import Addresses from "../Component/Profile/Addresses";
import Info from "../Component/Profile/Info";
import { Orders } from "../Component/Profile/Orders";

export default function Profile() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
  console.log("🚀 ~ Profile ~ userInfo:", userInfo);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await User().getUserInfo(); // gọi trực tiếp
        console.log("🚀 ~ fetchUser ~ data:", data);
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

  // useEffect(() => {
  //   if (!sessionStorage.getItem("accessToken")) {
  //     setShowModal(true);
  //     const timer = setTimeout(() => {
  //       navigate("/login");
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [navigate]);

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
                src={"../../public/useAva.png"}
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
                <Info
                  userInfo={userInfo}
                  isEditing={isEditing}
                  editForm={editForm}
                  handleEditChange={handleEditChange}
                  setIsEditing={setIsEditing}
                  handleSaveProfile={handleSaveProfile}
                  handleCancel={handleCancel}
                />
              </div>
            )}

            {/* Tab: Đơn hàng của tôi */}
            {activeTab === "orders" && (
              <div className="tab-content">
                <Orders orders={orders} getStatusColor={getStatusColor} />
              </div>
            )}

            {/* Tab: Địa chỉ giao hàng */}
            {activeTab === "addresses" && (
              <div className="tab-content">
                <Addresses userInfo={userInfo} />
              </div>
            )}

            {/* Tab: Cài đặt */}
            {activeTab === "settings" && (
              <div className="tab-content">
                <Setting />
              </div>
            )}
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
