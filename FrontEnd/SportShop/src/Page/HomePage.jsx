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
import useFetchAll from "../hooks/useFetchAll.js";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, loading } = useFetchAll(
    "/ProductVariant/grouped-products",
  );

  if (loading) {
    return <div>Đang tải...</div>;
  }

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
          delay: 35000,
          disableOnInteraction: false,
        }}
        speed={700}
        className="banner-swiper"
      >
        {bannerData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Banner
              title={slide.title}
              subtitle={slide.subtitle}
              stats={slide.stats}
              video={slide.video}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Category Section */}
      <Category title="Danh mục sản phẩm" path="/Category"/>

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

      <div className="banner-ads">
        <img src="/public/bannerADS.png" alt="" />
      </div>

      <div className="grid-products">
        {products.slice(0, 10).map((product) => {
          return (
            <CardProduct
              key={product.productID}
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
          );
        })}
      </div>
      <div className="view-more-button">
        <a href="/product">Xem tất cả</a>
      </div>

      <Category title="Thương hiệu nổi bật" path="/Brand"/>

      <Footer />
    </div>
  );
}
export default HomePage;
