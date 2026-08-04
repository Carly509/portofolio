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

      </div>
    </footer>
  );
}
