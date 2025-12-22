import React, { useState } from "react";
import styles from "../styles/Information.module.css";

export default function InformationForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [country, setCountry] = useState("Việt Nam");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phone) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }
    if (!address) {
      alert("Vui lòng nhập địa chỉ nhận hàng");
      return;
    }

    // CHỈ gửi phone và address như yêu cầu
    const data = {
      phone: phone.trim(),
      address: address.trim(),
    };

    if (onSubmit) onSubmit(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Thông tin liên lạc</h1>

      <div className={styles.fieldFull}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={subscribe}
          onChange={(e) => setSubscribe(e.target.checked)}
          className={styles.check}
        />
        <span>Gửi cho tôi tin tức và ưu đãi qua email</span>
      </label>

      <h2 className={styles.sectionTitle}>Địa chỉ giao hàng</h2>
      <p className={styles.helpText}>
        Địa chỉ này cũng sẽ được dùng làm địa chỉ thanh toán cho đơn hàng này.
      </p>

      <div className={styles.row2}>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className={styles.select}
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          <option value="da-nang">Đà Nẵng</option>
          <option value="ho-chi-minh">Hồ Chí Minh</option>
          <option value="ha-noi">Hà Nội</option>
        </select>

        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className={styles.select}
        >
          <option value="">Chọn Phường/Xã</option>
          <option value="da-nang">An Khê</option>
          <option value="ho-chi-minh">Hòa Xuân</option>
          <option value="ha-noi">Hải Châu</option>
        </select>
      </div>

      <div className={styles.row2}>
        <input
          type="text"
          placeholder="Tên"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Họ"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldFull}>
        <input
          type="text"
          placeholder="Địa chỉ nhận hàng (Số nhà, đường phố, hẻm, Căn hộ...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldFull}>
        <input
          type="tel"
          placeholder="Điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={styles.input}
        />
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={saveAddress}
          onChange={(e) => setSaveAddress(e.target.checked)}
          className={styles.check}
        />
        <span>Lưu địa chỉ này</span>
      </label>

      <div className={styles.actionsRow}>
        <button type="submit" className={styles.primaryBtn}>
          Chọn hình thức vận chuyển »
        </button>
      </div>
    </form>
  );
}
