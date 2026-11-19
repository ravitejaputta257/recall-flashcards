import { useEffect, useState } from "react";

// <T> means "whatever type the caller passes in".
// callers write useLocalStorage<Card[]>(...) or useLocalStorage<Theme>(...).
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : (JSON.parse(stored) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private mode. The app still works in memory.
    }
  }, [key, value]);

  // `as const` keeps this a fixed two-item tuple: [value, setValue].
  return [value, setValue] as const;
}
