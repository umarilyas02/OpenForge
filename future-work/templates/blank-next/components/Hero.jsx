import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={`${styles.hero} px-[var(--space-page)]`}>
      <p className={styles.eyebrow}>Portable by design</p>
      <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
        Build visually. Keep the source.
      </h1>
      <p className={styles.summary}>
        This project is ordinary JavaScript, JSX, Tailwind CSS, and CSS Modules.
        It runs without OpenForge.
      </p>
      <a
        className={styles.action}
        href="https://github.com/umarilyas02/OpenForge"
      >
        Explore OpenForge
      </a>
    </section>
  );
}
