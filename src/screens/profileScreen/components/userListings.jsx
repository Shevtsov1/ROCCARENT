import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../../../App";
import firestore from "@react-native-firebase/firestore";
import LoadingScreen from "../../../components/loadingScreen";
import CardsGrid from "../../../components/cardsGrid";
import auth from "@react-native-firebase/auth";
import { query } from "@react-native-firebase/firestore/lib/modular/query";
import { onSnapshot } from "@react-native-firebase/firestore/lib/modular/snapshot";

const UserListings = ({ theme, navigation }) => {

  const { userdata, loadUserdata } = useContext(AppContext);

  const [listingsLoading, setListingsLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    const fetchUserListings = async () => {
      await loadUserdata();

      const querySnapshot = await firestore().collection("listings").get();
      const updatedUserListings = [];

      querySnapshot.forEach(documentSnapshot => {
        if(userdata && userdata.listings) {
          userdata.listings.forEach(listing => {
            if (documentSnapshot.id === listing) {
              updatedUserListings.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            }
          });
        }
      });

      updatedUserListings.sort((a, b) => {
        const dateA = new Date(a.creationDate);
        const dateB = new Date(b.creationDate);
        return dateB.getTime() - dateA.getTime(); // Сортировка в порядке убывания
      });

      setUserListings(updatedUserListings);
      setListingsLoading(false);
    };
    fetchUserListings().then();
  }, [loadUserdata]);

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
      alignItems: 'flex-start',
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
