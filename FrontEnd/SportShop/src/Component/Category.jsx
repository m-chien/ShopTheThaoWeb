import styles from "../styles/Category.module.css";
import { useEffect, useState } from "react";
import { getAllCategory } from "../Api/Category.js";

export default function Category() {
  const [Categories, setCategories] = useState([]);

  useEffect(() => {
      const fetchProducts = async () => {
        const res = await getAllCategory();
        setCategories(res.data);
      };
  
      fetchProducts();
    }, []);

  return (
    <section className={styles.setionCategory}>
      <div className={styles.Container}>
        <h1 className={styles.sectionHeading}>Danh mục sản phẩm</h1>
        <div className={styles.categoryGrid}>
          {Categories.map((category) => (
            <div key={category.id} className={styles.categoryItem}>
              <div className={styles.card}>
                <img src={`../../public/Category/${category.image}`} alt={category.name} />
                <a className={styles.nameproduct} href="#">
                  <p>{category.name}</p>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
