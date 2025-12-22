import "../../Component/Profile/Setting.css";

const Setting = () => {
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
          <button className="setting-btn delete-btn">Xóa tài khoản</button>
        </div>
      </div>
    </>
  );
};

export default Setting;
