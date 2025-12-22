import styles from "../styles/Banner.module.css";
import TypingText from "./TypingText.jsx";

export default function Banner({ title, subtitle, stats, video }) {
  return (
    <section className={styles.banner}>
      <video className={styles.videoBackground} autoPlay loop muted playsInline>
        <source src={video} type="video/mp4" />
      </video>

      <div className={styles.overlay}></div>

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
