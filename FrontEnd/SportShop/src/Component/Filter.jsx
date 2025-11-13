import PropTypes from "prop-types";
import { useState } from "react";
import "../styles/Filter.css";

export default function Filter({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}) {
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    size: false,
    color: false,
    price: false,
  });

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBrandChange = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName],
    );
  };

  const handleSizeChange = (sizeName) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeName)
        ? prev.filter((s) => s !== sizeName)
        : [...prev, sizeName],
    );
  };

  const handleColorChange = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName],
    );
  };

  const brands = [
    { name: "ADIDAS", count: 0 },
    { name: "NIKE", count: 0 },
    { name: "PUMA", count: 0 },
  ];

  const sizes = [
    { name: "S", count: 0 },
    { name: "M", count: 0 },
    { name: "L", count: 0 },
    { name: "XL", count: 0 },
    { name: "XS", count: 0 },
    { name: "XXL", count: 0 },
  ];

  const colors = [
    { name: "ĐEN", color: "#000000", count: 0 },
    { name: "ĐỎ", color: "#FF0000", count: 0 },
    { name: "HỒNG", color: "#FFB6C1", count: 0 },
    {
      name: "NHIỀU MÀU",
      color: "linear-gradient(90deg, #FF0000, #FFFF00, #00FF00, #0000FF)",
      count: 0,
    },
    { name: "TRẮNG", color: "#FFFFFF", count: 0 },
    { name: "XANH DƯƠNG", color: "#0000FF", count: 0 },
    { name: "XANH LÁ", color: "#008000", count: 0 },
  ];

  return (
    <aside className="filter-sidebar">
      {/* Filter Header - Show selected items */}
      <div className="filter-group">
        <div className="filter-header-top">
          <span className="filter-title">LỌC THEO</span>
          <button
            className="clear-all-btn"
            onClick={() => {
              setSelectedBrands([]);
              setSelectedSizes([]);
              setSelectedColors([]);
              setSelectedPrice(null);
            }}
          >
            XÓA TẤT CẢ
          </button>
        </div>

        {/* Display selected items */}
        <div className="filter-selected-items">
          {selectedBrands.map((brand) => (
            <div key={`brand-${brand}`} className="selected-item">
              <span>
                <strong>NHÃN HIỆU:</strong> {brand}
              </span>
              <button
                className="remove-item-btn"
                onClick={() =>
                  setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                }
              >
                ✕
              </button>
            </div>
          ))}
          {selectedSizes.map((size) => (
            <div key={`size-${size}`} className="selected-item">
              <span>
                <strong>KÍCH THƯỚC:</strong> {size}
              </span>
              <button
                className="remove-item-btn"
                onClick={() =>
                  setSelectedSizes(selectedSizes.filter((s) => s !== size))
                }
              >
                ✕
              </button>
            </div>
          ))}
          {selectedColors.map((color) => (
            <div key={`color-${color}`} className="selected-item">
              <span>
                <strong>MÀU SẮC:</strong> {color}
              </span>
              <button
                className="remove-item-btn"
                onClick={() =>
                  setSelectedColors(selectedColors.filter((c) => c !== color))
                }
              >
                ✕
              </button>
            </div>
          ))}
          {selectedPrice && (
            <div className="selected-item">
              <span>
                <strong>GIÁ:</strong> {selectedPrice}
              </span>
              <button
                className="remove-item-btn"
                onClick={() => setSelectedPrice(null)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="filter-group">
        <button
          className="filter-header"
          onClick={() => toggleSection("brand")}
        >
          <span className="filter-title">THƯƠNG HIỆU</span>
          <span
            className={`filter-arrow ${expandedSections.brand ? "open" : ""}`}
          >
            ▼
          </span>
        </button>
        {expandedSections.brand && (
          <div className="filter-content">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm chọn tìm kiếm."
                className="filter-search"
              />
            </div>
            <ul className="filter-options">
              {brands.map((brand) => (
                <li key={brand.name} className="filter-item">
                  <label className="filter-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandChange(brand.name)}
                    />
                    <span className="filter-name">{brand.name}</span>
                  </label>
                  <span className="filter-count">{`(${brand.count})`}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="filter-group">
        <button className="filter-header" onClick={() => toggleSection("size")}>
          <span className="filter-title">KÍCH THƯỚC</span>
          <span
            className={`filter-arrow ${expandedSections.size ? "open" : ""}`}
          >
            ▼
          </span>
        </button>
        {expandedSections.size && (
          <div className="filter-content">
            <ul className="filter-options">
              {sizes.map((size) => (
                <li key={size.name} className="filter-item">
                  <label className="filter-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedSizes.includes(size.name)}
                      onChange={() => handleSizeChange(size.name)}
                    />
                    <span className="filter-name">{size.name}</span>
                  </label>
                  <span className="filter-count">{`(${size.count})`}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="filter-group">
        <button
          className="filter-header"
          onClick={() => toggleSection("color")}
        >
          <span className="filter-title">MÀU SẮC</span>
          <span
            className={`filter-arrow ${expandedSections.color ? "open" : ""}`}
          >
            ▼
          </span>
        </button>
        {expandedSections.color && (
          <div className="filter-content">
            <ul className="filter-options color-options">
              {colors.map((colorItem) => (
                <li key={colorItem.name} className="filter-item color-item">
                  <label className="filter-label color-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedColors.includes(colorItem.name)}
                      onChange={() => handleColorChange(colorItem.name)}
                    />
                    <span
                      className="color-swatch"
                      style={{
                        background: colorItem.color,
                      }}
                    ></span>
                    <span className="filter-name">{colorItem.name}</span>
                  </label>
                  <span className="filter-count">{`(${colorItem.count})`}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="filter-group">
        <button
          className="filter-header"
          onClick={() => toggleSection("price")}
        >
          <span className="filter-title">GIÁ</span>
          <span
            className={`filter-arrow ${expandedSections.price ? "open" : ""}`}
          >
            ▼
          </span>
        </button>
        {expandedSections.price && (
          <div className="filter-content">
            <div className="price-options">
              <label className="price-option">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) setPriceRange([0, 500000]);
                    if (e.target.checked) setSelectedPrice("Dưới 500.000đ");
                    else setSelectedPrice(null);
                  }}
                />
                <span>Dưới 500.000đ</span>
              </label>
              <label className="price-option">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) setPriceRange([500000, 1000000]);
                    if (e.target.checked)
                      setSelectedPrice("500.000đ - 1.000.000đ");
                    else setSelectedPrice(null);
                  }}
                />
                <span>500.000đ - 1.000.000đ</span>
              </label>
              <label className="price-option">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) setPriceRange([1000000, 5000000]);
                    if (e.target.checked) setSelectedPrice("Trên 1.000.000đ");
                    else setSelectedPrice(null);
                  }}
                />
                <span>Trên 1.000.000đ</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

Filter.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  priceRange: PropTypes.array.isRequired,
  setPriceRange: PropTypes.func.isRequired,
};
