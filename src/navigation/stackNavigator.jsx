import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/profileScreen/profile";
import LogIn from "../screens/authScreen/logIn";
import LogUp from "../screens/authScreen/logUp";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import EditName from "../screens/profileScreen/components/editProfile/editName";
import Settings from "../screens/profileScreen/components/settings";
import DealArchive from "../screens/profileScreen/components/dealArchive";
import Support from "../screens/profileScreen/components/support/support";
import EditEmail from "../screens/profileScreen/components/editProfile/editEmail";
import EditPassport from "../screens/profileScreen/components/editProfile/editPassport";
import EditPhoneNumber from "../screens/profileScreen/components/editProfile/editPhoneNumber";
import UserListings from "../screens/profileScreen/components/userListings";
import firestore from "@react-native-firebase/firestore";

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
      return await auth().signInWithCredential(googleCredential).then(async () => {
        const snapshot = await firestore().collection("users").doc(auth().currentUser.uid).get();
        if (snapshot.exists && !snapshot.data().nickname) {
          await firestore().collection("users").doc(auth().currentUser.uid).update({ nickname: auth().currentUser.displayName }).then(() => setInitializing(false));
        } else {
          setInitializing(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [passportData, setPassportData] = useState("");

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
                 setInitializing={setInitializing} passportData={passportData} />}</Stack.Screen>
      <Stack.Screen name="LogIn" options={{ title: "Вход", headerShown: false }}>{(props) =>
        <LogIn {...props} user={user} theme={theme} setInitializing={setInitializing}
               setLoadingScreenText={setLoadingScreenText} onGoogleButtonPress={onGoogleButtonPress} />}</Stack.Screen>
      <Stack.Screen name="LogUp" options={{ title: "Регистрация", headerShown: false }}>{(props) =>
        <LogUp {...props} user={user} theme={theme} setInitializing={setInitializing}
               setLoadingScreenText={setLoadingScreenText} onGoogleButtonPress={onGoogleButtonPress} />}</Stack.Screen>
      <Stack.Screen name="Settings" options={{ headerShown: false }}>{(props) =>
        <Settings {...props} theme={theme} setInitializing={setInitializing}
                  setLoadingScreenText={setLoadingScreenText} />}</Stack.Screen>
      <Stack.Screen name="DealArchive" options={{ headerShown: false }}>{(props) =>
        <DealArchive {...props} theme={theme} setInitializing={setInitializing}
                     setLoadingScreenText={setLoadingScreenText} />}</Stack.Screen>
      <Stack.Screen name="EditName" options={{ headerShown: false }}>{(props) =>
        <EditName {...props} theme={theme} />}</Stack.Screen>
      <Stack.Screen name="EditEmail" options={{ headerShown: false }}>{(props) =>
        <EditEmail {...props} theme={theme} />}</Stack.Screen>
      <Stack.Screen name="EditPassport" options={{ headerShown: false }}>{(props) =>
        <EditPassport {...props} theme={theme} />}</Stack.Screen>
      <Stack.Screen name="EditPhoneNumber" options={{ headerShown: false }}>{(props) =>
        <EditPhoneNumber {...props} theme={theme} />}</Stack.Screen>
      <Stack.Screen name="Support" options={{ headerShown: false }}>{(props) =>
        <Support {...props} theme={theme} />}</Stack.Screen>
      <Stack.Screen name="UserListings" options={{ headerShown: false }}>{(props) =>
        <UserListings {...props} theme={theme} />}</Stack.Screen>
    </Stack.Navigator>
  );
};
