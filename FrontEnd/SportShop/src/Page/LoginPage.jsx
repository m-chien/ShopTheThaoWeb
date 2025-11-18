import React, { useState } from "react";
import "../styles/AuthPage.css";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import { RegisterPage } from "./RegisterPage";

export function LoginPage() {
  const [currentPage, setCurrentPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    console.log("Login:", { email, password, rememberMe });
  };

  if (currentPage === "register") {
    return <RegisterPage setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="auth-page">
      <Header />

      <div className="auth-main">
        <div className="auth-content-wrapper">
          {/* LEFT SIDE */}
          <div className="brand-section">
            <div className="brand-content">
              <h2 className="brand-title">Chào mừng trở lại!</h2>
              <p className="brand-subtitle">
                Đăng nhập để trải nghiệm mua sắm tốt nhất
              </p>

              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h4>Theo dõi đơn hàng dễ dàng</h4>
                    <p>Cập nhật trạng thái giao hàng mọi lúc</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h4>Thanh toán nhanh chóng</h4>
                    <p>Lưu thông tin để checkout nhanh hơn</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h4>Ưu đãi độc quyền</h4>
                    <p>Nhận thông báo về sale và sản phẩm mới</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
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
                  <label className="input-label">
                    Email hoặc số điện thoại
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email hoặc số điện thoại"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
