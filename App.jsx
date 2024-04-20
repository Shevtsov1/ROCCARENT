import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/navigator";
import { useCustomTheme } from "./src/assets/theme/theme";
import { useFonts } from "expo-font";

const App = () => {

  const { theme, toggleMode } = useCustomTheme();

  let [fontsLoaded] = useFonts({
    'Montserrat-Black': require('./src/assets/fonts/Montserrat-Black.ttf'),
    'Montserrat-Bold': require('./src/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('./src/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Medium': require('./src/assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Italic': require('./src/assets/fonts/Montserrat-Italic.ttf'),
    'Montserrat-Light': require('./src/assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Thin': require('./src/assets/fonts/Montserrat-Thin.ttf'),
  });

  return (
    <SafeAreaProvider>
      <AppNavigator  theme={theme} toggleMode={toggleMode}/>
    </SafeAreaProvider>
  );
};

export default App;
