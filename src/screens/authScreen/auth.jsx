import React from "react";
import { Tab, Text, TabView } from "@rneui/themed";
import LogIn from "./components/logIn";
import LogUp from "./components/logUp";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

const Auth = ({ theme, user, navigation, setInitializing }) => {
  const [index, setIndex] = React.useState(0);

  GoogleSignin.configure({
    webClientId: "771592361046-c50gd0p0heu9i02kp2j8j3s27m45h8cl.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader theme={theme} user={user} page={'auth'} navigation={navigation}/>
        <>
          <Tab containerStyle={{ backgroundColor: theme.colors.background }} titleStyle={{ fontFamily: 'Montserrat-Bold', color: theme.colors.text }}
               indicatorStyle={{ backgroundColor: theme.colors.text, width: '50%' }} value={index}  onChange={setIndex} denseswipeEnabled={false}>
            <Tab.Item>Вход</Tab.Item>
            <Tab.Item>Регистрация</Tab.Item>
          </Tab>
          <TabView containerStyle={{backgroundColor: theme.colors.secondary }} value={index} onChange={setIndex} animationType="spring" disableSwipe>
            <TabView.Item style={{ width: "100%" }}>
              <LogIn user={user} theme={theme} setInitializing={setInitializing} onGoogleButtonPress={onGoogleButtonPress}/>
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <LogUp user={user} theme={theme} setInitializing={setInitializing} onGoogleButtonPress={onGoogleButtonPress}/>
            </TabView.Item>
          </TabView>
        </>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Auth;
