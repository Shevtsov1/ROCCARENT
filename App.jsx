import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/navigator";
import { useCustomTheme } from "./src/assets/theme/theme";
import { useFonts } from "expo-font";
import { ActivityIndicator, Image, StatusBar, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Asset } from "expo-asset";

const App = () => {

  const { theme, toggleMode, loadMode } = useCustomTheme();

  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor(theme.colors.background);
  StatusBar.setBarStyle(theme.mode === 'dark' ? 'light-content' : 'dark-content', true);

  NavigationBar.setBackgroundColorAsync(theme.colors.background).then();
  NavigationBar.setButtonStyleAsync(theme.mode === 'dark' ? 'light' : 'dark').then();

  // Загрузка шрифтов
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

  async function loadImages() {
    const images = [
      require('./src/assets/images/logo/logo-dark.png'),
      require('./src/assets/images/logo/logo-light.png'),
      require('./src/assets/images/bottomTab/add.png'),
      require('./src/assets/images/bottomTab/addFilled.png'),
      require('./src/assets/images/bottomTab/home.png'),
      require('./src/assets/images/bottomTab/homeFilled.png'),
      require('./src/assets/images/bottomTab/catalog.png'),
      require('./src/assets/images/bottomTab/catalogFilled.png'),
      require('./src/assets/images/bottomTab/favorite.png'),
      require('./src/assets/images/bottomTab/favoriteFilled.png'),
      require('./src/assets/images/bottomTab/profile.png'),
      require('./src/assets/images/bottomTab/profileFilled.png'),
      require('./src/assets/images/screens/profile/incognito.png'),
      require('./src/assets/images/screens/profile/right-arrow.png'),
      require('./src/assets/images/screens/profile/logout-filled.png'),
      require('./src/assets/images/screens/profile/settings.png'),
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all(cacheImages);
  }

  // Загрузка сохраненной темы при запуске приложения
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        const theme = JSON.parse(savedTheme);
        toggleMode(theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {

      await loadTheme();
      await loadImages();
      setInitializing(false);
    };

    initializeApp().then();
  }, []);


  return (
    <SafeAreaProvider>
      {initializing || !fontsLoaded ? (
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background
        }}>
          <View style={{
            alignItems: "center",
            marginBottom: 20
          }}>
            {theme.mode === 'dark' ? (
              <Image
                source={require('./src/assets/images/logo/logo-dark.png')}
                style={{width: wp('70%')}}
                resizeMode={"contain"}
              />
            ) : (
              <Image
                source={require('./src/assets/images/logo/logo-light.png')}
                style={{width: wp('70%')}}
                resizeMode={"contain"}
              />
            )}
          </View>
          <ActivityIndicator
            size={75}
            color={theme.colors.accent}
          />
        </View>
      ) : (
        <AppNavigator user={user} theme={theme} toggleMode={toggleMode} setInitializing={setInitializing}/>
      )}
    </SafeAreaProvider>
  );
};

export default App;
