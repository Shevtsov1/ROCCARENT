import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/navigator";
import { useCustomTheme } from "./src/assets/theme/theme";
import { useFonts } from "expo-font";
import { StatusBar } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from "expo-asset";
import LoadingScreen from "./src/components/loadingScreen";
import auth from "@react-native-firebase/auth";

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

    const cacheImages = images.map(async (image) => {
      const imageAsset = Asset.fromModule(image);
      await imageAsset.downloadAsync();
      const localUri = imageAsset.localUri;
      await AsyncStorage.setItem(image.toString(), localUri);
    });

    return Promise.all(cacheImages);
  }

  // Загрузка сохраненной темы при запуске приложения
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        const theme = JSON.parse(savedTheme);
        loadMode(theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  async function onAuthStateChanged(user) {
    if (user) {
      // Пользователь вошел в аккаунт
      setUser(user);
      if (initializing) setInitializing(false);
    } else {
      // Пользователь не вошел в аккаунт, предлагаем выбрать аккаунт Google
      await auth().signInAnonymously();
    }
  }

  useEffect(() => {
    const initializeApp = async () => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      await loadTheme();
      await loadImages();
      return subscriber;
    };

    initializeApp().then(() => setInitializing(false));
  }, []);


  return (
    <SafeAreaProvider>
      {initializing || !fontsLoaded ? (
        <LoadingScreen theme={theme}/>
      ) : (
        <AppNavigator user={user} theme={theme} toggleMode={toggleMode} setInitializing={setInitializing}/>
      )}
    </SafeAreaProvider>
  );
};

export default App;
