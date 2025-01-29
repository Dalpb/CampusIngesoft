// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
      const root = document.documentElement; // Selecciona el elemento <html>
      if (isDarkMode) {
          root.classList.add("dark");
          localStorage.setItem("theme", "dark");
      } else {
          root.classList.remove("dark");
          localStorage.setItem("theme", "light");
      }
  }, [isDarkMode]);

  useEffect(() => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
          setIsDarkMode(true);
      }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
