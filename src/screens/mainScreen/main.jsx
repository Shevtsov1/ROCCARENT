import React from 'react';
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Main = ({theme, user}) => {

  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScreenHeader theme={theme} user={user} page={'main'} navigation={navigation}/>
        <Button onPress={() => navigation.navigate('ProfileStack', {screen: 'Auth'})} title={'auth'}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
