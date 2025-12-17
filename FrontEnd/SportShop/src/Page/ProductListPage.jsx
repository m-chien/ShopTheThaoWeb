import { useCallback, useState } from "react";
// Nhớ import hàm filterProducts vừa tạo ở Bước 1
import { filterProducts } from "../Api/Product.js";
import Breadcrumb from "../Component/Breadcrumb";
import CardProduct from "../Component/CardProduct";
import Filter from "../Component/Filter";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import styles from "../styles/ProductListPage.module.css";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFilterChange = useCallback(async (filterData) => {
    try {
      setIsLoading(true);
      const res = await filterProducts(filterData);
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <div className={styles.pageContainer}>
        <Header />
        <Breadcrumb items={[{ label: "Sản Phẩm", link: "/product" }]} />
        <div className={styles.mainContent}>
          <Filter onFilterChange={handleFilterChange} />
          <section className={styles.featuredProducts}>
            <div className={styles.productsHeader}>
              <h2>Danh sách sản phẩm</h2>
              <p className={styles.productCount}>
                {products.length || 0} Sản phẩm
              </p>
            </div>

            {isLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Đang tải...
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {products.length > 0 ? (
                  products.map((product) => {
                    return (
                      <CardProduct
                        key={product.productVariantID}
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
                  })
                ) : (
                  <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                )}
              </div>
            )}
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}
