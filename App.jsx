import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/navigator";
import { useCustomTheme } from "./src/assets/theme/theme";

const App = () => {

  const { theme, toggleMode } = useCustomTheme();

  return (
    <SafeAreaProvider>
      <AppNavigator  theme={theme} toggleMode={toggleMode}/>
    </SafeAreaProvider>
  );
};

export default App;
