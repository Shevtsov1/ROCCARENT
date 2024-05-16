import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../../components/loadingScreen";
import CardsGrid from "../../components/cardsGrid";
import { AppContext } from "../../../App";
import firestore from "@react-native-firebase/firestore";

const Favorites = ({ theme }) => {

  const { userdata, loadUserdata } = useContext(AppContext);

  const [listingsLoading, setListingsLoading] = useState(true);
  const [favoriteListings, setFavoriteListings] = useState(userdata.favoriteListings);

  useEffect(() => {
    const fetchFavoriteListings = async () => {
      if (userdata && userdata.favoriteListings) {
        const snapshot = await firestore().collection("listings").get();
        const updatedUserListings = [];

        snapshot.forEach(documentSnapshot => {
          if (userdata.favoriteListings.includes(documentSnapshot.id)) {
            updatedUserListings.push({
              ...documentSnapshot.data(),
            });
          }
        });

        setFavoriteListings(updatedUserListings);
      }
    };

    if (userdata && userdata.favoriteListings) {
      fetchFavoriteListings().then();
    }
    setListingsLoading(false);
  }, [userdata.favoriteListings]);

  const styles = StyleSheet.create({

    /* BODY BEGIN */

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
      marginBottom: 12,
    }, headerMainText: {
      fontFamily: "Roboto-Medium",
      fontSize: 18,
      color: theme.colors.accentText,
    },

    /* BODY END */
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.headerMainText}>Избранное</Text>
        </View>
        {listingsLoading ? <LoadingScreen theme={theme} /> :
          <>
            <View style={styles.contentContainer}>
              <CardsGrid theme={theme} items={favoriteListings} likes/>
            </View>
          </>
        }
      </View>
    </SafeAreaView>
  );
};

export default Favorites;
