import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardsGrid from "../../components/cardsGrid";
import auth from "@react-native-firebase/auth";
import AuthHint from "./components/authHint";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import firestore from "@react-native-firebase/firestore";
import { Icon } from "@rneui/base";
import { AppContext } from "../../../App";
import LoadingScreen from "../../components/loadingScreen";

const Main = ({ theme }) => {

  const { loadUserdata } = useContext(AppContext);

  const [listings, setListings] = useState([]);

  useEffect(() => {
    const load = async () => {
      await loadUserdata();
      await loadListingList();
    };
    load().then();
  }, []);

  const handleReloadBtn = async () => {
    try {
      await loadUserdata();
      await loadListingList();
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const loadListingList = async () => {
    try {
      let newListingsArr = [];
      const listingsData = await firestore().collection("listings").get();
      if (listingsData) {
            listingsData.forEach(doc => {
              if (doc.data().ownerId !== auth().currentUser.uid) {
                newListingsArr.push(doc.data());
              }
            });
            setListings(newListingsArr);
      }
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
  //
  // const headerComponent = () => (
  //
  // )
  //
  // const footerComponent = () => (
  //
  // )

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.body}>
        <View>
          <Text>Header</Text>
        </View>
        <>
          {auth().currentUser && auth().currentUser.isAnonymous && (
            <AuthHint theme={theme} />
          )}
          {listings && (
            <View
              style={{
                width: "100%",
                backgroundColor: theme.colors.background,
                borderRadius: 15,
                alignItems: "center",
              }}
            >
              <CardsGrid
                theme={theme}
                items={listings}
                likes
                screen={"Main"}
                reloadFunction={() => handleReloadBtn()}
              />
            </View>
          )}
        </>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
