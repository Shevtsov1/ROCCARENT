import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Main = ({theme, user}) => {

  const navigation = useNavigation();

  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex:1,
      justifyContent: "center",
      alignItems: "center",
    },

    /* BODY END */
  });

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
