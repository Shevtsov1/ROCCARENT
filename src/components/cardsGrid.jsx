import React from "react";
import ItemCard from "./itemCard";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";

const CardsGrid = ({ theme, items, likes }) => {

  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth >= 384 ? 2 : 1;

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
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ItemCard item={item} theme={theme} likes={likes}/>
      )
      } />
  );
};

export default CardsGrid;
