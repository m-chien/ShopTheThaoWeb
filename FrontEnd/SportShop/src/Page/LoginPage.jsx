import { jwtDecode } from "jwt-decode";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

// Components & API
import { User } from "../Api/User";
import { useAuth } from "../Component/AuthProvider";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import NotificationModal from "../Component/NotificationModal";
import { RegisterPage } from "./RegisterPage";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // State
  const [currentPage, setCurrentPage] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState({
    isOpen: false,
    status: "",
    title: "",
    message: "",
  });

  // Refs
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username || !password) {
      setShowModal({
        isOpen: true,
        status: "error",
        title: "Lỗi đăng nhập",
        message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!",
      });
      return;
    }

    try {
      const response = await User().login(username, password);
      const token = response.data.accessToken;

      if (token) {
        login(token);

        let decoded;
        try {
          decoded = jwtDecode(token);
        } catch (err) {
          console.error("JWT Decode Error:", err);
          navigate("/");
          return;
        }

        setShowModal({
          isOpen: true,
          status: "success",
          title: "Đăng nhập thành công",
          message: "Chào mừng bạn quay trở lại!",
        });

        setTimeout(() => {
          navigate(decoded.role === "Admin" ? "/admin" : "/trangchu");
        }, 1000);
      }
    } catch (error) {
      console.error("Login failed:", error);

      let displayMsg = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (error.response && error.response.data) {
        const svData = error.response.data;

        if (
          svData.errors &&
          Array.isArray(svData.errors) &&
          svData.errors.length > 0
        ) {
          const firstError = svData.errors[0];
          try {
            const parsedError = JSON.parse(firstError);
            displayMsg = parsedError.message || firstError;
          } catch (e) {
            displayMsg = firstError;
          }
        } else if (svData.message && svData.message !== "Bad Request") {
          displayMsg = svData.message;
        } else if (svData.title) {
          displayMsg = svData.title;
        }
      } else if (error.message) {
        displayMsg = error.message;
      }

      setShowModal({
        isOpen: true,
        status: "error",
        title: "Thông báo",
        message: displayMsg,
      });
    }
  };

  if (currentPage === "register") {
    return <RegisterPage setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="auth-page">
      <Header />

      <div className="auth-main">
        <div className="auth-content-wrapper">
          <div className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">Đăng nhập</h1>
                <p className="form-description">
                  Nhập thông tin tài khoản của bạn
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">Nhập tên đăng nhập</label>
                  <input
                    type="text"
                    ref={usernameRef}
                    placeholder="Nhập tên đăng nhập"
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <div className="label-row">
                    <label className="input-label">Mật khẩu</label>
                    <a href="#" className="forgot-password">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <input
                    type="password"
                    ref={passwordRef}
                    placeholder="Nhập mật khẩu"
                    className="input-field"
                  />
                </div>

                <div className="remember-group">
                  <label className="remember-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="remember-checkbox"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                </div>

                <button type="submit" className="submit-btn">
                  Đăng nhập
                </button>

                <div className="signup-prompt">
                  Bạn chưa có tài khoản?
                  <span
                    className="signup-link"
                    onClick={() => setCurrentPage("register")}
                  >
                    Đăng ký ngay
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <NotificationModal
        isOpen={showModal.isOpen}
        status={showModal.status}
        title={showModal.title}
        message={showModal.message}
        onClose={() => setShowModal({ ...showModal, isOpen: false })}
        primaryButtonText="Đóng"
        showButtons={false}
      />
    </div>
  );
}
