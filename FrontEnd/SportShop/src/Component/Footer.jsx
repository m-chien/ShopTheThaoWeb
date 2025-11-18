import styles from "../styles/Footer.module.css";

function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerBrand}>
              <i className="fas fa-running"></i>
              <span>SUPERSPORTS</span>
            </div>
            <p>Website sản phẩm thể thao chính hãng hàng đầu Việt Nam</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.fb}>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className={styles.ins}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className={styles.yt}>
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h4>Dịch vụ</h4>
            <ul>
              <li>
                <a href="#">Giới thiệu</a>
              </li>
              <li>
                <a href="#">Hệ thống cửa hàng</a>
              </li>
              <li>
                <a href="#">Thông tin liên hệ</a>
              </li>
              <li>
                <a href="#">Các điều khoản và điều kiện</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Hỗ trợ</h4>
            <ul>
              <li>
                <a href="#">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#">Chính sách</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
              <li>
                <a href="#">Góp ý</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Liên hệ</h4>
            <div className={styles.contactInfo}>
              <p>
                <i className="fas fa-phone"></i> 0969 827 284
              </p>
              <p>
                <i className="fas fa-envelope"></i> chientranminh355@gmail.com
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i> 88 Nguyễn Giản Thanh
              </p>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 SUPERSPORTS. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
export default Footer;
