import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../../components/loadingScreen";
import CardsGrid from "../../components/cardsGrid";
import { AppContext } from "../../../App";
import firestore from "@react-native-firebase/firestore";
import { Button } from "@rneui/base";

const Favorites = ({ theme, navigation }) => {

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
              {favoriteListings.length === 0 ?
                <>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 12, }}>
                    <Text style={{
                      fontFamily: "Roboto-Regular",
                      fontSize: 16,
                      color: theme.colors.text,
                      marginBottom: 12,
                    }}>Вы не добавляли объявления в избранное</Text>
                    <Button containerStyle={{ borderRadius: 5, width: '100%' }} buttonStyle={{ height: 48, width: '100%', backgroundColor: theme.colors.accent }}
                            titleStyle={{backgroundColor: theme.colors.grey1}}
                            onPress={() => navigation.navigate("Main")}>
                      <Text style={{
                        fontFamily: "Roboto-Regular",
                        fontSize: 14,
                        color: theme.colors.accentText,
                      }}>Перейти к просмотру объявлений</Text>
                    </Button>
                  </View>
                </>
                :
                <CardsGrid theme={theme} items={favoriteListings} likes />
              }
            </View>
          </>
        }
      </View>
    </SafeAreaView>
  );
};

export default Favorites;
