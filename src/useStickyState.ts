import { useEffect, useState } from "react";

export default function useStickyState<T>(defaultValue: T, key: string): [
  value: T,
  setValue: React.Dispatch<React.SetStateAction<T>>,
] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    if (stickyValue === null) return defaultValue;
    try {
      return JSON.parse(stickyValue) as T;
    } catch(e) {
      console.error(e);
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}