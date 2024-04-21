import React, { useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import LogIn from "./components/logIn";
import LogUp from "./components/logUp";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@rneui/base";

const Auth = ({ theme, isDarkMode, user, navigation, setInitializing }) => {



  const Tab = createMaterialTopTabNavigator();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Tab.Navigator
          initialRouteName={'LogIn'}
          screenOptions={{
            tabBarItemStyle: {
              padding: 0,
              margin: 0,
              width: 'auto',
              paddingHorizontal: wp(5),
            },
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              elevation: 5,
              shadowColor: theme.colors.text,
            },
            tabBarLabelStyle: {
              margin: 0,
              textTransform: 'none',
              fontFamily: 'Montserrat-Bold',
              fontSize: 16,
              color: theme.colors.text,
            },
            tabBarPressColor: theme.colors.background,
            tabBarIndicatorStyle: {
              backgroundColor: theme.colors.text
            }
          }}
        >
          <Tab.Screen
            name="LogIn"
            options={{
              tabBarLabel: 'Вход',
            }}
          >
            {(props) => (
              <LogIn {...props} user={user} theme={theme} isDarkMode={isDarkMode} setInitializing={setInitializing}/>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="LogUp"
            options={{
              tabBarLabel: 'Регистрация',
            }}
          >
            {(props) => (
              <LogUp {...props} user={user} theme={theme} isDarkMode={isDarkMode} setInitializing={setInitializing}/>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Auth;
