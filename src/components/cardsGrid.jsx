import React from "react";
import ItemCard from "./itemCard";
import {ActivityIndicator, Dimensions, FlatList, RefreshControl, View} from "react-native";
import auth from "@react-native-firebase/auth";
import AuthHint from "../screens/mainScreen/components/authHint";
import ActiveDeals from "../screens/mainScreen/components/activeDeals";

const CardsGrid = ({ theme, items, likes, editBtn, deleteBtn, headerComponent, footerComponent, screen, reloadFunction, authHint, deals, listingsLoading}) => {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reloadFunction().finally(() => {
      setRefreshing(false);
    });
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 2;

  return (
    <FlatList
        refreshControl = {
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.accent]}/>
        }
      data={listingsLoading ? [1] : items}
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
         listingsLoading ? <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
             <ActivityIndicator size={48} color={theme.colors.accent}/>
         </View> : <ItemCard item={item} theme={theme} likes={likes}  editBtn={editBtn} deleteBtn={deleteBtn} screen={screen}/>
      )
      } />
  );
};

export default CardsGrid;
