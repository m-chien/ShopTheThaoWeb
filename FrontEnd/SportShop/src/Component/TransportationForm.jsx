import React, { useState } from "react";
import styles from "../styles/Transportation.module.css";

export default function TransportationForm({ onSubmit, contactInfo, shippingAddress }) {
  const [selectedShipping, setSelectedShipping] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedShipping) {
      alert("Vui lòng chọn hình thức vận chuyển");
      return;
    }
    const data = { shippingMethod: selectedShipping };
    if (onSubmit) onSubmit(data);
  };

  return (
    <div>
      <div className={styles.infoBoxes}>
        <div className={styles.infoBox}>
          <label className={styles.infoLabel}>Liên hệ</label>
          <div className={styles.infoContent}>{contactInfo || "chientranminh355@gmail.com"}</div>
          <a href="/information" className={styles.changeLink}>
            Thay đổi
          </a>
        </div>

        <div className={styles.infoBox}>
          <label className={styles.infoLabel}>Vận chuyển tới</label>
          <div className={styles.infoContent}>
            {shippingAddress || "88 nguyen gian thanh, Phương An Khê, Quận Thanh Khé, Đà Nẵng 550000, Việt Nam"}
          </div>
          <a href="/information" className={styles.changeLink}>
            Thay đổi
          </a>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>
        Vận chuyển bởi ChienTransport (CT)
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.shippingOption}>
          <input
            type="radio"
            id="standard"
            name="shipping"
            value="standard"
            checked={selectedShipping === "standard"}
            onChange={(e) => setSelectedShipping(e.target.value)}
            className={styles.radio}
          />
          <label htmlFor="standard" className={styles.optionLabel}>
            <div className={styles.optionName}>Phí vận chuyển</div>
            <div className={styles.optionPrice}>MIỄN PHÍ</div>
          </label>
        </div>

        <div className={styles.actionRow}>
          <button type="submit" className={styles.primaryBtn}>
            Chọn hình thức thanh toán »
          </button>
        </div>
      </form>
    </div>
  );
}
