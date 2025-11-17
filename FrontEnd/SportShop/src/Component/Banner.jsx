import styles from "../styles/Banner.module.css";
import TypingText from "./TypingText.jsx";

export default function Banner({ title, subtitle, stats, image }) {
  return (
    <section
      className={styles.banner}
      style={{
        backgroundImage: `
      linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
      url(${image})
    `,
      }}
    >
      <div className={styles.bannerContent}>
        <h1>
          <TypingText text={title} />
        </h1>
        <p>
          <TypingText text={subtitle} />
        </p>
        <div className={styles.bannerStats}>
          {stats.map((stat, index) => (
            <div className={styles.stat} key={index}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
