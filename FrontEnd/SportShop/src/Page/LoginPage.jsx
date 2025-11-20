import { useRef, useState } from "react";
import "../styles/AuthPage.css";
import { useNavigate } from "react-router-dom";
import { User } from "../Api/User";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import { RegisterPage } from "./RegisterPage";

export function LoginPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = () => {
    if (
      usernameRef.current.value != "" &&
      passwordRef.current.value != "" &&
      rememberMe
    ) {
      User()
        .login(usernameRef.current.value, passwordRef.current.value)
        .then((data) => {
          console.log("Login successful:", data);
          navigate("/")
          // const token = data.accessToken;
          // if (token) {
          //   const decoded = jwt_decode(token);
          //   navigate(decoded.role == "Admin" ? "/admin" : "/");
          // }
        })
        .catch((error) => {
          console.error("Login failed:", error.message);
        });
    } else {
      alert("Vui lòng nhập đầy đủ thông tin và đồng ý ghi nhớ đăng nhập!");
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
    </div>
  );
}
