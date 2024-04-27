import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/navigator";
import { useCustomTheme } from "./src/assets/theme/theme";
import { StatusBar } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./src/components/loadingScreen";
import auth from "@react-native-firebase/auth";

const App = () => {

  const { theme, toggleMode, loadMode } = useCustomTheme();

  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loadingScreenText, setLoadingScreenText] = useState(null);

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor(theme.colors.background);
  StatusBar.setBarStyle(theme.mode === 'dark' ? 'light-content' : 'dark-content', true);

  changeNavigationBarColor(theme.colors.background, theme.mode !== 'dark', false);

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
    } else {
      // Пользователь не вошел в аккаунт, предлагаем выбрать аккаунт Google
      await auth().signInAnonymously();
    }
  }

  useEffect(() => {
    const initializeApp = async () => {
      await loadTheme();
      return auth().onAuthStateChanged(onAuthStateChanged);
    };

    const init = () => {
      initializeApp().then();
      setInitializing(false);
    };

    init();
  }, []);

  return (
    <SafeAreaProvider>
      {auth().currentUser && !auth().currentUser.isAnonymous && !auth().currentUser.emailVerified ? (
        <LoadingScreen theme={theme} text={'Письмо с подтверждением отправлено на Email\nОжидание подтверждения'} resendEmailVerify/>
      ) : (
        initializing ? (
          <LoadingScreen theme={theme} text={loadingScreenText}/>
        ) : (
          <AppNavigator user={user} theme={theme} toggleMode={toggleMode} setInitializing={setInitializing} setLoadingScreenText={setLoadingScreenText}/>
        )
      )}
    </SafeAreaProvider>
  );
};

export default App;
