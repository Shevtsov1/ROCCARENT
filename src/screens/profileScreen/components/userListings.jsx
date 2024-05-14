import React, { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../../../App";
import firestore from "@react-native-firebase/firestore";
import LoadingScreen from "../../../components/loadingScreen";
import CardsGrid from "../../../components/cardsGrid";

const UserListings = ({ theme, navigation }) => {

  const { userdata, loadUserdata } = useContext(AppContext);

  const [listingsLoading, setListingsLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    loadUserdata();
    const subscriber = firestore()
      .collection('listings')
      .onSnapshot(querySnapshot => {
        const userListings = [];

        querySnapshot.forEach(documentSnapshot => {
          userdata.listings.forEach(listing => {
            if (documentSnapshot.id === listing)
              userListings.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
          })
        });

        setUserListings(userListings);
        setListingsLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);


  const styles = StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors.background,
    }, header: {
      height: 60,
      backgroundColor: theme.colors.accent,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
    }, headerMainText: {
      fontFamily: "Roboto-Medium",
      fontSize: 18,
      color: theme.colors.accentText,
    }, headerBackBtnText: {
      fontFamily: "Roboto-Regular",
      fontSize: 16,
      color: theme.colors.accentText,
    }, contentContainer: {
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.headerMainText}>Мои объявления</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.headerBackBtnText}>Назад</Text>
            </TouchableOpacity>
          </View>
          {listingsLoading ? <LoadingScreen theme={theme}/> : <>
            <View style={styles.contentContainer}>
              <CardsGrid theme={theme} items={userListings} likes/>
            </View>
          </>
          }
      </View>
    </SafeAreaView>
  );
};

export default UserListings;
