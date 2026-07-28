import { site } from '@/content/site';
import styles from './social.module.css';

/* Inline glyphs rather than an icon package — four icons is not worth a
 * dependency, and these inherit currentColor so they theme for free. */
const glyphs: Record<string, React.ReactNode> = {
  GitHub: (
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.6v-2c-3.2.7-3.8-1.4-3.8-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C19.7 4.8 20.7 5 20.7 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.8-5.8 7.8-10.8C23.5 5.7 18.3.5 12 .5z" />
  ),
  LinkedIn: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.5 4.78 5.9V21h-4v-5.7c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V21h-4z" />
  ),
  Twitter: (
    <path d="M18.9 2H22l-7 8 7.6 12h-6.3l-4.9-7.4L5.7 22H2.6l7.3-8.4L2.6 2h6.4l4.6 7zM17.7 20h1.7L7.1 3.8H5.3z" />
  ),
  Instagram: (
    <>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .5 1.5 1 .5.5.8.9 1 1.5.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.2 1-.4 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1 .04-1.5.2-1.9.35-.4.15-.7.33-1 .63-.3.3-.5.6-.63 1-.14.4-.3.9-.35 1.9C3.4 8.5 3.4 8.9 3.4 12s0 3.5.07 4.7c.04 1 .2 1.5.35 1.9.15.4.33.7.63 1 .3.3.6.5 1 .63.4.14.9.3 1.9.35 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1-.04 1.5-.2 1.9-.35.4-.15.7-.33 1-.63.3-.3.5-.6.63-1 .14-.4.3-.9.35-1.9.07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.04-1-.2-1.5-.35-1.9a2.7 2.7 0 0 0-.63-1c-.3-.3-.6-.5-1-.63-.4-.14-.9-.3-1.9-.35C15.5 4 15.1 4 12 4z" />
      <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
      <circle cx="17.2" cy="6.8" r="1.2" />
    </>
  ),
};

export default function Social({ className = '' }: { className?: string }) {
  return (
    <ul className={`${styles.row} ${className}`}>
      {site.social.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            data-cursor={`${s.name} ↗`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              {glyphs[s.name]}
            </svg>
            <span className={styles.srOnly}>{s.name}</span>
          </a>
        </li>
      ))}
      <li>
        <a
          href={`mailto:${site.email}`}
          className={styles.link}
          data-cursor="Write to me"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13A1.5 1.5 0 0 1 20.5 20h-17A1.5 1.5 0 0 1 2 18.5zm2.2.5L12 12.2 19.8 6zM20 8.1l-7.4 5.9a1 1 0 0 1-1.2 0L4 8.1V18h16z" />
          </svg>
          <span className={styles.srOnly}>Email</span>
        </a>
      </li>
    </ul>
  );
}
