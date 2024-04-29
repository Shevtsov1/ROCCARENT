import React from 'react';
import { Text, View } from "react-native";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";

const Main = ({theme, user}) => {

  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <ScreenHeader theme={theme} user={user} page={'main'} navigation={navigation}/>
        <View style={{flexGrow: 1, backgroundColor: theme.colors.background}} source={require('../../assets/images/sun.png')}>
          <Button onPress={() => navigation.navigate('ProfileStack', {screen: 'Auth'})} title={'auth'}/>
          {auth().currentUser.isAnonymous && <Text>Anonymous: {auth().currentUser.uid}</Text>}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
