import React from 'react';
import { View } from 'react-native';
import { ThemeProvider, Button } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCustomTheme } from "./src/assets/theme/theme";

const App = () => {
  const { theme, toggleMode } = useCustomTheme();

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <Button onPress={toggleMode} title={theme.mode} />
        </View>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
