import React from "react";
import ItemCard from "./itemCard";
import { StyleSheet, View } from "react-native";

const CardsGrid = ({theme, items}) => {

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
    <View style={styles.cardsContainer}>
      {items.map((item, index) => (
        <ItemCard theme={theme} item={item} key={index}/>
      ))}
    </View>
  );
  };

export default CardsGrid;
