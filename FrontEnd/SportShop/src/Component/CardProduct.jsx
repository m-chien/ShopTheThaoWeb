import PropTypes from "prop-types";
import React, { useState } from "react";
import "../styles/CardProduct.css";
import { useNavigate } from "react-router-dom";

export default function CardProduct({ product, onAddToCart }) {
  const navigate = useNavigate();
  
  // Safety checks
  const images = product.images || [];
  const colors = product.colors || [];
  const prices = product.prices || [];
  
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(images[0] || "");

  const handleColorChange = (index) => {
    setSelectedColorIndex(index);
    // Đổi ảnh theo màu (giả sử images và colors có cùng thứ tự)
    if (images[index]) {
      setSelectedImage(images[index]);
    }
  };

  const handleCardClick = (e) => {
    // Không navigate nếu click vào button hoặc color selector hoặc thumbnails
    if (
      e.target.tagName === "BUTTON" || 
      e.target.closest(".color-selector") ||
      e.target.closest(".image-thumbnails")
    ) {
      return;
    }
    navigate("/detail-product");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        ...product,
        selectedColor: colors[selectedColorIndex],
        selectedImage: selectedImage,
        selectedPrice: prices[selectedColorIndex],
      });
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-wrapper">
        <img 
          src={selectedImage ? `/${selectedImage}` : "/placeholder.png"} 
          alt={product.name} 
        />
        
        {/* Thumbnails ảnh - chỉ hiển thị nếu có nhiều hơn 1 ảnh */}
        {images.length > 1 && (
          <div className="image-thumbnails">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`/${img}`}
                alt=""
                className={selectedImage === img ? "active" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(img);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>

        {/* Hiển thị giá */}
        <div className="product-price">
          {prices.length > 1 ? (
            <span className="price">
              {Math.min(...prices).toLocaleString("vi-VN")} đ -{" "}
              {Math.max(...prices).toLocaleString("vi-VN")} đ
            </span>
          ) : prices.length === 1 ? (
            <span className="price">
              {prices[0].toLocaleString("vi-VN")} đ
            </span>
          ) : (
            <span className="price">Liên hệ</span>
          )}
        </div>

        {/* Color selector - chỉ hiển thị nếu có màu */}
        {colors.length > 0 && (
          <div className="color-selector">
            <label>Màu sắc:</label>
            <div className="color-options">
              {colors.map((color, idx) => (
                <div
                  key={color.colorID}
                  className={`color-option ${
                    selectedColorIndex === idx ? "selected" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorChange(idx);
                  }}
                  title={color.colorName}
                >
                  <span>{color.colorName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}

CardProduct.propTypes = {
  product: PropTypes.shape({
    productID: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    prices: PropTypes.arrayOf(PropTypes.number),
    colors: PropTypes.arrayOf(
      PropTypes.shape({
        colorID: PropTypes.number.isRequired,
        colorName: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onAddToCart: PropTypes.func,
};