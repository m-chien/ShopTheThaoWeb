import { categories } from "./Categories";
import styles from "../styles/Category.module.css";

export default function Category() {
  return (
    <section className={styles.setionCategory}>
      <div className={styles.Container}>
        <h2 className={styles.sectionHeading}>Danh mục sản phẩm</h2>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryItem}>
              <div className={styles.card}>
                <img src={category.image} alt={category.name} />
                <a className={styles.nameproduct} href="#"><p>{category.name}</p></a>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
