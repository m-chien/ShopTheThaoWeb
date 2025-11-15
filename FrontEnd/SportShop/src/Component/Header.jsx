import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";

export default function Header({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const navItems = [
    {
      label: "Hàng Mới",
      href: "#",
    },
    {
      label: "Nam",
      href: "#",
      submenu: [
        { label: "Áo Nam", href: "#" },
        { label: "Quần Nam", href: "#" },
        { label: "Giày Nam", href: "#" },
        { label: "Phụ Kiện Nam", href: "#" },
      ],
    },
    {
      label: "Nữ",
      href: "#",
      submenu: [
        { label: "Áo Nữ", href: "#" },
        { label: "Quần Nữ", href: "#" },
        { label: "Giày Nữ", href: "#" },
        { label: "Phụ Kiện Nữ", href: "#" },
      ],
    },
    {
      label: "Trẻ Em",
      href: "#",
      submenu: [
        { label: "Áo Trẻ Em", href: "#" },
        { label: "Giày Trẻ Em", href: "#" },
        { label: "Phụ Kiện Trẻ Em", href: "#" },
      ],
    },
    {
      label: "Phụ Kiện",
      href: "#",
      submenu: [
        { label: "Túi Xách", href: "#" },
        { label: "Mũ & Nón", href: "#" },
        { label: "Tất & Vớ", href: "#" },
        { label: "Dụng Cụ Thể Thao", href: "#" },
      ],
    },
    {
      label: "Thương Hiệu",
      href: "#",
      submenu: [
        { label: "Nike", href: "#" },
        { label: "Adidas", href: "#" },
        { label: "Puma", href: "#" },
        { label: "New Balance", href: "#" },
      ],
    },
    {
      label: "Thể Thao",
      href: "#",
      submenu: [
        { label: "Chạy Bộ", href: "#" },
        { label: "Bóng Đá", href: "#" },
        { label: "Bóng Rổ", href: "#" },
        { label: "Yoga", href: "#" },
      ],
    },
    {
      label: "Ưu Đãi",
      href: "#",
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate("/")}>
          <i className="fas fa-running"></i>
          <span className={styles.logoText}>SUPERSPORTS</span>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`${styles.navItem} ${
                activeDropdown === index ? styles.active : ""
              }`}
              onMouseEnter={() => item.submenu && setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href={item.href} className={styles.navLink} onClick={() => navigate("/ProductList")}>
                {item.label}
                {item.submenu && <span className={styles.dropdownIcon}>▼</span>}
              </a>

              {/* Dropdown Menu */}
              {item.submenu && (
                <div className={styles.dropdownMenu}>
                  {item.submenu.map((subitem, subindex) => (
                    <a
                      key={subindex}
                      href={subitem.href}
                      className={styles.dropdownItem}
                      onClick={() => navigate("/ProductList")}
                    >
                      {subitem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search Bar */}
        <div
          className={`${styles.searchContainer} ${
            isSearchFocused ? styles.focused : ""
          }`}
        >
          <input
            type="text"
            placeholder="Bạn đang tìm gì"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={styles.searchInput}
          />
          <button className={styles.searchBtn}>
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* Icons Right */}
        <div className={styles.headerIcons}>
          <button
            className={styles.iconBtn}
            title="Tài khoản"
            onClick={() => navigate("/profile")}
          >
            <i class="fa-regular fa-user"></i>
          </button>
          <button
            className={styles.iconBtn}
            title="Giỏ hàng"
            onClick={() => navigate("/cart")}
          >
            <i class="fa-solid fa-cart-shopping"></i>
            <span className={styles.cartBadge}>0</span>
          </button>
          <button className={styles.iconBtn} title="Vị trí">
            <i class="fas fa-location-dot"></i>
          </button>
          <button className={styles.iconBtn} title="Thông báo">
            <i class="fa-regular fa-bell"></i>
          </button>
          <div className={styles.languageSelector}>
            <button className={styles.languageBtn}>
              <img
                src="https://flagcdn.com/w20/vn.png"
                alt="VN"
                className={styles.flagIcon}
              />
              <span>VN</span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
