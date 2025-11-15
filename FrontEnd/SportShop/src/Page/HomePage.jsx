import { useEffect, useState } from "react";
import Header from "../Component/Header.jsx";
import "../styles/HomePage.css";
import { Scrollbar, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAllProduct } from "../Api/Product.js";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import CardProduct from "../Component/CardProduct.jsx";
import Category from "../Component/Category.jsx";
import Footer from "../Component/Footer.jsx";
import TypingText from "../Component/TypingText.jsx";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProduct();
        setProducts(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi fetch sản phẩm:", error);
        // Có thể set một state để hiển thị thông báo lỗi cho người dùng
        // setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Banner chính */}
      <section className="banner">
        <div className="banner-content">
          <h1>
            <TypingText text="Đồ thể thao chất lượng cao" />
          </h1>
          <p>
            <TypingText text="Nơi đam mê thể thao trở thành hiện thực" />
          </p>
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

      <Category />
      <div className="NewProduct">
        <h2 className="NewProductName">Hàng mới về</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          navigation
          modules={[Scrollbar, Navigation]}
          scrollbar={{ draggable: true }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.productID}>
              <CardProduct
                product={{
                  id: product.productID,
                  name: product.name,
                  description: product.description,
                  colors: product.colors,
                  images: product.images,
                  prices: product.prices,
                  minPrice: Math.min(...product.prices),
                  maxPrice: Math.max(...product.prices),
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
