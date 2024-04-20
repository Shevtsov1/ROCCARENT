import React from 'react';
import { ThemeProvider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCustomTheme } from "./src/assets/theme/theme";
import AppNavigator from "./src/navigation/navigator";

const App = () => {
  const { theme, toggleMode } = useCustomTheme();

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <AppNavigator/>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
