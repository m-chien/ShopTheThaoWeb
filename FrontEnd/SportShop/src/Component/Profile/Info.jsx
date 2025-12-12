import "../../Component/Profile/Info.css";

const Info = ({ userInfo, isEditing, editForm, handleEditChange, setIsEditing, handleSaveProfile, handleCancel }) => {
  return (
    <>
      <div className="section-header">
        <h2>Thông tin tài khoản</h2>
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            ✏️ Chỉnh sửa
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="info-display">
          <div className="info-row">
            <label>Họ và tên:</label>
            <span>{userInfo.fullName}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{userInfo.email}</span>
          </div>
          <div className="info-row">
            <label>Số điện thoại:</label>
            <span>{userInfo.phone}</span>
          </div>
          <div className="info-row">
            <label>Địa chỉ:</label>
            <span>{userInfo.address}</span>
          </div>
          <div className="info-row">
            <label>Thành phố:</label>
            <span>{userInfo.city}</span>
          </div>
          <div className="info-row">
            <label>Quận/Huyện:</label>
            <span>{userInfo.district}</span>
          </div>
          <div className="info-row">
            <label>Phường/Xã:</label>
            <span>{userInfo.ward}</span>
          </div>
          <div className="info-row">
            <label>Mã bưu chính:</label>
            <span>{userInfo.postalCode}</span>
          </div>
        </div>
      ) : (
        <div className="info-edit">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={editForm.address}
              onChange={handleEditChange}
            />
          </div>
          <div className="form-group">
            <label>Thành phố</label>
            <input
              type="text"
              name="city"
              value={editForm.city}
              onChange={handleEditChange}
            />
          </div>
          <div className="form-group">
            <label>Quận/Huyện</label>
            <input
              type="text"
              name="district"
              value={editForm.district}
              onChange={handleEditChange}
            />
          </div>
          <div className="form-group">
            <label>Phường/Xã</label>
            <input
              type="text"
              name="ward"
              value={editForm.ward}
              onChange={handleEditChange}
            />
          </div>
          <div className="form-group">
            <label>Mã bưu chính</label>
            <input
              type="text"
              name="postalCode"
              value={editForm.postalCode}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-actions">
            <button className="save-btn" onClick={handleSaveProfile}>
              💾 Lưu thay đổi
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              ❌ Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Info;
