import { useEffect, useState } from "react";
import { getAllProduct } from "../Api/Product.js";
import Breadcrumb from "../Component/Breadcrumb";
import CardProduct from "../Component/CardProduct";
import Filter from "../Component/Filter";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import styles from "../styles/ProductListPage.module.css";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProduct();
      setProducts(res.data);
    };

    fetchProducts();
  }, []);
  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <Header />
        <Breadcrumb type="Sản Phẩm" />
        <div className={styles.mainContent}>
          {/* Filter Component */}
          <Filter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          {/* Products Section */}
          <section className={styles.featuredProducts}>
            <div className={styles.productsHeader}>
              <h2>Danh sách sản phẩm</h2>
              <p className={styles.productCount}>{products.length} Sản phẩm</p>
            </div>
            <div className={styles.productsGrid}>
              {products.map((product) => {
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
                      // Lấy giá thấp nhất để hiển thị
                      minPrice: Math.min(...product.prices),
                      maxPrice: Math.max(...product.prices),
                    }}
                    onAddToCart={handleAddToCart}
                  />
                );
              })}
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}
