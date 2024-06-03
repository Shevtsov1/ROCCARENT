import React from "react";
import ItemCard from "./itemCard";
import { Dimensions, FlatList, RefreshControl } from "react-native";
import auth from "@react-native-firebase/auth";
import AuthHint from "../screens/mainScreen/components/authHint";
import ActiveDeals from "../screens/mainScreen/components/activeDeals";

const CardsGrid = ({ theme, items, likes, editBtn, deleteBtn, headerComponent, footerComponent, screen, reloadFunction, authHint, deals}) => {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reloadFunction().finally(() => {
      setRefreshing(false);
    });
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth >= 384 ? 2 : 1;

  return (
    <FlatList
      refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.accent]}/>
      }
      data={items}
      ListHeaderComponent={() => (
          <>
              {deals && <ActiveDeals theme={theme}/>}
              {authHint && auth().currentUser && auth().currentUser.isAnonymous && <AuthHint theme={theme}/>}
              {headerComponent && headerComponent}
          </>
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
