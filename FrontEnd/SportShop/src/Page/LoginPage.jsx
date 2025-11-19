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
