import { jwtDecode } from "jwt-decode";
import { useRef, useState } from "react";
import "../styles/AuthPage.css";
import { useNavigate } from "react-router-dom";
import { User } from "../Api/User";
import { useAuth } from "../Component/AuthProvider";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import NotificationModal from "../Component/NotificationModal";
import { RegisterPage } from "./RegisterPage";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [showModal, setShowModal] = useState({
    isOpen: false,
    status: "",
    title: "",
    message: "",
  });

  const handleSubmit = async () => {
    if (usernameRef.current.value !== "" && passwordRef.current.value !== "") {
      try {
        const data = await User().login(
          usernameRef.current.value,
          passwordRef.current.value,
        );

        const token = data.data.accessToken;
        if (token) {
          login(token);
          let decoded;
          try {
            decoded = jwtDecode(token);
          } catch (e) {
            console.error("JWT decode failed:", e);
            navigate("/trangchu");
            return;
          }
          setShowModal({
            isOpen: true,
            status: "success",
            title: "Đăng nhập thành công",
            message: "Bạn đã đăng nhập thành công!",
          });
          setTimeout(() => {
            navigate(decoded.role === "Admin" ? "/admin" : "/trangchu");
          }, 3000);
        }
      } catch (error) {
        console.error("Login failed:", error);
        alert("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
      }
    } else {
      setShowModal({
        isOpen: true,
        status: "error",
        title: "Lỗi đăng nhập",
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
      return;
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

              <div className="auth-form">
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

                <button onClick={handleSubmit} className="submit-btn">
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
              </div>
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
        onPrimaryClick={showModal.onPrimaryClick}
      />
    </div>
  );
}
