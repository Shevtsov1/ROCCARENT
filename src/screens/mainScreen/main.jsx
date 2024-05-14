import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardsGrid from "../../components/cardsGrid";
import auth from "@react-native-firebase/auth";
import AuthHint from "./components/authHint";
import ScreenHeader from "../../components/ScreenHeader";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

const Main = ({ theme }) => {

  const navigation = useNavigation();

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  const items = [
    { title: "Item 1", description: "Description 1", price: 1, ratings: 1, mark: 1, owner: 'Mark'},
    { title: "Пила циркулярная Makitta", description: "Description 2", price: 2, ratings: 2, mark: 1.5, owner: 'Maks' },
    { title: "Item 3", description: "Description 3", price: 3, ratings: 3, mark: 2, owner: 'John' },
    { title: "Item 4", description: "Description 4", price: 4, ratings: 4, mark: 2.5, owner: 'Yuri' },
    { title: "Item 5", description: "Description 5", price: 5, ratings: 5, mark: 3, owner: 'Ivan' },
    { title: "Item 6", description: "Description 6", price: 6, ratings: 6, mark: 3.5, owner: 'Ilya' },
    { title: "Item 7", description: "Description 7", price: 7, ratings: 7, mark: 4, owner: 'Den' },
    { title: "Item 8", description: "Description 8", price: 15, ratings: 15, mark: 4.5, owner: 'Nikolay'},
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.body}>
        <ScreenHeader theme={theme} page={'main'}/>
        <ScrollView style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          borderRadius: 15,
          paddingBottom: hp(5),
        }}>
          {auth().currentUser && auth().currentUser.isAnonymous && <AuthHint theme={theme}/>}
          <ShadowedView style={[{marginBottom: 12}, shadowStyle({
            color: theme.colors.grey3,
            opacity: 0.8,
            radius: 24,
            offset: [0, 6],
          })]}>
            {/*<CardsGrid theme={theme} items={items} />*/}
          </ShadowedView>
          <ShadowedView style={shadowStyle({
            color: theme.colors.grey3,
            opacity: 0.8,
            radius: 24,
            offset: [0, 0],
          })}>
            {/*<CardsGrid theme={theme} items={items} />*/}
          </ShadowedView>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
