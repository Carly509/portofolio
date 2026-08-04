'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { nav, site } from '@/content/site';
import { articles } from '@/content/writing';
import { kindLabels, projects } from '@/content/projects';
import { PALETTE_OPEN_EVENT } from '@/lib/palette';
import { toggleTheme } from '@/lib/theme';
import styles from './command-palette.module.css';

type Action = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: () => void;
};

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const actions = useMemo<Action[]>(() => {
    const go = (href: string) => () => router.push(href);

    return [
      // Home isn't in the nav any more (the CT. mark covers it), so it needs
      // an entry here or it becomes unreachable from the palette.
      { id: 'nav-home', label: 'Home', group: 'Go to', hint: '/', run: go('/') },
      ...nav
        .filter((item) => !('external' in item && item.external))
        .map((item) => ({
          id: `nav-${item.href}`,
          label: item.label,
          group: 'Go to',
          hint: item.href,
          run: go(item.href),
        })),

      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        label: p.title,
        group: 'Side Projects',
        hint: p.stack.slice(0, 2).join(' · '),
        run: go(`/work/${p.slug}`),
      })),

      ...(Object.keys(kindLabels) as (keyof typeof kindLabels)[]).map((kind) => ({
        id: `filter-${kind}`,
        label: `Filter — ${kindLabels[kind]}`,
        group: 'Side Projects',
        hint: `?type=${kind}`,
        run: go(`/work?type=${kind}`),
      })),

      ...articles.map((a) => ({
        id: `article-${a.slug}`,
        label: a.title,
        group: 'Writing',
        hint: a.readingTime,
        run: go(`/writing/${a.slug}`),
      })),

      {
        id: 'theme',
        label: 'Toggle ink / paper',
        group: 'Settings',
        hint: 'Theme',
        run: toggleTheme,
      },
      {
        id: 'copy-email',
        label: 'Copy email address',
        group: 'Contact',
        hint: site.email,
        run: () => navigator.clipboard?.writeText(site.email),
      },
      {
        id: 'email',
        label: 'Write an email',
        group: 'Contact',
        hint: site.email,
        run: () => {
          window.location.href = `mailto:${site.email}`;
        },
      },
      {
        id: 'resume',
        label: 'Open resumé',
        group: 'Contact',
        hint: 'PDF ↗',
        run: () => window.open(site.resume, '_blank', 'noopener,noreferrer'),
      },
      ...site.social.map((s) => ({
        id: `social-${s.name}`,
        label: s.name,
        group: 'Elsewhere',
        hint: '↗',
        run: () => window.open(s.href, '_blank', 'noopener,noreferrer'),
      })),
    ];
  }, [router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      `${a.label} ${a.group} ${a.hint ?? ''}`.toLowerCase().includes(q),
    );
  }, [actions, query]);

  // Reset on the transition itself rather than in an effect watching `open` —
  // an effect there would cost an extra render on every open and close.
  const show = useCallback(() => {
    setQuery('');
    setCursor(0);
    setOpen(true);
  }, []);

  const hide = useCallback(() => setOpen(false), []);

  // Open on ⌘K / Ctrl+K, and on the header button's event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => {
          if (!v) {
            setQuery('');
            setCursor(0);
          }
          return !v;
        });
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener(PALETTE_OPEN_EVENT, show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(PALETTE_OPEN_EVENT, show);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-on="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor, open]);

  if (!open) return null;

  const commit = (action: Action) => {
    hide();
    action.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      hide();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) =>
        results.length ? (c - 1 + results.length) % results.length : 0,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const action = results[cursor];
      if (action) commit(action);
    }
  };

  let lastGroup = '';

  return (
    <div
      className={styles.backdrop}
      onClick={hide}
      role="presentation"
    >
      {/* A terminal window: prompt, phosphor border, no rounded corners. */}
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className={styles.head}>
          <span className={styles.prompt} aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="query side projects, writing, coordinates…"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.esc}>esc</kbd>
        </div>

        {results.length === 0 ? (
          <p className={styles.empty}>
            Nothing matches “{query.trim()}”. Try a project name or a language.
          </p>
        ) : (
          <ul className={styles.list} ref={listRef}>
            {results.map((action, i) => {
              const showGroup = action.group !== lastGroup;
              lastGroup = action.group;

              return (
                <li key={action.id}>
                  {showGroup && (
                    <p className={`label ${styles.group}`}>{action.group}</p>
                  )}
                  <button
                    type="button"
                    className={styles.row}
                    data-on={i === cursor}
                    onMouseMove={() => setCursor(i)}
                    onClick={() => commit(action)}
                  >
                    <span className={styles.rowLabel}>{action.label}</span>
                    {action.hint && (
                      <span className={styles.rowHint}>{action.hint}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className={styles.foot}>
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span className={styles.footRight}>
            {results.length} of {actions.length}
          </span>
        </div>
      </div>
    </div>
  );
}
