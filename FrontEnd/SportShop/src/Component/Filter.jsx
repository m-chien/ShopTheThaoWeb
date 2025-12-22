import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "../styles/Filter.css";
import useFetchAll from "../hooks/useFetchAll";

export default function Filter({ onFilterChange }) {
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);
  const [selectedColorIds, setSelectedColorIds] = useState([]);
  
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: 0 });
  const [selectedPriceLabel, setSelectedPriceLabel] = useState(null); 

  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    size: true,
    color: true,
    price: true,
  });

  const Brands = useFetchAll("/Brand", []);
  const Sizes = useFetchAll("/Size", []);
  const Colors = useFetchAll("/Color", []);

  useEffect(() => {
    const filterData = {
      brandIds: selectedBrandIds.length > 0 ? selectedBrandIds.join(",") : "",
      sizeIds: selectedSizeIds.length > 0 ? selectedSizeIds.join(",") : "",
      colorIds: selectedColorIds.length > 0 ? selectedColorIds.join(",") : "",
      minPrice: selectedPriceRange.min,
      maxPrice: selectedPriceRange.max,
      keyword: ""
    };

    // Gọi hàm callback để Component cha thực hiện gọi API
    if (onFilterChange) {
      onFilterChange(filterData);
    }
  }, [selectedBrandIds, selectedSizeIds, selectedColorIds, selectedPriceRange, onFilterChange]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // --- HANDLERS (Sử dụng ID) ---

  const handleBrandChange = (brandId) => {
    setSelectedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSizeIds((prev) =>
      prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const handleColorChange = (colorId) => {
    setSelectedColorIds((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handlePriceChange = (label, min, max, isChecked) => {
    if (isChecked) {
      setSelectedPriceRange({ min, max });
      setSelectedPriceLabel(label);
    } else {
      if (selectedPriceLabel === label) {
         setSelectedPriceRange({ min: 0, max: 0 });
         setSelectedPriceLabel(null);
      }
    }
  };

  const clearAll = () => {
    setSelectedBrandIds([]);
    setSelectedSizeIds([]);
    setSelectedColorIds([]);
    setSelectedPriceRange({ min: 0, max: 0 });
    setSelectedPriceLabel(null);
  };

  const getBrandName = (id) => Brands.data.find(b => b.id === id)?.name || id;
  const getSizeName = (id) => Sizes.data.find(s => s.id === id)?.name || id;
  const getColorName = (id) => Colors.data.find(c => c.id === id)?.name || id;

  return (
    <aside className="filter-sidebar">
      {/* Filter Header - Show selected items */}
      <div className="filter-group">
        <div className="filter-header-top">
          <span className="filter-title">LỌC THEO</span>
          <button className="clear-all-btn" onClick={clearAll}>
            XÓA TẤT CẢ
          </button>
        </div>

        <div className="filter-selected-items">
          {selectedBrandIds.map((id) => (
            <div key={`brand-${id}`} className="selected-item">
              <span><strong>NHÃN HIỆU:</strong> {getBrandName(id)}</span>
              <button
                className="remove-item-btn"
                onClick={() => handleBrandChange(id)}
              >✕</button>
            </div>
          ))}
          {selectedSizeIds.map((id) => (
            <div key={`size-${id}`} className="selected-item">
              <span><strong>KÍCH THƯỚC:</strong> {getSizeName(id)}</span>
              <button
                className="remove-item-btn"
                onClick={() => handleSizeChange(id)}
              >✕</button>
            </div>
          ))}
          {selectedColorIds.map((id) => (
            <div key={`color-${id}`} className="selected-item">
              <span><strong>MÀU SẮC:</strong> {getColorName(id)}</span>
              <button
                className="remove-item-btn"
                onClick={() => handleColorChange(id)}
              >✕</button>
            </div>
          ))}
          {selectedPriceLabel && (
            <div className="selected-item">
              <span><strong>GIÁ:</strong> {selectedPriceLabel}</span>
              <button
                className="remove-item-btn"
                onClick={() => {
                    setSelectedPriceRange({ min: 0, max: 0 });
                    setSelectedPriceLabel(null);
                }}
              >✕</button>
            </div>
          )}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="filter-group">
        <button className="filter-header" onClick={() => toggleSection("brand")}>
          <span className="filter-title">THƯƠNG HIỆU</span>
          <span className={`filter-arrow ${expandedSections.brand ? "open" : ""}`}>▼</span>
        </button>
        {expandedSections.brand && (
          <div className="filter-content">
            <ul className="filter-options">
              {Brands.data.map((brand) => (
                <li key={brand.id} className="filter-item">
                  <label className="filter-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedBrandIds.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                    />
                    <span className="filter-name">{brand.name}</span>
                  </label>
                  <span className="filter-count">{`(${brand.id})`}</span>
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
          <span className={`filter-arrow ${expandedSections.size ? "open" : ""}`}>▼</span>
        </button>
        {expandedSections.size && (
          <div className="filter-content">
            <ul className="filter-options">
              {Sizes.data.map((size) => (
                <li key={size.id} className="filter-item">
                  <label className="filter-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedSizeIds.includes(size.id)}
                      onChange={() => handleSizeChange(size.id)}
                    />
                    <span className="filter-name">{size.name}</span>
                  </label>
                  <span className="filter-count">{`(${size.id})`}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="filter-group">
        <button className="filter-header" onClick={() => toggleSection("color")}>
          <span className="filter-title">MÀU SẮC</span>
          <span className={`filter-arrow ${expandedSections.color ? "open" : ""}`}>▼</span>
        </button>
        {expandedSections.color && (
          <div className="filter-content">
            <ul className="filter-options filter-color-options">
              {Colors.data.map((colorItem) => (
                <li key={colorItem.id} className="filter-item color-item">
                  <label className="filter-label color-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedColorIds.includes(colorItem.id)}
                      onChange={() => handleColorChange(colorItem.id)}
                    />
                    <span
                      className="color-swatch"
                      style={{ background: colorItem.colorCode }}
                    ></span>
                    <span className="filter-name">{colorItem.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="filter-group">
        <button className="filter-header" onClick={() => toggleSection("price")}>
          <span className="filter-title">GIÁ</span>
          <span className={`filter-arrow ${expandedSections.price ? "open" : ""}`}>▼</span>
        </button>
        {expandedSections.price && (
          <div className="filter-content">
            <div className="price-options">
              <label className="price-option">
                <input
                  type="checkbox"
                  // Kiểm tra xem label hiện tại có khớp không để check
                  checked={selectedPriceLabel === "Dưới 500.000đ"}
                  onChange={(e) => handlePriceChange("Dưới 500.000đ", 0, 500000, e.target.checked)}
                />
                <span>Dưới 500.000đ</span>
              </label>
              <label className="price-option">
                <input
                  type="checkbox"
                  checked={selectedPriceLabel === "500.000đ - 1.000.000đ"}
                  onChange={(e) => handlePriceChange("500.000đ - 1.000.000đ", 500000, 1000000, e.target.checked)}
                />
                <span>500.000đ - 1.000.000đ</span>
              </label>
              <label className="price-option">
                <input
                  type="checkbox"
                  checked={selectedPriceLabel === "Trên 1.000.000đ"}
                  // maxPrice để số thật lớn
                  onChange={(e) => handlePriceChange("Trên 1.000.000đ", 1000000, 999999999, e.target.checked)}
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
  onFilterChange: PropTypes.func, // Thay thế các props cũ bằng hàm callback này
};