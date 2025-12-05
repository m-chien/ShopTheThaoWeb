import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Component/Breadcrumb";
import CardProduct from "../Component/CardProduct";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import styles from "../styles/DetailProduct.module.css";

export default function DetailProduct() {
  const navigate = useNavigate();
  // Sample product data
  const product = {
    id: 1,
    brand: "ADIDAS",
    name: "Giày Chạy Bộ Nam Adidas Adistar 3 Berlin - Xám",
    sku: "IG6173",
    price: 1750000,
    originalPrice: 3500000,
    discount: 50,
    category: "Giày chạy bộ",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    color: "Xám (Charcoal)",
    colorHex: "#555555",
    rating: 4.25,
    reviews: 125,
    reviewsCount: "4.2/5 (125)",
    stock: 85,
    description:
      "Giày chạy bộ chính hãng Adidas Adistar 3 Berlin với công nghệ Boost và Bounce để cung cấp đệm tuyệt vời và phục hồi nhanh.",
    sizes: [
      "UK 6.5",
      "UK 7",
      "UK 7.5",
      "UK 8",
      "UK 8.5",
      "UK 9",
      "UK 9.5",
      "UK 10",
      "UK 10.5",
      "UK 11",
      "UK 11.5",
      "UK 12",
    ],
    widths: [
      { name: "Ôm (Tight)", value: "snug" },
      { name: "Ôm Vừa (Slim)", value: "narrow" },
      { name: "Vừa Vặn (Regular)", value: "regular", selected: true },
      { name: "Rộng (Wide)", value: "wide" },
      { name: "Cực Rộng (X-Wide)", value: "xwide" },
    ],
    features: [
      "✏️ Hướng dẫn chọn kích thước",
      "🏪 Kiểm tra tồn kho tại cửa hàng",
    ],
    freeShipping: true,
    shippingDay: 30,
    warranty: "100% chính hãng",
    promotion: {
      title: "11.11 ADIDAS - SALE TUNG BỪNG",
      discountPercent: 60,
      startDate: "10.11",
      endDate: "14.11",
    },
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("UK 8.5");
  const [selectedWidth, setSelectedWidth] = useState("regular");
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState(product.image);

  // Related products
  const relatedProducts = [
    {
      id: 2,
      name: "Adidas Adistar 3 - Đỏ",
      price: 1750000,
      originalPrice: 3500000,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Adidas Adistar 3 - Đen",
      price: 1750000,
      originalPrice: 3500000,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Adidas Adistar 3 - Trắng",
      price: 1750000,
      originalPrice: 3500000,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&q=80",
    },
    {
      id: 5,
      name: "Adidas Adistar 3 - Xanh",
      price: 1750000,
      originalPrice: 3500000,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&q=80",
    },
  ];

  const handleAddToCart = () => {
    alert(
      `Đã thêm ${quantity} sản phẩm vào giỏ hàng!\nSize: ${selectedSize}, ${selectedWidth}`,
    );
    console.log({
      product: product.name,
      quantity,
      size: selectedSize,
      width: selectedWidth,
    });
    navigate("/information");
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 100) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 100) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className={styles["detail-product-page"]}>
      <Header />

      <div className={styles["detail-product-container"]}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Sản Phẩm", link: "/product" },
            { label: "Giày nike", link: "/nike" },
          ]}
        />

        {/* Main Content */}
        <div className={styles["product-detail-content"]}>
          {/* Left: Images */}
          <div className={styles["product-images"]}>
            <div className={styles["main-image-container"]}>
              <img
                src={mainImage}
                alt={product.name}
                className={styles["main-image"]}
              />
              <div className={styles["discount-badge"]}>
                {product.discount}%
              </div>
            </div>
            <div className={styles["thumbnail-images"]}>
              <img
                src={product.image}
                alt="Thumbnail 1"
                className={styles.thumbnail}
                onClick={() => setMainImage(product.image)}
              />
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&q=80"
                alt="Thumbnail 2"
                className={styles.thumbnail}
                onClick={() =>
                  setMainImage(
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&q=80",
                  )
                }
              />
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&q=80"
                alt="Thumbnail 3"
                className={styles.thumbnail}
                onClick={() =>
                  setMainImage(
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&q=80",
                  )
                }
              />
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&q=80"
                alt="Thumbnail 4"
                className={styles.thumbnail}
                onClick={() =>
                  setMainImage(
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&q=80",
                  )
                }
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className={styles["product-info"]}>
            {/* Brand & Title */}
            <div className={styles["product-header"]}>
              <span className={styles.brand}>{product.brand}</span>
              <h1 className={styles["product-title"]}>{product.name}</h1>
            </div>

            {/* SKU & Price */}
            <div className={styles["product-meta"]}>
              <div className={styles.sku}>
                <label>Loại Sản Phẩm:</label>
                <span>{product.category}</span>
              </div>
              <div className={styles.sku}>
                <label>SKU:</label>
                <span>{product.sku}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className={styles["price-section"]}>
              <div className={styles["rating-inline"]}>
                <div className={styles.stars}>
                  {"⭐".repeat(Math.floor(product.rating))}
                  {product.rating % 1 !== 0 && "⭐"}
                </div>
                <span className={styles["rating-text"]}>
                  {product.reviewsCount}
                </span>
              </div>
              <div className={styles["price-display"]}>
                <span className={styles["current-price"]}>
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
                <span className={styles["original-price"]}>
                  {product.originalPrice.toLocaleString("vi-VN")}₫
                </span>
                <span className={styles["discount-percent"]}>
                  -{product.discount}%
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className={styles["option-group"]}>
              <label className={styles["option-label"]}>
                Màu Sắc: {product.color}
              </label>
              <div className={styles["color-selector"]}>
                <div className={`${styles["color-option"]} ${styles.selected}`}>
                  <div
                    className={styles["color-preview"]}
                    style={{ backgroundColor: product.colorHex }}
                  ></div>
                  <span className={styles["color-name"]}>{product.color}</span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className={styles["option-group"]}>
              <label className={styles["option-label"]}>Kích Thước</label>
              <div className={styles["size-grid"]}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles["size-option"]} ${selectedSize === size ? styles.selected : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Width Selection */}
            <div className={styles["option-group"]}>
              <label className={styles["option-label"]}>Fit (Độ rộng)</label>
              <div className={styles["width-selector"]}>
                {product.widths.map((width) => (
                  <button
                    key={width.value}
                    className={`${styles["width-option"]} ${selectedWidth === width.value ? styles.selected : ""}`}
                    onClick={() => setSelectedWidth(width.value)}
                  >
                    {width.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className={styles["features-list"]}>
              {product.features.map((feature, idx) => (
                <div key={idx} className={styles["feature-item"]}>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Quantity & Actions */}
            <div className={styles["action-section"]}>
              <div className={styles["quantity-selector"]}>
                <label>Số lượng</label>
                <div className={styles["quantity-controls"]}>
                  <button
                    className={styles["qty-btn"]}
                    onClick={decrementQuantity}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className={styles["qty-input"]}
                  />
                  <button
                    className={styles["qty-btn"]}
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className={styles["add-to-cart-btn"]}
                onClick={handleAddToCart}
              >
                MUA NGAY
              </button>
              <button className={styles["add-to-wishlist-btn"]}>
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>

            {/* Warranty & Stock */}
            <div className={styles["guarantee-section"]}>
              <div className={styles["guarantee-item"]}>
                <span className={styles["guarantee-icon"]}>🛡️</span>
                <span>{product.warranty}</span>
              </div>
              <div className={styles["guarantee-item"]}>
                <span className={styles["guarantee-icon"]}>📦</span>
                <span>Còn {product.stock} sản phẩm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className={styles["tabs-section"]}>
          <div className={styles["tabs-header"]}>
            <button
              className={`${styles["tab-button"]} ${activeTab === "description" ? styles.active : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Mô Tả Sản Phẩm
            </button>
            <button
              className={`${styles["tab-button"]} ${activeTab === "specs" ? styles.active : ""}`}
              onClick={() => setActiveTab("specs")}
            >
              Thông Số Kỹ Thuật
            </button>
            <button
              className={`${styles["tab-button"]} ${activeTab === "reviews" ? styles.active : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh Giá ({product.reviews})
            </button>
            <button
              className={`${styles["tab-button"]} ${activeTab === "shipping" ? styles.active : ""}`}
              onClick={() => setActiveTab("shipping")}
            >
              Vận Chuyển & Trả Hàng
            </button>
          </div>

          <div className={styles["tabs-content"]}>
            {activeTab === "description" && (
              <div className={styles["tab-pane"]}>
                <h2>Mô Tả Sản Phẩm</h2>
                <p>{product.description}</p>
                <h3>Đặc Điểm Nổi Bật</h3>
                <ul>
                  <li>Công nghệ Zoom Air Turbo cung cấp đệm đảo ngược</li>
                  <li>Thiết kế nhẹ và thoáng khí</li>
                  <li>Đế ngoài bền bỉ với độ bám tốt</li>
                  <li>Phù hợp cho chạy bộ hàng ngày</li>
                  <li>Hỗ trợ phục hồi nhanh</li>
                </ul>
              </div>
            )}

            {activeTab === "specs" && (
              <div className={styles["tab-pane"]}>
                <h2>Thông Số Kỹ Thuật</h2>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td className="spec-label">Thương hiệu</td>
                      <td>{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="spec-label">Loại sản phẩm</td>
                      <td>{product.category}</td>
                    </tr>
                    <tr>
                      <td className="spec-label">Màu sắc</td>
                      <td>{product.color}</td>
                    </tr>
                    <tr>
                      <td className="spec-label">Chất liệu</td>
                      <td>Vải tổng hợp, Mesh</td>
                    </tr>
                    <tr>
                      <td className="spec-label">Đệm giày</td>
                      <td>Zoom Air Turbo</td>
                    </tr>
                    <tr>
                      <td className="spec-label">Trọng lượng</td>
                      <td>~195g (size US 9)</td>
                    </tr>
                    <tr>
                      <td className="spec-label">SKU</td>
                      <td>{product.sku}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className={styles["tab-pane"]}>
                <h2>Đánh Giá Sản Phẩm</h2>
                <div className={styles["reviews-summary"]}>
                  <div className={styles["rating-score"]}>
                    <span className={styles.score}>{product.rating}</span>
                    <span className={styles["out-of"]}>/5</span>
                  </div>
                  <div className={styles["rating-bars"]}>
                    <div className={styles["rating-bar"]}>
                      <span className={styles["bar-label"]}>⭐⭐⭐⭐⭐</span>
                      <div className={styles.progress}>
                        <div
                          className={styles["progress-fill"]}
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                      <span className={styles["bar-count"]}>120</span>
                    </div>
                    <div className={styles["rating-bar"]}>
                      <span className={styles["bar-label"]}>⭐⭐⭐⭐</span>
                      <div className={styles.progress}>
                        <div
                          className={styles["progress-fill"]}
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                      <span className={styles["bar-count"]}>60</span>
                    </div>
                    <div className={styles["rating-bar"]}>
                      <span className={styles["bar-label"]}>⭐⭐⭐</span>
                      <div className={styles.progress}>
                        <div
                          className={styles["progress-fill"]}
                          style={{ width: "10%" }}
                        ></div>
                      </div>
                      <span className={styles["bar-count"]}>45</span>
                    </div>
                  </div>
                </div>
                <button className={`${styles["write-review-btn"]}`}>
                  Viết đánh giá của bạn
                </button>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className={styles["tab-pane"]}>
                <h2>Vận Chuyển & Trả Hàng</h2>
                <div className="shipping-info">
                  <h3>🚚 Vận Chuyển</h3>
                  <p>Miễn phí vận chuyển cho đơn hàng từ 699.000₫</p>
                  <p>Thời gian giao hàng: Từ 3-5 ngày làm việc</p>

                  <h3>🔄 Chính Sách Trả Hàng</h3>
                  <p>Hoàn tiền trong 30 ngày nếu không hài lòng</p>
                  <p>Sản phẩm phải nguyên bản, không qua sử dụng</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className={styles["related-products-section"]}>
          <h2>Sản Phẩm Liên Quan</h2>
          <div className={styles["related-products-grid"]}>
            {relatedProducts.map((relProduct) => (
              <CardProduct
                key={relProduct.id}
                product={relProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
