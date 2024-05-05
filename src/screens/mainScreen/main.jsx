import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardsGrid from "../../components/cardsGrid";

const Main = ({ theme, user }) => {

  const navigation = useNavigation();

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors.secondary,
    },
  });

  const items = [
    { title: "Item 1", description: "Description 1", price: 1, ratings: 1, mark: 1 },
    { title: "Пила циркулярная Makitta", description: "Description 2", price: 2, ratings: 2, mark: 1.5 },
    { title: "Item 3", description: "Description 3", price: 3, ratings: 3, mark: 2 },
    { title: "Item 4", description: "Description 4", price: 4, ratings: 4, mark: 2.5 },
    { title: "Item 5", description: "Description 5", price: 5, ratings: 5, mark: 3 },
    { title: "Item 6", description: "Description 6", price: 6, ratings: 6, mark: 3.5 },
    { title: "Item 7", description: "Description 7", price: 7, ratings: 7, mark: 4 },
    { title: "Item 8", description: "Description 8", price: 15, ratings: 15, mark: 4.5},
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.body}>
        <ScreenHeader theme={theme} user={user} page={"main"} navigation={navigation} />
        <ScrollView style={{
          flex: 1,
          backgroundColor: theme.colors.secondary,
          borderRadius: 15,
        }}>
          <CardsGrid theme={theme} items={items}/>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
