import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';

import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Reticle from '@/components/reticle';
import Telemetry from '@/components/telemetry';
import ScrollReveal from '@/components/scroll-reveal';
import GridWave from '@/components/grid-wave';
import CommandPalette from '@/components/command-palette';
import { site } from '@/content/site';

import './globals.css';

/* Two voices: a wide grotesque that does display and body duty (body text is
   the same face, weighed light), and a mono for anything a machine produced.
   Self-hosted at build time by next/font — no CDN, no layout shift. */
const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    'Carly Tesnor',
    'software engineer',
    'React',
    'React Native',
    'Ruby on Rails',
    'Next.js',
    'portfolio',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    creator: site.twitterHandle,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0c10' },
    { media: '(prefers-color-scheme: light)', color: '#eef0ea' },
  ],
  colorScheme: 'dark light',
};

/* Runs before first paint so a remembered theme never flashes the other one.
   Also stamps the js flag the reveal system gates its hidden state behind —
   without it, every .rise element is simply visible. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}document.documentElement.classList.add('js')})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables must land on :root — globals.css builds --display
    // and --mono from them there, and custom properties only inherit
    // downward.
    <html
      lang="en"
      className={`${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (ColorZilla et al.)
          stamp attributes on <body> before React hydrates — that's their
          DOM, not a mismatch worth an error. */}
      <body suppressHydrationWarning>
        {/* Atmosphere: dormant grid floor, pointer-reactive wave, scanlines,
            grain, HUD brackets. */}
        <div className="grid-floor" aria-hidden="true" />
        <GridWave />
        <div className="scanlines" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <div className="hud" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <a href="#main" className="skip">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Telemetry />
        <Reticle />
        <CommandPalette />
        <ScrollReveal />
      </body>
    </html>
  );
}
