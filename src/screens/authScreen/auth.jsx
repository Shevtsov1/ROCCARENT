import React, { useRef, useState } from "react";
import { Tab, Text, TabView } from "@rneui/themed";
import LogIn from "./components/logIn";
import LogUp from "./components/logUp";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Animated, Easing, Image, TouchableOpacity, View } from "react-native";

const Auth = ({ theme, user, navigation, setInitializing }) => {
  const [index, setIndex] = React.useState(0);
  const [isAdviceShown, setIsAdviceShown] = useState(true);
  const adviceAnimation = useRef(new Animated.Value(1)).current;

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

  const closeAdvice = () => {
    Animated.parallel([
      Animated.timing(adviceAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAdviceShown(false);
    });
  };

  const adviceOpacity = adviceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const Advice = ({authTypeWord}) => {
    return (
      <Animated.View style={{
        width: wp(92),
        height: "auto",
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
        borderRadius: 15,
        backgroundColor: theme.colors.background,
        opacity: adviceOpacity,
        elevation: 1,
        shadowColor: theme.colors.text,
      }}>
        <Text
          style={{ fontFamily: "Montserrat-Medium", fontSize: 14, color: theme.colors.text, marginBottom: 6 }}>{authTypeWord},
          чтобы:</Text>
        <View style={{ flexDirection: "row", marginBottom: 3 }}>
          <Image style={{ width: 18, height: 18, resizeMode: "contain", marginEnd: 6 }}
                 source={require("../../assets/images/createAd-sticker.png")}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Montserrat-Medium", fontSize: 14, color: theme.colors.text }}>Подавать
              объявления</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 3 }}>
          <Image style={{ width: 18, height: 18, resizeMode: "contain", marginEnd: 6 }}
                 source={require("../../assets/images/saved-sticker.png")}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Montserrat-Medium", fontSize: 14, color: theme.colors.text }}>Сохранять
              товары и продавцов в Избранное</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Image style={{ width: 18, height: 18, resizeMode: "contain", marginEnd: 6 }}
                 source={require("../../assets/images/chatting-sticker.png")}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Montserrat-Medium", fontSize: 14, color: theme.colors.text }}>Отправлять
              и получать сообщения</Text>
          </View>
        </View>
        <TouchableOpacity onPress={closeAdvice}
                          style={{
                            position: "absolute",
                            top: hp(0.5),
                            right: wp(0.5),
                            height: 30,
                            width: 30,
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
          <Image source={require("../../assets/images/SearchBar/cancel.png")}
                 style={{ width: 20, height: 20, tintColor: theme.colors.text }}
                 resizeMode={"contain"} />
        </TouchableOpacity>
      </Animated.View>
    )
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
              <LogIn user={user} theme={theme} setInitializing={setInitializing} Advice={Advice} isAdviceShown={isAdviceShown} onGoogleButtonPress={onGoogleButtonPress}/>
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <LogUp user={user} theme={theme} setInitializing={setInitializing} Advice={Advice} isAdviceShown={isAdviceShown} onGoogleButtonPress={onGoogleButtonPress}/>
            </TabView.Item>
          </TabView>
        </>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Auth;
