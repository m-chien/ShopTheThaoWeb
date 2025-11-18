import { useState } from "react";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import "../styles/AuthPage.css";

export function RegisterPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    receiveNews: true,
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    console.log("Register:", formData);
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <Header />

      <div className="auth-main">
        <div className="auth-content-wrapper">
          {/* Left - Brand Section */}
          <div className="brand-section">
            <div className="brand-content">
              <h2 className="brand-title">Tham gia cùng chúng tôi!</h2>
              <p className="brand-subtitle">
                Đăng ký thành viên để nhận ưu đãi độc quyền
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
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h4>Thành viên miễn phí</h4>
                    <p>Tạo tài khoản hoàn toàn miễn phí</p>
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
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h4>Giảm giá đặc biệt</h4>
                    <p>Nhận voucher và khuyến mãi riêng</p>
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
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h4>Thông báo sớm</h4>
                    <p>Cập nhật sản phẩm mới trước tiên</p>
                  </div>
                </div>
              </div>

              <div className="promo-badge">
                <span className="badge-text">
                  🎉 Giảm 10% cho đơn hàng đầu tiên
                </span>
              </div>
            </div>
          </div>

          {/* Right - Form Section */}
          <div className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">Đăng ký tài khoản</h1>
                <p className="form-description">
                  Điền thông tin để tạo tài khoản mới
                </p>
              </div>

              <div className="auth-form">
                <div className="input-group">
                  <label className="input-label">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="input-field"
                  />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label className="input-label">Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tối thiểu 8 ký tự"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="receiveNews"
                      checked={formData.receiveNews}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>Nhận email về sản phẩm mới và ưu đãi đặc biệt</span>
                  </label>

                  <label className="checkbox-label required-check">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>
                      Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
                      <a href="#">Chính sách bảo mật</a>
                    </span>
                  </label>
                </div>

                <button onClick={handleSubmit} className="submit-btn">
                  Đăng ký
                </button>

                <div className="divider-line">
                  <span>Hoặc đăng ký với</span>
                </div>

                <div className="social-login">
                  <button className="social-btn google">
                    <svg viewBox="0 0 24 24" className="social-icon">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button className="social-btn facebook">
                    <svg viewBox="0 0 24 24" className="social-icon">
                      <path
                        fill="#1877F2"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    Facebook
                  </button>
                </div>

                <div className="signup-prompt">
                  Đã có tài khoản?{" "}
                  <span
                    className="signup-link"
                    onClick={() => setCurrentPage("login")}
                  >
                    Đăng nhập ngay
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
