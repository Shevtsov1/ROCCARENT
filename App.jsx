import React, { createContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/navigator";
import { useCustomTheme } from "./src/assets/theme/theme";
import { Image, StatusBar } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoadingScreen from "./src/components/appLoadingScreen";
import auth from "@react-native-firebase/auth";
import NetInfo from "@react-native-community/netinfo";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import FastImage from "react-native-fast-image";
import interfaceIcons from "./src/components/interfaceIcons";
import { getNickname, getPassportData, getPhoneNumber } from "./src/components/preloadUserdata";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const AppContext = createContext();

const App = React.memo(() => {

  const { theme, toggleMode, loadMode } = useCustomTheme();

  const [userdata, setUserdata] = useState(null);

  const [initializing, setInitializing] = useState(true);
  const [loadingScreenText, setLoadingScreenText] = useState(null);
  const [isInternetConnected, setIsInternetConnected] = useState(true);

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor(theme.colors.accent);
  StatusBar.setBarStyle("light-content", true);

  changeNavigationBarColor(theme.colors.background, theme.mode !== "dark", false);

  useEffect(() => {
    const checkInternetConnectivity = async () => {
      const state = await NetInfo.fetch();
      setIsInternetConnected(state.isConnected && state.isInternetReachable);
    };

    const handleConnectivityChange = (state) => {
      setIsInternetConnected(state.isConnected && state.isInternetReachable);
    };

    // Проверка подключения при запуске приложения
    checkInternetConnectivity().then();

    // Подписка на изменения состояния подключения
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      // Отписка от изменений состояния подключения при размонтировании компонента
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser || currentUser.isAnonymous) {
          await auth().signInAnonymously();
          await onGoogleButtonPress();
        }
        await preloadImages();
        await loadTheme();
      } catch (error) {
        console.log(error);
      }
    };

    const init = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const startTime = performance.now();
          await initializeApp();
          const currentUser = auth().currentUser;
          if (
            currentUser &&
            !currentUser.isAnonymous &&
            !currentUser.emailVerified
          ) {
            await waitForEmailVerification().catch((error) =>
              setLoadingScreenText("Ошибка при подтверждении почты: " + error),
            );
          }
          const endTime = performance.now(); // Записываем время окончания выполнения
          const executionTime = endTime - startTime; // Вычисляем время выполнения в миллисекундах
          resolve(executionTime);
        } catch (error) {
          // Обработка ошибки при предварительной загрузке иконок
          console.error("Ошибка при предварительной загрузке иконок:", error);
          reject(error);
        }
      });
    };

    init()
      .then((executionTime) => {
        if (executionTime < 500) {
          setTimeout(() => {
            setInitializing(false);
          }, 500 - executionTime);
        } else {
          setInitializing(false);
        }
      })
      .catch((error) =>
        console.error("Ошибка при инициализации приложения:", error),
      );
  }, []);

  useEffect(() => {
    if (auth().currentUser && !auth().currentUser.isAnonymous && !userdata) {
      loadUserdata().then();
    }
  }, [auth().currentUser]);


  // Загрузка сохраненной темы при запуске приложения
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        const theme = JSON.parse(savedTheme);
        loadMode(theme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  async function preloadImages() {
    const uris = interfaceIcons.map(image => ({
      uri: Image.resolveAssetSource(image).uri,
    }));
    await FastImage.preload(uris);
  }

  const loadUserdata = async () => {
    const nickname = await getNickname();
    const passportData = await getPassportData();
    const phoneNumber = await getPhoneNumber();
    const updatedUserdata = {
      nickname,
      passportData,
      phoneNumber,
    };
    setUserdata(updatedUserdata);
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
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isInternetConnected) {
    return (
      <SafeAreaProvider>
        <AppLoadingScreen theme={theme} text={"Нет подключения к интернету"} textColor={theme.colors.error} />
      </SafeAreaProvider>
    );
  }

  if (initializing) {
    return <AppLoadingScreen theme={theme} text={loadingScreenText} />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
            <AppContext.Provider value={{ userdata, loadUserdata }}>
              <AppNavigator theme={theme} toggleMode={toggleMode} setInitializing={setInitializing}
                            setLoadingScreenText={setLoadingScreenText} />
            </AppContext.Provider>
    </GestureHandlerRootView>
  );
});

export default App;
