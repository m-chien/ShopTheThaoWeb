import PropTypes from "prop-types";
import React from "react";
import "../styles/CardProduct.css";
import { useNavigate } from "react-router-dom";

export default function CardProduct({ product, onAddToCart }) {
  const navigate = useNavigate();
  return (
    <div className="product-card" onClick={() => navigate("/detail-product")}>
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} />
        {product.badge && (
          <div className={`badge badge-${product.badge.toLowerCase()}`}>
            {product.badge}
          </div>
        )}
        {product.discount > 0 && (
          <div className="discount-badge">-{product.discount}%</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          <span className="price">
            {product.price.toLocaleString("vi-VN")} đ
          </span>
          {product.originalPrice && (
            <span className="original-price">
              {product.originalPrice.toLocaleString("vi-VN")} đ
            </span>
          )}
        </div>
        <div className="product-rating">
          <span className="stars">⭐</span>
          <span className="rating-value">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart && onAddToCart(product)}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}

CardProduct.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func,
};
