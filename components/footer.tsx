import { site } from '@/content/site';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <div>
          <p className={styles.sign}>
            End of
            <br />
            transmission<b>.</b>
          </p>
          <p className={styles.note}>
            © {new Date().getFullYear()} {site.name} · Set in Archivo &amp;
            JetBrains Mono
          </p>
        </div>

        <nav className={styles.social} aria-label="Elsewhere">
          {site.social.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              data-cursor="Visit"
            >
              {s.name} ↗
            </a>
          ))}
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            data-cursor="Resumé ↗"
          >
            Resumé ↗
          </a>
          <a
            href={`mailto:${site.email}`}
            className={styles.link}
            data-cursor="Write"
          >
            {site.email}
          </a>
        </nav>
      </div>
    </footer>
  );
}
