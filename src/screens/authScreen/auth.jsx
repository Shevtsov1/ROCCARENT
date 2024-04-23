import React from "react";
import { Tab, Text, TabView } from "@rneui/themed";
import LogIn from "./components/logIn";
import LogUp from "./components/logUp";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader";

const Auth = ({ theme, user, navigation, setInitializing }) => {
  const [index, setIndex] = React.useState(0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader theme={theme} user={user} page={'auth'} navigation={navigation}/>
        <>
          <Tab containerStyle={{ backgroundColor: theme.colors.background }} titleStyle={{ fontFamily: 'Montserrat-Bold', color: theme.colors.text }}
               indicatorStyle={{ backgroundColor: theme.colors.text, width: '50%' }} value={index} onChange={setIndex} dense>
            <Tab.Item>Вход</Tab.Item>
            <Tab.Item>Регистрация</Tab.Item>
          </Tab>
          <TabView containerStyle={{backgroundColor: theme.colors.secondary }} value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{ width: "100%" }}>
              <LogIn user={user} theme={theme} setInitializing={setInitializing} />
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <LogUp user={user} theme={theme} setInitializing={setInitializing} />
            </TabView.Item>
          </TabView>
        </>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Auth;
