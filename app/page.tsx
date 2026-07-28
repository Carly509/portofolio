import Link from 'next/link';

// import Boot from '@/components/boot';
import Social from '@/components/social';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={`shell ${styles.page}`}>
      <section className={styles.hero}>
        {/* <Boot /> */}

        <p className={`label ${styles.eyebrow}`}>
          Software engineer · React &amp; Rails · <b>7 years</b>
        </p>

        {/* Two channels, converging into register. The thesis of the site. */}
        <h1 className={`glitch ${styles.name}`} data-cursor="Home">
          <span>Carly</span>
          <span>Tesnor</span>
        </h1>

        <ul className={styles.status}>
          <li>Stack — React · TS · Next · Rails · Node</li>
          <li>Mode — Full-stack engineer</li>
        </ul>

        <div className={styles.intro}>
          <p>
            Ever since I was young I&apos;ve been drawn to tech, and it led me
            to a career as a software engineer. For over seven years I&apos;ve
            spent my days — and often my nights — building{' '}
            <Link href="/work" className={styles.inline} data-cursor="See all">
              projects
            </Link>{' '}
            and writing lines of code, turning zeros and ones into things
            people can actually use.
          </p>
          <p>
            I have a deep love for manga and video games, but you&apos;ll also
            find me deep in{' '}
            <Link href="/writing" className={styles.inline} data-cursor="Read">
              something I&apos;m reading
            </Link>{' '}
            or swaying to whatever is playing too loudly.
          </p>
        </div>

        <div className={styles.elsewhere}>
          <p className="label">Find me</p>
          <Social />
        </div>
      </section>
    </div>
  );
}
