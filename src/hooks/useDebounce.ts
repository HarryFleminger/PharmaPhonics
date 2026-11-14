import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a rapidly changing value by `delayMs` milliseconds.
 * Used to apply a 400ms debounce before querying the OpenPrescribing API.
 */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
