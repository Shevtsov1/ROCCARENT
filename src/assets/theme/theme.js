import { useCallback, useState } from "react";
import { createTheme } from "@rneui/themed";
import { appColors } from "./appColors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCustomTheme = () => {
  const [mode, setMode] = useState("light");

  const toggleMode = useCallback(() => {
    setMode(prevMode => {
      const newMode = prevMode === "dark" ? "light" : "dark";
      AsyncStorage.setItem('theme', JSON.stringify(newMode))
        .then(() => console.log('Theme saved successfully'))
        .catch(error => console.error('Error saving theme:', error));
      return newMode;
    });
  }, []);

  const loadMode = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  const theme = createTheme({
    colors: appColors[mode],
    mode: mode,
  });

  return { theme, toggleMode, loadMode };
};
