import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../Component/Breadcrumb";
import CardProduct from "../Component/CardProduct";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import useFetchAll from "../hooks/useFetchAll";
import { addToCart } from "../redux/slices/cartslice";
import styles from "../styles/DetailProduct.module.css";

export default function DetailProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: products, loading } = useFetchAll(
    `/ProductVariant/detail/${id}`,
    null,
  );
  console.log("🚀 ~ DetailProduct ~ products:", products);
  const navigate = useNavigate();

  useEffect(() => {
    if (products?.variants?.length > 0) {
      const firstVariant = products.variants[0];

      // set selectedColor as the full color object (not only id)
      const colorObj = products.colors?.find(
        (c) => c.colorID === firstVariant.colorID,
      );
      if (colorObj) setSelectedColor(colorObj);
      else setSelectedColor(null);

      // set selectedSize as the full size object
      const sizeObj = products.sizes?.find(
        (s) => s.sizeID === firstVariant.sizeID,
      );
      if (sizeObj) setSelectedSize(sizeObj);
      else setSelectedSize(null);

      setSelectedVariant(firstVariant);

      if (firstVariant.image) {
        setMainImage(firstVariant.image);
      } else if (products.images?.length > 0) {
        setMainImage(products.images[0]);
      }
    }
  }, [products]);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState(null);
  const availableSizes = selectedColor
    ? products?.variants
        ?.filter((v) => v.colorID === selectedColor.colorID)
        .map((v) => v.sizeID)
    : products?.sizes?.map((s) => s.sizeID);

  // Related products (unchanged)
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
    if (!selectedVariant || !selectedColor || !selectedSize) {
      alert("Vui lòng chọn màu và size");
      return;
    }

    dispatch(
      addToCart({
        variantId: selectedVariant.variantID,
        productId: products.productID,
        name: products.description,
        price: selectedVariant.price,
        image: selectedVariant.image,
        color: {
          id: selectedColor.colorID,
          name: selectedColor.colorName,
        },
        size: {
          id: selectedSize.sizeID,
          name: selectedSize.sizeName,
        },
        colorName: selectedColor?.colorName || "",
        sizeName: selectedSize?.sizeName || "",
        quantity,
        isSelected: false,
      }),
    );
  };
  const handleBuyNow = () => {
    if (!selectedVariant || !selectedColor || !selectedSize) {
      alert("Vui lòng chọn màu và size");
      return;
    }
    dispatch(
      addToCart({
        variantId: selectedVariant.variantID,
        productId: products.productID,
        name: products.description,
        price: selectedVariant.price,
        image: selectedVariant.image,
        color: {
          id: selectedColor.colorID,
          name: selectedColor.colorName,
        },
        size: {
          id: selectedSize.sizeID,
          name: selectedSize.sizeName,
        },
        colorName: selectedColor?.colorName || "",
        sizeName: selectedSize?.sizeName || "",
        quantity,
        isSelected: true,
      }),
    );
    navigate("/cart");
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
            { label: "Sản Phẩm", link: "/productList" },
            { label: "Giày nike", link: "/nike" },
          ]}
        />

        {/* Main Content */}
        <div className={styles["product-detail-content"]}>
          {/* Left: Images */}
          <div className={styles["product-images"]}>
            <div className={styles["main-image-container"]}>
              {mainImage && (
                <img
                  src={`/Product/${mainImage}`}
                  alt={products?.name}
                  className={styles["main-image"]}
                />
              )}
            </div>
            <div className={styles["thumbnail-images"]}>
              {products?.images?.map((item, index) => (
                <img
                  key={index}
                  src={`/Product/${item}`}
                  alt={`Thumbnail ${index}`}
                  className={`${styles.thumbnail} ${
                    mainImage === item ? styles.active : ""
                  }`}
                  onClick={() => setMainImage(item)}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className={styles["product-info"]}>
            {/* Brand & Title */}
            <div className={styles["product-header"]}>
              <span className={styles.brand}>{products?.brand}</span>
              <h1 className={styles["product-title"]}>
                {products?.description}
              </h1>
            </div>

            {/* SKU & Price */}
            <div className={styles["product-meta"]}>
              <div className={styles.sku}>
                <label>Loại Sản Phẩm:</label>
                <span>{products?.category}</span>
              </div>
              <div className={styles.sku}>
                <label>Mã Sản Phẩm:</label>
                <span>{products?.productID}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className={styles["price-section"]}>
              <div className={styles["rating-inline"]}>
                <div className={styles.stars}>
                  {"⭐".repeat(Math.floor(products?.rating ?? 4))}
                </div>
                <span className={styles["rating-text"]}>
                  {products?.reviewsCount ?? ""}
                </span>
              </div>
              <div className={styles["price-display"]}>
                <span className={styles["current-price"]}>
                  {selectedVariant?.price?.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className={styles["option-group"]}>
              <label className={styles["option-label"]}>
                Màu Sắc: {selectedColor?.colorName || "Chọn màu"}
              </label>
              <div className={styles["color-selector"]}>
                {products?.colors?.map((color) => (
                  <div
                    key={color.colorID}
                    className={`${styles["color-option"]} ${
                      selectedColor?.colorID === color.colorID
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => {
                      // set the whole color object
                      setSelectedColor(color);

                      const variant = products.variants.find(
                        (v) => v.colorID === color.colorID,
                      );

                      if (!variant) return;

                      // set corresponding size object
                      const sizeObj = products.sizes?.find(
                        (s) => s.sizeID === variant.sizeID,
                      );

                      setSelectedVariant(variant);
                      setSelectedSize(sizeObj || null);
                      setMainImage(variant.image);
                    }}
                  >
                    <div
                      className={styles["color-preview"]}
                      style={{ backgroundColor: color.colorCode }}
                    />
                    <span>{color.colorName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className={styles["option-group"]}>
              <label className={styles["option-label"]}>Kích Thước</label>
              <div className={styles["size-grid"]}>
                {products?.sizes?.map((size) => {
                  const isAvailable = availableSizes?.includes(size.sizeID);

                  return (
                    <button
                      key={size.sizeID}
                      disabled={!isAvailable}
                      className={`${styles["size-option"]} ${
                        selectedSize?.sizeID === size.sizeID
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => {
                        const variant = products.variants.find(
                          (v) =>
                            v.colorID === selectedColor?.colorID &&
                            v.sizeID === size.sizeID,
                        );

                        if (!variant) return;

                        setSelectedSize(size); // set full size object
                        setSelectedVariant(variant);
                        setMainImage(variant.image);
                      }}
                    >
                      {size.sizeName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div className={styles["features-list"]}>
              {products?.features?.map((feature, idx) => (
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
                onClick={handleBuyNow}
              >
                MUA NGAY
              </button>
              <button
                className={styles["add-to-wishlist-btn"]}
                onClick={handleAddToCart}
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>

            {/* Warranty & Stock */}
            <div className={styles["guarantee-section"]}>
              <div className={styles["guarantee-item"]}>
                <span className={styles["guarantee-icon"]}>🛡️</span>
                <span>{products?.warranty || "Bảo hành"}</span>
              </div>
              <div className={styles["guarantee-item"]}>
                <span className={styles["guarantee-icon"]}>📦</span>
                <span>Còn {selectedVariant?.stock} sản phẩm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className={styles["tabs-section"]}>
          <div className={styles["tabs-header"]}>
            <button
              className={`${styles["tab-button"]} ${
                activeTab === "description" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Mô Tả Sản Phẩm
            </button>
            <button
              className={`${styles["tab-button"]} ${
                activeTab === "specs" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("specs")}
            >
              Thông Số Kỹ Thuật
            </button>
            <button
              className={`${styles["tab-button"]} ${
                activeTab === "reviews" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh Giá ({products?.reviews || 0})
            </button>
            <button
              className={`${styles["tab-button"]} ${
                activeTab === "shipping" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("shipping")}
            >
              Vận Chuyển & Trả Hàng
            </button>
          </div>

          <div className={styles["tabs-content"]}>
            {activeTab === "description" && (
              <div className={styles["tab-pane"]}>
                <h2>Mô Tả Sản Phẩm</h2>
                <p>{products?.description}</p>
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
                      <td>{products?.brand}</td>
                    </tr>
                    <tr>
                      <td className="spec-label">Loại sản phẩm</td>
                      <td>{products?.category}</td>
                    </tr>
                    <tr>
                      <td className="spec-label">Màu sắc</td>
                      <td>{selectedColor?.colorName || ""}</td>
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
                      <td>{products?.productID}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className={styles["tab-pane"]}>
                <h2>Đánh Giá Sản Phẩm</h2>
                {/* reviews content */}
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
