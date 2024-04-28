import React, {useEffect} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/profileScreen/profile";
import LogIn from "../screens/authScreen/logIn";
import LogUp from "../screens/authScreen/logUp";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

const Stack = createNativeStackNavigator();

export const ProfileStackNavigator = ({
                                        user,
                                        theme,
                                        toggleMode,
                                        setInitializing,
                                        setLoadingScreenText,
                                      }) => {

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
      return await auth().signInWithCredential(googleCredential).then(() => {
        setInitializing(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={"Profile"}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.text,
        },
        headerTitleAlign: "center",
        headerTintColor: theme.colors.text,
      }}>
      <Stack.Screen name="Profile" options={{ title: "Профиль", headerShown: false }}>{(props) =>
        <Profile {...props} user={user} theme={theme} toggleMode={toggleMode}
                 setInitializing={setInitializing} />}</Stack.Screen>
      <Stack.Screen name="LogIn" options={{ title: "Вход", headerShown: false }}>{(props) =>
        <LogIn {...props} user={user} theme={theme} setInitializing={setInitializing}
               setLoadingScreenText={setLoadingScreenText} onGoogleButtonPress={onGoogleButtonPress} />}</Stack.Screen>
      <Stack.Screen name="LogUp" options={{ title: "Регистрация", headerShown: false, }}>{(props) =>
        <LogUp {...props} user={user} theme={theme} setInitializing={setInitializing}
               setLoadingScreenText={setLoadingScreenText} onGoogleButtonPress={onGoogleButtonPress}/>}</Stack.Screen>
    </Stack.Navigator>
  );
}
