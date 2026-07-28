import styles from "./Hero.module.css";

export function Hero({ children, title }) {
  return (
    <section className={styles.hero}>
      <h1>{title}</h1>
      <div>{children}</div>
    </section>
  );
}
