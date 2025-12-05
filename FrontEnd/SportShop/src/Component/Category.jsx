import { use, useEffect, useState } from "react";
import { getAllCategory } from "../Api/Category.js";
import useFetchAll from "../hooks/useFetchAll.js";
import styles from "../styles/Category.module.css";

export default function Category({ title, path }) {
  const { data: Categories, loading } = useFetchAll(path);
  console.log("🚀 ~ Category ~ Categories:", Categories);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <section className={styles.setionCategory}>
      <div className={styles.Container}>
        <h1 className={styles.sectionHeading}>{title}</h1>
        <div className={styles.categoryGrid}>
          {Categories.map((category) => (
            <div key={category.id} className={styles.categoryItem}>
              <div className={styles.card}>
                <img
                  src={`../../public/${path}/${category.logo || category.image}`}
                  alt={category.name}
                />
                {path === "/Category" ? (
                  <a className={styles.nameproduct} href="#">
                    <p>{category.name}</p>
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
