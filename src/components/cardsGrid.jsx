import React from "react";
import ItemCard from "./itemCard";
import { FlatList, StyleSheet, View } from "react-native";

const CardsGrid = ({ theme, items }) => {

  const styles = StyleSheet.create({
    cardsContainer: {
      flex: 1,
      flexGrow: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      borderRadius: 15,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <FlatList
      data={items}
      numColumns={2}
      renderItem={({ item }) => (
        <ItemCard item={item} theme={theme} />
      )
      } />
  );
};

export default CardsGrid;
