import { useEffect, useState } from 'react';

export function useDarkMode() {
  // Initialize theme state based on localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference === 'dark' || storedPreference === 'light') {
      return storedPreference;
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  });

  // Effect to add or remove the 'dark' class and sync with localStorage
  useEffect(() => {
      const className = 'dark';
      const bodyClass = window.document.documentElement.classList;

      if (theme === 'dark') {
        bodyClass.add(className);
      } else {
        bodyClass.remove(className);
      }

      localStorage.setItem('darkMode', theme);
  }, [theme]);

  // Toggle function to switch between dark and light modes
  const toggleDarkMode = () =>
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));

  return {theme, toggleDarkMode};
}
