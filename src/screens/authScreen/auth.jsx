import React, {useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LogIn from "./components/logIn";
import LogUp from "./components/logUp";
import {widthPercentageToDP as wp, widthPercentageToDP} from "react-native-responsive-screen";
import { Button, Text } from "@rneui/base";

const Auth = ({theme, isDarkMode, user, navigation, setInitializing}) => {
  const [activeAuthBtn, setActiveAuthBtn] = useState('Вход');
  const activeAuthBtnAnimatedValue = useRef(new Animated.Value(0)).current;

  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={{flex: 1}}>
      <View style={{flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.secondary}}>
        <Text>A U T H</Text>
      </View>
    </View>
  );
};

export default Auth;
