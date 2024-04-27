import React from 'react';
import { StyleSheet, View } from "react-native";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Main = ({theme, user}) => {

  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader theme={theme} user={user} page={'main'} navigation={navigation}/>
        <View style={{flex:1, backgroundColor: theme.colors.background}}>
          <Button onPress={() => navigation.navigate('ProfileStack', {screen: 'Auth'})} title={'auth'}/>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
