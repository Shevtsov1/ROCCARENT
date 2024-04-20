import { useState, useCallback } from 'react';
import { createTheme } from '@rneui/themed';
import { appColors } from "./appColors";

export const useCustomTheme = () => {
  const [mode, setMode] = useState('light');

  const toggleMode = useCallback(() => {
    setMode(prevMode => (prevMode === 'dark' ? 'light' : 'dark'));
  }, []);

  const theme = createTheme({
    colors: appColors[mode],
    mode: mode,
  });

  return { theme, toggleMode };
};
