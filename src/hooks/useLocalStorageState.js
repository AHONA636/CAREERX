import { useCallback, useState } from 'react';

const PREFIX = 'careerx:';

export function useLocalStorageState(key, initialValue) {
  const storageKey = PREFIX + key;

  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setAndPersist = useCallback((updater) => {
    setValue((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Storage unavailable or quota exceeded — state still updates in memory.
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return [value, setAndPersist];
}

// Clears every CareerX key — used on logout so each session starts fresh.
export function clearAllLocalStorageState() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Storage unavailable — nothing to clear.
  }
}
