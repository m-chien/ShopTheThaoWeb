import "../../Component/Profile/Addresses.css";

const Addresses = ({ userInfo }) => {
  return (
    <>
      <div className="section-header">
        <h2>Địa chỉ giao hàng</h2>
        <button className="add-btn">+ Thêm địa chỉ mới</button>
      </div>

      <div className="addresses-list">
        <div className="address-card">
          <div className="address-header">
            <h3>Nhà riêng</h3>
            <span className="badge-default">Mặc định</span>
          </div>
          <p>{userInfo.address}</p>
          <p>
            {userInfo.ward}, {userInfo.district}, {userInfo.city}
          </p>
          <p>{userInfo.phone}</p>
          <div className="address-actions">
            <button className="edit-link">Chỉnh sửa</button>
            <button className="delete-link">Xóa</button>
          </div>
        </div>

        <div className="address-card">
          <div className="address-header">
            <h3>Nơi làm việc</h3>
          </div>
          <p>456 Đường XYZ, Quận 3, TP.HCM</p>
          <p>Phường 5, Quận 3, TP.HCM</p>
          <p>0912345678</p>
          <div className="address-actions">
            <button className="edit-link">Chỉnh sửa</button>
            <button className="delete-link">Xóa</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addresses;
