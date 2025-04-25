import React, { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

const lightTheme = {
  background: "#ffffff",
  text: "#000000",
  card: "#f1f1f1",
};

const darkTheme = {
  background: "#121212",
  text: "#ffffff",
  card: "#1e1e1e",
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("darkTheme");
      if (storedTheme !== null) {
        setIsDark(JSON.parse(storedTheme));
      } else {
        const systemPref = Appearance.getColorScheme() === "dark";
        setIsDark(systemPref);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    await AsyncStorage.setItem("darkTheme", JSON.stringify(newValue));
  };

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
