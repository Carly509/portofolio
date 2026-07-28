'use client';

import { useCallback, useSyncExternalStore } from 'react';

/* Reads a media query as a subscription rather than as state set from an
 * effect, so a change in pointer type or motion preference is picked up
 * mid-session without a cascading render. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false, // the server has no pointer and no preference
  );
}
