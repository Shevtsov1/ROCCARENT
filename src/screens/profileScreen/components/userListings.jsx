import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../../../App";
import firestore from "@react-native-firebase/firestore";
import LoadingScreen from "../../../components/loadingScreen";
import CardsGrid from "../../../components/cardsGrid";
import { Button } from "@rneui/base";

const UserListings = ({ theme, navigation }) => {

  const { userdata } = useContext(AppContext);

  const [listingsLoading, setListingsLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    fetchUserListings().then();
  }, [userdata]);

  const fetchUserListings = async () => {
    const querySnapshot = await firestore().collection("listings").get();
    const updatedUserListings = [];

    querySnapshot.forEach(documentSnapshot => {
      if (userdata && userdata.listings) {
        userdata.listings.forEach(listing => {
          if (documentSnapshot.id === listing) {
            updatedUserListings.push({
              ...documentSnapshot.data(),
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
      alignItems: "flex-start",
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
        {listingsLoading ? <LoadingScreen theme={theme} /> :
          userListings.length === 0 ?
            <>
              <View style={{ justifyContent: "center", alignItems: "center", padding: 12, }}>
                <Text style={{
                  fontFamily: "Roboto-Regular",
                  fontSize: 16,
                  color: theme.colors.text,
                  marginBottom: 12,
                }}>У вас нет активных объявлений</Text>
                <Button containerStyle={{ borderRadius: 5, width: '100%' }} buttonStyle={{ height: 48, width: '100%', backgroundColor: theme.colors.accent }}
                        titleStyle={{backgroundColor: theme.colors.grey1}}
                        onPress={() => navigation.navigate("CreateAd")}>
                  <Text style={{
                    fontFamily: "Roboto-Regular",
                    fontSize: 14,
                    color: theme.colors.accentText,
                  }}>Перейти к созданию объявлений</Text>
                </Button>
              </View>
            </>
            :
            <>
              <View style={[styles.contentContainer, {alignItems: 'center'}]}>
                <CardsGrid theme={theme} items={userListings} reloadFunction={fetchUserListings} editBtn deleteBtn screen={'Profile'} />
              </View>
            </>
        }
      </View>
    </SafeAreaView>
  );
};

export default UserListings;
