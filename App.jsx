import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/navigator";
import { useCustomTheme } from "./src/assets/theme/theme";
import { StatusBar } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./src/components/loadingScreen";
import auth from "@react-native-firebase/auth";
import NetInfo from "@react-native-community/netinfo";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const App = () => {

  const { theme, toggleMode, loadMode } = useCustomTheme();

  const [initializing, setInitializing] = useState(true);
  const [loadingScreenText, setLoadingScreenText] = useState(null);
  const [isInternetConnected, setIsInternetConnected] = useState(true);

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor(theme.colors.accent);
  StatusBar.setBarStyle('light-content', true);

  changeNavigationBarColor(theme.colors.secondary, theme.mode !== 'dark', false);

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
    if (!user) {
      const currentUser = auth().currentUser;
      if (!currentUser || (currentUser && currentUser.isAnonymous)) {
        auth()
          .signInAnonymously()
          .catch((error) => {
            console.log(error)
          });
      }
    }
  }

  useEffect(() => {
    const initializeApp = async () => {
      await loadTheme();
      await auth().onAuthStateChanged(onAuthStateChanged);
      await onGoogleButtonPress();
    };

    const init = async () => {
      const isConnected = await checkInternetConnectivity();
      setIsInternetConnected(isConnected);

      if (isConnected) {
        initializeApp().then();
        const currentUser = auth().currentUser;
        if (
          currentUser &&
          !currentUser.isAnonymous &&
          !currentUser.emailVerified
        ) {
          await waitForEmailVerification().catch((error) =>
            setLoadingScreenText("Ошибка при подтверждении почты: " + error)
          );
        }
      }
    };

    init().then();
    setTimeout(() => {
      setInitializing(false);
    }, 2500);
  }, []);

  const checkInternetConnectivity = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  };

  const waitForEmailVerification = async () => {
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        const user = auth().currentUser;
        await user.reload();
        if (user.emailVerified) {
          clearInterval(intervalId);
          resolve();
        }
      }, 1000); // Проверяем каждую секунду
    });
  };

  GoogleSignin.configure({
    webClientId: "771592361046-c50gd0p0heu9i02kp2j8j3s27m45h8cl.apps.googleusercontent.com",
  });

  const onGoogleButtonPress = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      setInitializing(true);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
      setInitializing(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isInternetConnected) {
    return (
      <SafeAreaProvider>
        <LoadingScreen theme={theme} text={'Нет подключения к интернету'} textColor={theme.colors.error}/>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {auth().currentUser && !auth().currentUser.isAnonymous && !auth().currentUser.emailVerified ? (
        <LoadingScreen theme={theme} text={'Письмо с подтверждением отправлено на Email\nОжидание подтверждения'} resendEmailVerify/>
      ) : (
        initializing ? (
          <LoadingScreen theme={theme} text={loadingScreenText}/>
        ) : (
          <AppNavigator theme={theme} toggleMode={toggleMode} setInitializing={setInitializing} setLoadingScreenText={setLoadingScreenText}/>
        )
      )}
    </SafeAreaProvider>
  );
};

export default App;
