import { useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { lightTokens, darkTokens, injectTokens } from './tokens';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('greenshield_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    localStorage.setItem('greenshield_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      injectTokens(darkTokens);
    } else {
      document.documentElement.classList.remove('dark');
      injectTokens(lightTokens);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
