import "../../Component/Profile/Setting.css";
import { useState } from "react";
import { api } from "../../Api/Api";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const [showChangePass, setShowChangePass] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleChangePassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("Mật khẩu mới không khớp");
      return;
    }

    try {
      setLoading(true);

      await api.put("/User/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      alert("Đổi mật khẩu thành công, vui lòng đăng nhập lại");

      // logout sau khi đổi pass (đúng security)
      await api.post("/User/logout");
      logout();
      sessionStorage.removeItem("accessToken");
      navigate("/login", { replace: true });

    } catch (err) {
      alert(
        err?.response?.data?.message || "Mật khẩu cũ không đúng"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Cài đặt tài khoản</h2>

      <div className="settings-section">
        <h3>Bảo mật</h3>
        <div className="setting-item">
          <div>
            <h4>Mật khẩu</h4>
            <p>Đổi mật khẩu của tài khoản</p>
          </div>
          <button
            className="setting-btn"
            onClick={() => setShowChangePass(!showChangePass)}
          >
            Đổi mật khẩu
          </button>
        </div>

        {showChangePass && (
          <div className="change-password-form">
            <div className="form-group">
              <label>Mật khẩu hiện tại</label>
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              className="save-btn"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Lưu mật khẩu"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Setting;
