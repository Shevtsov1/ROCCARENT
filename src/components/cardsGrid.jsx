import React from "react";
import ItemCard from "./itemCard";
import { Dimensions, FlatList } from "react-native";

const CardsGrid = ({ theme, items, likes, editBtn, deleteBtn, headerComponent, footerComponent, screen}) => {

  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth >= 384 ? 2 : 1;

  return (
    <FlatList
      data={items}
      ListHeaderComponent={() => (
          headerComponent && headerComponent
      )}
      ListFooterComponent={() => (
          footerComponent && footerComponent
      )}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ItemCard item={item} theme={theme} likes={likes}  editBtn={editBtn} deleteBtn={deleteBtn} screen={screen}/>
      )
      } />
  );
};

export default CardsGrid;
