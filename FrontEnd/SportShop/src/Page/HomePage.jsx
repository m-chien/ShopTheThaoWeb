import { useEffect, useState } from "react";
import Header from "../Component/Header.jsx";
import "../styles/HomePage.css";
import { Autoplay, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAllProduct } from "../Api/Product.js";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import bannerData from "../Api/BannerData.js";
import Banner from "../Component/Banner.jsx";
import CardProduct from "../Component/CardProduct.jsx";
import Category from "../Component/Category.jsx";
import Footer from "../Component/Footer.jsx";

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
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Banner chính */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        className="banner-swiper"
      >
        {bannerData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Banner
              title={slide.title}
              subtitle={slide.subtitle}
              stats={slide.stats}
              image={slide.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Category Section */}
      <Category />

      {/* New Products Section */}
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

      {/* New Products Section */}
      <div className="NewProduct">
        <h2 className="NewProductName">Sản phẩm nổi bật được đánh giá cao</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          navigation
          modules={[Scrollbar, Navigation]}
          scrollbar={{ draggable: true }}
        >
          {products.map((product) =>
            product.productID > 10 ? (
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
            ) : null,
          )}
        </Swiper>
      </div>
      <Footer />
    </div>
  );
}
export default HomePage;
