import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export const useThemeStyles = () => {
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);

  return {
    toggleTheme,
    theme,
    isDark,
    style: {
      background: { backgroundColor: theme.background },
      text: { color: theme.text },
      card: { backgroundColor: theme.card },
    },
  };
};
