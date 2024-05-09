import React from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingScreen = ({ theme, text, textColor }) => (
  <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background}}>
    <ActivityIndicator color={theme.colors.accent} size={60}/>
  </SafeAreaView>
);

export default LoadingScreen;
