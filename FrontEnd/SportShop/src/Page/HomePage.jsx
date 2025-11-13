import { useEffect, useState } from "react";
import Filter from "../Component/Filter.jsx";
import Header from "../Component/Header.jsx";
import "../styles/HomePage.css";
import image from "../assets/bannerImage.jpg";
import CardProduct from "../Component/CardProduct.jsx";
import Footer from "../Component/Footer.jsx";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Dữ liệu mẫu cho sản phẩm với thêm thông tin
    const sampleProducts = [
      {
        id: 1,
        name: "Dri-FIT Sport T-shirt",
        price: 650000,
        originalPrice: 950000,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=350&fit=crop",
        discount: 24,
        category: "Apparel",
        badge: "New",
        description: "Advanced moisture-wicking technology",
        rating: 4.8,
        reviews: 245,
      },
      {
        id: 2,
        name: "Ultraboost Sneakers",
        price: 2800000,
        originalPrice: 3600000,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=350&fit=crop",
        discount: 22,
        category: "Shoes",
        badge: "New",
        description: "Responsive Boost cushioning for comfort",
        rating: 4.9,
        reviews: 532,
      },
      {
        id: 3,
        name: "Premium Yoga Mat",
        price: 750000,
        originalPrice: 950000,
        image:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=350&fit=crop",
        discount: 21,
        category: "Accessories",
        badge: "New",
        description: "Non-slip, 6mm thick, eco-friendly material",
        rating: 4.7,
        reviews: 189,
      },
      {
        id: 4,
        name: "Pro Running Shoes",
        price: 1200000,
        originalPrice: 1500000,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=350&fit=crop",
        discount: 20,
        category: "Shoes",
        description: "Lightweight and responsive",
        rating: 4.8,
        reviews: 412,
      },
      {
        id: 5,
        name: "Training Sports Top",
        price: 450000,
        originalPrice: 650000,
        image:
          "https://images.unsplash.com/photo-1518611505868-48510c8e0b3e?w=300&h=350&fit=crop",
        discount: 30,
        category: "Apparel",
        badge: "Sale",
        description: "Breathable athletic performance wear",
        rating: 4.6,
        reviews: 298,
      },
      {
        id: 6,
        name: "Sports Water Bottle",
        price: 150000,
        originalPrice: 200000,
        image:
          "https://images.unsplash.com/photo-1602143407151-7e406dc6ffee?w=300&h=350&fit=crop",
        discount: 25,
        category: "Accessories",
        description: "Insulated, leak-proof design",
        rating: 4.7,
        reviews: 156,
      },
      {
        id: 7,
        name: "Basketball Shoes",
        price: 1800000,
        originalPrice: 2200000,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=350&fit=crop",
        discount: 18,
        category: "Shoes",
        description: "Premium ankle support and cushioning",
        rating: 4.9,
        reviews: 378,
      },
      {
        id: 8,
        name: "Gym Bag",
        price: 580000,
        originalPrice: 800000,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=350&fit=crop",
        discount: 27,
        category: "Accessories",
        description: "Spacious with multiple compartments",
        rating: 4.8,
        reviews: 267,
      },
      {
        id: 9,
        name: "Compression Shorts",
        price: 320000,
        originalPrice: 450000,
        image:
          "https://images.unsplash.com/photo-1506629082632-daf0f3a3c1b5?w=300&h=350&fit=crop",
        discount: 28,
        category: "Apparel",
        description: "High-performance compression fit",
        rating: 4.7,
        reviews: 201,
      },
    ];
    setProducts(sampleProducts);
  }, []);

  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Filter products based on category, price, and search
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchPrice && matchSearch;
  });

  return (
    <div className="home-page">
      {/* Header */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Banner chính */}
      <section className="banner">
        <div className="banner-content">
          <h1>Đồ thể thao chất lượng cao</h1>
          <p>Nơi đam mê thể thao trở thành hiện thực</p>
          <div className="banner-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Sản phẩm</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Chính hãng</span>
            </div>
            <div className="stat">
              <span className="stat-number">Free</span>
              <span className="stat-label">Miễn phí vận chuyển</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        {/* Filter Component */}
        <Filter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        {/* Products Section */}
        <section className="featured-products">
          <div className="products-header">
            <h2>Danh sách sản phẩm</h2>
            <p className="product-count">{filteredProducts.length} Sản phẩm</p>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <CardProduct
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
