import { useEffect, useState } from "react";

// Tiny hook to sync state to window.localStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.error("Error reading localStorage", err);
      return initialValue;
    }
  });

  // Whenever the value changes, write it back to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Error writing to localStorage", err);
    }
  }, [key, value]);

  return [value, setValue];
}
